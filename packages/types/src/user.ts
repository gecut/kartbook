import {Schema} from 'mongoose';

import type {Entity} from './_base';

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

  /**
   * The user who made the call (optional).
   */
  caller?: UserInterface;

  isAdmin: boolean;
}

export const $UserSchema = new Schema<UserInterface>(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: false},
    caller: {type: Schema.ObjectId, ref: 'User', required: false},
    isAdmin: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
