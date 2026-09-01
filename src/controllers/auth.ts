import crypto from 'crypto';
import { type Request, type Response } from 'express';
import { oauth2Client } from '@/libs/oauth2Client';
import { googleAuthCredentials } from '@/config';

export const googleAuth = (req: Request, res: Response) => {
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
