import { IUser, User } from '@/models/user';

const findUser = async (query: Partial<IUser>) => {
  return User.findOne(query).lean();
};

const createUser = async (user: IUser) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (err) {
    const reason = err instanceof Error ? err?.message : String(err);
    console.error(`Error creating new user, ${reason}`);
  }
};

export { findUser, createUser };
