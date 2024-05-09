import type mongoose from 'mongoose';

export interface Entity {
  _id: mongoose.Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}

export type StringifyEntity<T extends Entity> = Omit<T, '_id' | 'createdAt'> & {
  _id?: string;

  createdAt?: string;
};
