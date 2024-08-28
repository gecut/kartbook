import type mongoose from 'mongoose';

export interface Entity {
  _id: mongoose.Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}

export type ZibalStatus = -1 | -2 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ZibalResults = 100 | 102 | 103 | 104 | 201 | 202 | 203;
