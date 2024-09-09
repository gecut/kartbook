import {arrayUtils} from '@gecut/utilities/data-types/array.js';
import {numberUtils} from '@gecut/utilities/data-types/number.js';

import type mongoose from 'mongoose';

const digits = ['A', 'B', 'C', 'X', 'Y', 'Z'];
export const generateDiscountCode = () => {
  return (
    arrayUtils.random.choice(digits) +
    numberUtils.random.number(99, 11) +
    arrayUtils.random.choice(digits) +
    numberUtils.random.number(99, 11)
  );
};

export interface Entity {
  _id: mongoose.Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}

export type ZibalStatus = -1 | -2 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ZibalResults = 100 | 102 | 103 | 104 | 201 | 202 | 203;
