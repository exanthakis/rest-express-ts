import { findUserById } from '@/services/user';
import { type Request, type Response } from 'express';
import { Types } from 'mongoose';
import { verifyToken } from './tokens';

const getProfile = async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({
      code: 'AccessTokenError',
      message: 'Access token is required',
    });
    return;
  }

  const [scheme, accessToken] = authorization?.split(' ');

  if (scheme !== 'Bearer' || !accessToken) {
    res.status(401).json({
      code: 'AccessTokenError',
      message: 'Malformed authorization header',
    });
    return;
  }

  let userId: Types.ObjectId;

  try {
    const token = verifyToken(accessToken) as { userId: Types.ObjectId };
    userId = token.userId;
  } catch (err) {
    res.status(401).json({
      code: 'AccessTokenError',
      message: 'Access token is invalid or expired',
    });
    return;
  }
  console.log('userId', userId);
  try {
    const profile = await findUserById(String(userId));
    return res.json(profile);
  } catch (err) {
    console.error('Error getting current user', err);
    res.sendStatus(500);
  }
};

export { getProfile };
