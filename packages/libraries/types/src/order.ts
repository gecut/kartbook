import {Schema} from 'mongoose';

import {type CardInterface} from './card.js';
import {type PlanInterface} from './plan.js';

import type {Entity, ZibalResults, ZibalStatus} from './_base.js';
import type {DiscountInterface} from './discount.js';
import type {UserInterface} from './user.js';
import type {Jsonify} from '@gecut/types';

export interface OrderInterface extends Entity {
  card: Pick<CardInterface, 'cardNumber' | 'iban' | 'ownerName' | 'slug' | 'isPremium'>;
  plan: Pick<PlanInterface, 'name' | 'duration' | 'price' | 'isPremium'>;

  discount?: DiscountInterface;
  customer: UserInterface;

  trackId?: number;
  ref?: number;
  amount?: number;
  result?: ZibalResults;
  status?: ZibalStatus;
}

export type OrderData = Jsonify<OrderInterface>;

export const $OrderSchema = new Schema<OrderInterface>(
  {
    card: {
      cardNumber: [{type: String, minlength: 4, maxlength: 4, match: /^[0-9]{4}$/, required: true}],
      iban: {type: String},
      ownerName: {type: String},
      slug: {type: String, required: true},
      isPremium: {type: Boolean, default: false},
    },
    plan: {
      name: {type: String},
      duration: {type: Number},
      price: {type: Number},
      isPremium: {type: Boolean, default: false},
    },

    trackId: {type: Number, required: false},
    ref: {type: Number, required: false},
    amount: {type: Number, required: false},
    result: {type: Number, required: false},
    status: {type: Number, required: false},

    discount: {type: Schema.ObjectId, ref: 'Discount'},
    customer: {type: Schema.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  },
);
