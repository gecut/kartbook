import {Schema} from 'mongoose';
import {uid} from '@gecut/utilities/uid.js';

import type {Entity} from './_base.js';

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

  otp?: {
    code: string;
    expiredAt: number;
  };
}

export const $UserSchema = new Schema<UserInterface>(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true, unique: true},
    phoneNumberVerified: {type: Boolean, default: true},
    email: {type: String, required: false, unique: true},
    caller: {type: Schema.ObjectId, ref: 'User', required: false},
    isAdmin: {type: Boolean, default: false},
    isSeller: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    token: {type: String, default: uid, unique: true},
    otp: {
      code: {type: String},
      expiredAt: {type: Date},
    },
  },
  {
    timestamps: true,
  },
);
