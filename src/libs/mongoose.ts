import { db } from '@/config';
import mongoose, { type ConnectOptions } from 'mongoose';

const connectionOptions: ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'google-oauth-rest-api-express',
};

const connectDb = async (): Promise<void> => {
  const { MONGO_URI } = db;

  try {
    await mongoose.connect(MONGO_URI as string, connectionOptions);
    console.info('Database connected successfully');
  } catch (err) {
    console.error('Failed to connect to db');

    throw err instanceof Error
      ? err
      : new Error(`Failed to connect to database: ${err}`);
  }
};

const disconnectDb = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.info('Database disconnected successfully');
  } catch (err) {
    console.error('Error during disconnecting db');
  }
};

export { connectDb, disconnectDb };
