import mongoose from 'mongoose';

export interface IUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  photo: {
    url: string;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  name: { first: String, last: String },
  email: { type: String, required: true, unique: true },
  photo: {
    url: String,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
