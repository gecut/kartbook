import {Schema} from 'mongoose';

import {generateDiscountCode, type Entity} from './_base.js';

import type {PlanInterface} from './plan.js';
import type {Jsonify} from '@gecut/types';

/**
 * Represents a card entity.
 * @extends {Entity}
 */
export interface DiscountInterface extends Entity {
  code: string;
  name: string;
  description?: string;
  usageCount: number;

  discount: number;
  discountType: 'decimal' | 'percentage';

  filters: {
    targetPlans?: PlanInterface[];
    maxUsage?: number;
    startDate?: Date;
    endDate?: Date;
  };
}

export type DiscountData = Jsonify<DiscountInterface>;

export const $DiscountSchema = new Schema<DiscountInterface>(
  {
    code: {type: String, required: true, unique: true, default: generateDiscountCode, trim: true},
    name: {type: String, required: true, trim: true},
    description: String,
    usageCount: {type: Number, required: true, default: 0},

    discount: {type: Number, required: true},
    discountType: {type: String, required: true, enum: ['decimal', 'percentage']},

    filters: {
      targetPlans: [{type: Schema.ObjectId, ref: 'Plan'}],
      maxUsage: Number,
      startDate: Date,
      endDate: Date,
    },

    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
