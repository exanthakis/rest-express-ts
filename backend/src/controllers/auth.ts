import crypto from 'crypto';
import { NextFunction, type Request, type Response } from 'express';
import { oauth2Client } from '@/libs/oauth2Client';
import common, { googleAuthCredentials } from '@/config';
import { google } from 'googleapis';
import { createUser, findUser } from '@/services/user';
import { IUser } from '@/models/user';
import { createTokens } from '@/controllers/tokens';

const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  const state = crypto.randomBytes(32).toString('hex');

  req.session.state = state;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: googleAuthCredentials.SCOPES,
    include_granted_scopes: true,
    state,
  });

  res.redirect(authorizationUrl);
};

const googleAuthCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const { NODE_ENV, CLIENT_URL, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } =
    common;

  if (error) {
    return res.status(400).json({
      message: 'Google OAuth error',
      error,
    });
  }

  if (typeof code !== 'string') {
    return res.status(400).json({
      message: 'Missing authorization code',
    });
  }

  if (typeof state !== 'string' || state !== req.session.state) {
    return res.status(400).json({
      message: 'State mismatch',
    });
  }

  // State should only be used once
  delete req.session.state;

  try {
    // Exchange Google's authorization code for tokens
    const { tokens: googleTokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(googleTokens);

    const peopleApi = google.people({
      version: 'v1',
      auth: oauth2Client,
    });

    const userInfo = await peopleApi.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });

    if (
      !userInfo.data.names?.[0]?.givenName ||
      !userInfo.data.names?.[0]?.familyName ||
      !userInfo.data.emailAddresses?.[0]?.value ||
      !userInfo?.data?.photos?.[0]?.url
    ) {
      console.error("Didn't retrieve required data from Google");
      return res.sendStatus(500);
    }

    console.log('Google user:', userInfo.data);

    const userFound = await findUser({
      email: userInfo?.data?.emailAddresses[0].value,
    });

    let userId = userFound?._id;
    if (!userFound) {
      try {
        const user: IUser = {
          name: {
            first: userInfo?.data?.names[0]?.givenName,
            last: userInfo?.data?.names[0]?.familyName,
          },
          email: userInfo?.data?.emailAddresses[0].value,
          photo: {
            url: userInfo?.data?.photos[0]?.url,
          },
        };

        const newUser = await createUser(user);
        userId = newUser?._id;
        console.log(newUser);
      } catch (err) {
        console.error('Error creating user');
      }
    }

    if (!userId) {
      console.error('Unable to resolve user id for token creation');
      return res.sendStatus(500);
    }

    const { access_token, refresh_token } = createTokens({ userId });

    res.cookie('access_token', access_token, {
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie('refresh_token', refresh_token, {
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(REFRESH_TOKEN_MAX_AGE),
    });

    res.redirect(`${CLIENT_URL}/app`);
  } catch (err) {
    console.error('Google error', err);

    return res.status(502).json({
      message: 'Google authentication failed',
    });
  }
};

const logoutHandler = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);

      return res.status(500).json({
        message: 'Failed to logout',
      });
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('connect.sid');

    return res.status(200).json({
      message: 'Logged out successfully',
    });
  });
};

export { googleAuth, googleAuthCallback, logoutHandler };
