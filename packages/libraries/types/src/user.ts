import {uid} from '@gecut/utilities/uid.js';
import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {WalletInterface} from './wallet.js';
import type {Jsonify} from '@gecut/types';

export interface OTPInterface {
  code: string;
  expiredAt: number;
}
/**
 * Represents a user entity.
 */
export interface UserInterface extends Entity {
  /**
   * The user's first name.
   */
  firstName: string;

  /**
   * The user's last name.
   */
  lastName: string;

  /**
   * The user's phone number.
   */
  phoneNumber: string;

  /**
   * The user's email address (optional).
   */
  email?: string;

  isAdmin: boolean;

  isSeller: boolean;

  token: string;

  otp?: OTPInterface;

  wallet: WalletInterface;

  sellerCode?: string;

  nationalCode?: string;
  birthday?: Date;
}

export type UserData = Jsonify<UserInterface>;

export const $UserSchema = new Schema<UserInterface>(
  {
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    phoneNumber: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: false, trim: true},
    isAdmin: {type: Boolean, default: false},
    isSeller: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    token: {type: String, default: uid, unique: true, trim: true},
    wallet: {type: Schema.ObjectId, ref: 'Wallet'},
    otp: new Schema<OTPInterface>({
      code: {type: String},
      expiredAt: {type: Number},
    }),

    sellerCode: {type: String, required: false, unique: true},

    nationalCode: {type: String, required: false, unique: true, trim: true},
    birthday: {type: Date, required: false},
  },
  {
    timestamps: true,
  },
);
