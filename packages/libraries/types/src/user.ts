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

  phoneNumberVerified: boolean;

  /**
   * The user's email address (optional).
   */
  email?: string;

  /**
   * The user who made the call (optional).
   */
  caller?: UserInterface;

  isAdmin: boolean;

  isSeller: boolean;

  token: string;

  otp?: OTPInterface;

  wallet: WalletInterface;
}

export type UserData = Jsonify<UserInterface>;

export const $UserSchema = new Schema<UserInterface>(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true, unique: true},
    phoneNumberVerified: {type: Boolean, default: true},
    email: {type: String, required: false},
    caller: {type: Schema.ObjectId, ref: 'User', required: false},
    isAdmin: {type: Boolean, default: false},
    isSeller: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    token: {type: String, default: uid, unique: true},
    wallet: {type: Schema.ObjectId, ref: 'Wallet'},
    otp: new Schema<OTPInterface>({
      code: {type: String},
      expiredAt: {type: Number},
    }),
  },
  {
    timestamps: true,
  },
);
