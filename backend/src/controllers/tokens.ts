import config from '@/config';
import jwt from 'jsonwebtoken';

const createTokens = (payload: string | Buffer | object) => {
  const {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_MAX_AGE,
  } = config;

  const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: Number(ACCESS_TOKEN_MAX_AGE),
  });

  const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: Number(REFRESH_TOKEN_MAX_AGE),
  });

  return { access_token, refresh_token };
};

const verifyToken = (token: string) => {
  const { ACCESS_TOKEN_SECRET } = config;

  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export { createTokens, verifyToken };
