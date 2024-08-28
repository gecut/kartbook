import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {Jsonify} from '@gecut/types';

export interface PlanInterface extends Entity {
  name: string;
  htmlTitle: string;

  /**
   * Duration to day
   *
   * @example
   * 30 // a month
   */
  duration: number;
  price: number;
  isPremium: boolean;

  patternUrl?: string;
}

export type PlanData = Jsonify<PlanInterface>;

export const $PlanSchema = new Schema<PlanInterface>(
  {
    name: {type: String},
    htmlTitle: {type: String},
    duration: {type: Number},
    price: {type: Number},
    isPremium: {type: Boolean, default: false},
    patternUrl: {type: String, required: false},
    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
