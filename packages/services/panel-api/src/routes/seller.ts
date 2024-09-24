import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {db, router, $UserProcedure} from '../core.js';

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
});

export default seller;
