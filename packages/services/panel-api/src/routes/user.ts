import {numberUtils} from '@gecut/utilities/data-types/number.js';
import {uid} from '@gecut/utilities/uid.js';
import {TRPCError} from '@trpc/server';
import z from 'zod';

import {db, microSMS, $PublicProcedure, router, $UserProcedure} from '../core.js';

import type {UserData} from '@gecut/kartbook-types';

const user = router({
  info: $UserProcedure.query((opts) => opts.ctx.user as unknown as UserData),
  has: $PublicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
      }),
    )
    .query(async (opts) => {
      const {phoneNumber} = opts.input;

      return (await db.$User.exists({phoneNumber: phoneNumber}))?._id;
    }),
  create: $PublicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),

        phoneNumber: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const {firstName, lastName, phoneNumber} = opts.input;

      const user = await db.$User.create({
        firstName,
        lastName,
        phoneNumber,
        wallet: (
          await db.$Wallet.create({
            balance: 0,
            transactions: [],
          })
        )._id,
      });

      return user as unknown as UserData;
    }),
  otp: router({
    send: $PublicProcedure
      .input(
        z.object({
          userId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        let user = await db.$User.findById(opts.input.userId).orFail(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
          });
        });

        if (user.otp?.code == null || Date.now() > user.otp.expiredAt) {
          delete user.otp;

          user.otp = {
            code: numberUtils.random.number(999999, 111111).toString(),
            expiredAt: Date.now() + 300000, // 5 minutes
          };

          user = await user.save();
        }

        if (user.otp?.code) {
          microSMS.lookup({
            template: 'signin',
            receptor: user.phoneNumber,
            token: user.otp.code ?? '000000',
          });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return 'Code Sended';
      }),

    verify: $PublicProcedure
      .input(
        z.object({
          userId: z.string(),
          otpCode: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const user = await db.$User.findById(opts.input.userId).orFail(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'user-not-found',
          });
        });

        if (user.otp?.code !== opts.input.otpCode)
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'otp-code-not-invalid',
          });

        if (Date.now() > user.otp.expiredAt) {
          delete user.otp;

          await user.save();

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'otp-code-expired',
          });
        }

        user.token ??= uid();

        await user.save();

        return user.token;
      }),
  }),
});

export default user;
