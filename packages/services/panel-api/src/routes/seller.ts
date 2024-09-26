import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {db, router, $UserProcedure, $PublicProcedure} from '../core.js';

import type {OrderData, TransactionInterface} from '@gecut/kartbook-types';

const seller = router({
  invites: $UserProcedure.query(async (opts) => {
    return (await db.$Order
      .find(
        {
          caller: opts.ctx.user,
          $or: [{status: 1}, {status: 2}],
        },
        null,
      )
      .populate(['customer', 'caller'])) as unknown as OrderData[];
  }),
  withdrawal: $UserProcedure
    .input(
      z.object({
        amount: z.number(),
        iban: z.string(),
      }),
    )
    .mutation((opts) => {
      const now = new Date();
      const dayOfMonth = now.getDate();

      if (dayOfMonth > 5) throw new TRPCError({code: 'FORBIDDEN', message: 'date-expired-to-withdrawal'});

      return db.$Wallet
        .findByIdAndUpdate(opts.ctx.user.wallet._id, {
          $push: {
            transactions: <TransactionInterface>{
              amount: opts.input.amount,
              type: 'withdrawal',
              status: 'in-progress',
              iban: opts.input.iban,
            },
          },
        })
        .orFail(() => new TRPCError({code: 'NOT_FOUND'}));
    }),
  canWithdrawal: $PublicProcedure.query(() => {
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth > 5) return false;

    return true;
  }),
});

export default seller;
