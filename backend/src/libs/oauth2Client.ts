import { googleAuthCredentials } from '@/config';
import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  googleAuthCredentials.CLIENT_ID,
  googleAuthCredentials.CLIENT_SECRET,
  googleAuthCredentials.REDIRECT_URL
);
