import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {db, router, $UserProcedure, zibalGateway} from '../core.js';

import type {CardData, OrderData} from '@gecut/kartbook-types';

const order = router({
  create: $UserProcedure
    .input(
      z.object({
        cardNumber: z.string().array().length(4),
        iban: z.string(),
        ownerName: z.string(),
        slug: z.string(),
        planId: z.string(),

        discountCode: z.string().length(6).optional(),
        premiumCode: z.string().length(5).startsWith('P').optional(),
      }),
    )
    .mutation(async (opts) => {
      const {cardNumber, iban, ownerName, planId, slug} = opts.input;

      const plan = await db.$Plan.findById(planId);

      if (plan == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
        });

      const amount = plan.price;

      const order = new db.$Order({
        card: {
          cardNumber,
          iban,
          ownerName,
          slug,
        },

        plan: {
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          isPremium: plan.isPremium,
        },

        amount,
        customer: opts.ctx.user,
      });

      try {
        await order.save();
      }
      catch (error) {
        console.error(error);
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', cause: error});
      }

      const zibal = await zibalGateway.request(amount, order._id.toString(), opts.ctx.user.phoneNumber);

      if (zibal == null || zibal.result != 100) {
        order.deleteOne();

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      order.trackId = zibal.trackId;

      await order.save();

      return order as unknown as OrderData;
    }),
  verify: $UserProcedure.input(z.object({trackId: z.number(), orderId: z.string()})).mutation(async (opts) => {
    const {trackId, orderId} = opts.input;
    const order = await db.$Order.findById(orderId);

    if (order == null || order.trackId != trackId || order.result != null) throw new TRPCError({code: 'NOT_FOUND'});

    const verifiedData = await zibalGateway.verify(order.trackId);

    if (verifiedData == null) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR'});

    order.ref = verifiedData.refNumber;
    order.result = verifiedData.result;
    order.status = verifiedData.status;

    if (order.status != 1 && order.status != 2) {
      await order.save();

      throw new TRPCError({code: 'FORBIDDEN', message: 'payment-not-success'});
    }

    const plan = await db.$Plan.findOne({
      name: order.plan.name,
      duration: order.plan.duration,
      price: order.plan.price,
      isPremium: order.plan.isPremium,
    });

    if (plan == null) throw new TRPCError({code: 'NOT_FOUND', message: 'subscription-plan-not-found'});

    const card = new db.$Card({
      cardNumber: order.card.cardNumber,
      iban: order.card.iban,
      ownerName: order.card.ownerName,
      slug: order.card.slug,
      subscription: plan,
      owner: order.customer,
    });

    const [_order, _card] = await Promise.all([order.save(), card.save()]);

    // TODO: Send a SMS to message of created card

    return _card as unknown as CardData;
  }),
});

export default order;
