import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {Jsonify} from '@gecut/types';

/**
 * cache of validated cards information
 * @extends {Entity}
 */
export interface ValidatedCardInterface extends Entity {
  /**
   * The card number, divided into four groups of four digits each.
   * @example '6037701506739424'
   * @type {string[]}
   */
  cardNumber: string;

  /**
   * The IBAN (International Bank Account Number) without the first 'IR' prefix.
   * @type {string}
   */
  iban: string;

  ownerName: string;
}

export type ValidatedCardData = Jsonify<ValidatedCardInterface>;

export const $ValidatedCardSchema = new Schema<ValidatedCardInterface>(
  {
    cardNumber: {type: String, unique: true, required: true},
    iban: {type: String, required: true, trim: true},
    ownerName: {type: String, required: true, trim: true},
    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
