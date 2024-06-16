import type mongoose from 'mongoose';

export interface Entity {
  _id: mongoose.Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}
