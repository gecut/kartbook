import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {verifyDiscount} from '../controllers/verify-discount.js';
import {db, router, $UserProcedure, zibalGateway} from '../core.js';

import type {DiscountData, DiscountInterface, OrderData} from '@gecut/kartbook-types';

const order = router({
  create: $UserProcedure
    .input(
      z.object({
        cardNumber: z.string().array().length(4),
        iban: z.string(),
        ownerName: z.string(),
        slug: z.string(),
        planId: z.string(),

        discountCode: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const {cardNumber, iban, ownerName, planId, slug, discountCode} = opts.input;

      const plan = await db.$Plan.findById(planId);

      if (plan == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
        });

      let discount: DiscountInterface | null = null;

      if (discountCode) {
        discount = verifyDiscount(
          await db.$Discount
            .findOne({
              code: discountCode,
              disabled: false,
            })
            .populate(['filters.targetPlans']),
          planId,
        );
      }

      const subscriptionPrice = plan.price;
      const discountPercentage = Math.min(discount?.discountType === 'percentage' ? discount?.discount : -1, 100);
      const discountDecimal =
        discountPercentage > 0 ? subscriptionPrice * (discountPercentage / 100) : discount?.discount || 0;

      const amount = subscriptionPrice - discountDecimal;

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
        discount,
      });

      try {
        await order.save();
      }
      catch (error) {
        console.error(error);
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', cause: error});
      }

      if (order.amount === 0) {
        const card = new db.$Card({
          cardNumber: order.card.cardNumber,
          iban: order.card.iban,
          ownerName: order.card.ownerName,
          slug: order.card.slug,
          subscription: plan,
          owner: order.customer,
        });

        order.status = 1;
        order.trackId = Date.now();

        const [_order, _card] = await Promise.all([order.save(), card.save()]);

        return order as unknown as OrderData;
      }

      const zibal = await zibalGateway.request(amount, order._id.toString(), opts.ctx.user.phoneNumber);

      if (zibal == null || zibal.result != 100) {
        order.deleteOne();

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'payment-gateway-error',
        });
      }

      order.trackId = zibal.trackId;

      await order.save();

      return order as unknown as OrderData;
    }),
  verify: $UserProcedure.input(z.object({trackId: z.number(), orderId: z.string()})).mutation(async (opts) => {
    const {trackId, orderId} = opts.input;
    const order = await db.$Order.findById(orderId).populate(['customer', 'discount']);

    if (order == null || order.trackId != trackId || order.result != null || order.customer._id != opts.ctx.user._id)
      throw new TRPCError({code: 'NOT_FOUND'});

    if (order.status === 1) return order as unknown as OrderData;

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

    const [_order, _card] = await Promise.all([
      order.save(),
      card.save(),
      (async () => {
        if (order.discount) {
          await db.$Discount.findByIdAndUpdate(order.discount._id, {usageCount: order.discount.usageCount + 1});
        }
      })(),
    ]);

    // TODO: Send a SMS to message of created card

    return _order as unknown as OrderData;
  }),

  discount: router({
    get: $UserProcedure
      .input(
        z.object({
          discountCode: z.string(),
          planId: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const {discountCode, planId} = opts.input;

        const discount = await db.$Discount
          .findOne({
            code: discountCode,
            disabled: false,
          })
          .populate(['filters.targetPlans']);

        return verifyDiscount(discount, planId) as unknown as DiscountData;
      }),
  }),
});

export default order;
