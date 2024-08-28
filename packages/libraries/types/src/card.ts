import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {PlanInterface} from './plan.js';
import type {UserInterface} from './user.js';
import type {Jsonify} from '@gecut/types';

/**
 * Represents a card entity.
 * @extends {Entity}
 */
export interface CardInterface extends Entity {
  /**
   * The card number, divided into four groups of four digits each.
   * @example ['6037', '7015', '0673', '9424']
   * @type {string[]}
   */
  cardNumber: [string, string, string, string];

  /**
   * The IBAN (International Bank Account Number) without the first 'IR' prefix.
   * @type {string}
   */
  iban?: string;

  ownerName?: string;

  /**
   * A unique slug identifier for the card.
   * @type {string}
   */
  slug: string;

  /**
   * The expiration date of the card.
   * @type {Date}
   */
  expireAt: Date;

  /**
   * Indicates whether the card is a premium card.
   * @type {boolean}
   */
  isPremium: boolean;

  /**
   * The owner of the card.
   * @type {UserInterface}
   */
  owner: UserInterface;

  subscription: PlanInterface;
}

export type CardData = Jsonify<CardInterface>;

export const $CardSchema = new Schema<CardInterface>(
  {
    cardNumber: [{type: String, minlength: 4, maxlength: 4, match: /^[0-9]{4}$/, required: true}],
    iban: {type: String, unique: true},
    ownerName: {type: String},
    slug: {type: String, required: true, unique: true},
    isPremium: {type: Boolean, default: false},
    owner: {type: Schema.ObjectId, ref: 'User'},
    subscription: {type: Schema.ObjectId, ref: 'Plan'},
    disabled: {type: Boolean, default: false},

    expireAt: {type: Date},
  },
  {
    timestamps: true,
  },
);

const dayTimeStamps = 24 * 60 * 60 * 1000;

$CardSchema.pre('save', async function (next) {
  const card = await this.populate('subscription');
  const cardExpireAt = Date.now() + card.subscription.duration * dayTimeStamps;

  this.expireAt = new Date(cardExpireAt);

  next();
});