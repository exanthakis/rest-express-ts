export default {
  PORT: Number(process.env.PORT) || 5001,
  NODE_ENV: process.env.NODE_ENV || 'mano',
  CLIENT_URL: (process.env.CLIENT_URL as string) || 'http://localhost:5173',
};
