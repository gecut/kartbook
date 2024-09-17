import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {ArrayValues, Jsonify} from '@gecut/types';

export const TransactionTypes = ['withdrawal', 'deposit'] as const;
export const TransactionStatuses = ['in-progress', 'done', 'rejected'] as const;

/**
 * Represents a transaction.
 */
export interface TransactionInterface {
  /**
   * Type of transaction. Can be either 'withdrawal' (send money to user) or 'deposit' (receive money from user).
   */
  type: ArrayValues<typeof TransactionTypes>;
  status: ArrayValues<typeof TransactionStatuses>;
  message?: string;

  /**
   * Amount of money involved in the transaction.
   */
  amount: number;

  iban?: string;
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
}

export type WalletData = Jsonify<WalletInterface>;

export const $WalletSchema = new Schema<WalletInterface>(
  {
    balance: Number,
    transactions: [
      new Schema<TransactionInterface>(
        {
          type: {type: String, required: true, enum: TransactionTypes},
          status: {type: String, required: true, enum: TransactionStatuses},
          message: String,
          amount: {type: Number, required: true},
          iban: {type: String, trim: true},
        },
        {
          timestamps: true,
        },
      ),
    ],
    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);

$WalletSchema.pre('save', async function (next) {
  this.balance = this.transactions
    .map((transaction) => {
      if (transaction.type === 'withdrawal' && transaction.status === 'rejected') return -transaction.amount;
      if (transaction.type === 'deposit') return transaction.amount;

      return 0;
    })
    .reduce((p, c) => p + c, 0);

  next();
});
