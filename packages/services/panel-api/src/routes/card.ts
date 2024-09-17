import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {db, router, $UserProcedure, zibalAPI} from '../core.js';

import type {CardData, ValidatedCardData} from '@gecut/kartbook-types';

const card = router({
  all: $UserProcedure.query((opts) => {
    const cards = db.$Card
      .find({
        owner: opts.ctx.user,
      })
      .populate(['owner', 'subscription']);

    return cards as unknown as CardData[];
  }),
  slugExist: $UserProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const {slug} = opts.input;

      return (await db.$Card.countDocuments({slug})) > 0;
    }),
  cardNumberExist: $UserProcedure
    .input(
      z.object({
        cardNumber: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const {cardNumber} = opts.input;

      return (await db.$Card.countDocuments({cardNumber})) > 0;
    }),
  authorize: $UserProcedure
    .input(
      z.object({
        cardNumber: z.string(),
      }),
    )
    .mutation(async (opts): Promise<ValidatedCardData> => {
      const {cardNumber} = opts.input;
      const validatedCard = await db.$ValidatedCard.findOne({cardNumber});

      if (validatedCard != null) return validatedCard as unknown as ValidatedCardData;

      const ownerName = await zibalAPI
        .post('cardInquiry/', {json: {cardNumber}})
        .json<{data: {name: string}}>()
        .then((response) => response.data.name)
        .catch(() => null);

      const iban = await zibalAPI
        .post('cardToIban/', {json: {cardNumber}})
        .json<{data: {IBAN: string}}>()
        .then((response) => response.data.IBAN.replace('IR', ''))
        .catch(() => null);

      if (ownerName == null || iban == null)
        throw new TRPCError({code: 'NOT_FOUND', message: 'سرویس دهنده ای برای استعلام یافت نشد.'});

      return (await db.$ValidatedCard.create({
        cardNumber,
        ownerName,
        iban,
      })) as unknown as ValidatedCardData;
    }),
  toggleDisabled: $UserProcedure.input(z.object({id: z.string()})).mutation(async (opts) => {
    const card = await db.$Card.findOne({
      _id: opts.input.id,
      owner: opts.ctx.user,
    });

    if (!card) throw new TRPCError({code: 'NOT_FOUND'});

    card.disabled = !(card.disabled ?? false);

    await card.save();

    return card as unknown as CardData;
  }),
});

export default card;
