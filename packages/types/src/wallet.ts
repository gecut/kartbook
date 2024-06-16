import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {UserInterface} from './user.js';
import type {Jsonify} from '@gecut/types';

/**
 * Represents a transaction.
 */
export interface TransactionInterface {
  /**
   * Type of transaction. Can be either 'withdrawal' (send money to user) or 'deposit' (receive money from user).
   */
  type: 'withdrawal' | 'deposit';

  /**
   * Amount of money involved in the transaction.
   */
  amount: number;
}

/**
 * Represents a wallet.
 */
export interface WalletInterface extends Entity {
  /**
   * Current balance of the wallet.
   */
  balance: number;

  /**
   * List of transactions associated with the wallet.
   */
  transactions: TransactionInterface[];

  /**
   * Owner of the wallet.
   */
  owner: UserInterface;
}

export type WalletData = Jsonify<WalletInterface>;

export const $WalletSchema = new Schema<WalletInterface>(
  {
    balance: Number,
    owner: {type: Schema.ObjectId, ref: 'User'},
    transactions: [
      {
        type: String,
        amount: Number,
      },
    ],
    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
