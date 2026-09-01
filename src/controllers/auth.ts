import crypto from 'crypto';
import { type Request, type Response } from 'express';
import { oauth2Client } from '@/libs/oauth2Client';
import { googleAuthCredentials } from '@/config';
import { google } from 'googleapis';

const googleAuth = (req: Request, res: Response) => {
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

  console.log('query', req.query);

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
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

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
      !userInfo.data.emailAddresses?.[0]?.value
    ) {
      console.error("Didn't retrieve required data from Google");
      return res.sendStatus(500);
    }

    console.log('Google user:', userInfo.data);

    return res.status(200).json({
      message: 'Google authentication successful',
      user: userInfo.data,
    });
  } catch (err) {
    console.error('Google error', err);

    return res.status(502).json({
      message: 'Google authentication failed',
    });
  }
};

export { googleAuth, googleAuthCallback };
