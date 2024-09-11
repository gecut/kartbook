import {TRPCError} from '@trpc/server';
import {z} from 'zod';

import {verifyDiscount} from '../controllers/verify-discount.js';
import {db, router, $UserProcedure, zibalGateway} from '../core.js';

import type {DiscountData, DiscountInterface, OrderData, UserInterface} from '@gecut/kartbook-types';

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
      let caller: UserInterface | null = null;

      if (discountCode) {
        const _discount = await db.$Discount
          .findOne({
            code: discountCode,
            disabled: false,
          })
          .populate(['filters.targetPlans']);

        if (_discount == null) {
          caller = await db.$User.findOne({
            disabled: false,
            'seller.sellerCode': discountCode,
            'seller.isSeller': true,
          });

          if (caller != null) {
            discount = new db.$Discount({
              code: caller.seller.sellerCode,
              discount: caller.seller.salesDiscount,
              discountType: 'decimal',
            });
          }
        } else if (caller) {
          discount = verifyDiscount(_discount, planId);
        }
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
        discount: caller == null ? discount : null,
        caller,
        callerSeller:
          caller != null
            ? {
                salesBonus: caller.seller.salesBonus,
                salesDiscount: caller.seller.salesDiscount,
                sellerCode: caller.seller.sellerCode ?? 'unknown',
              }
            : undefined,
      });

      discount = null;

      try {
        await order.save();
      } catch (error) {
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

        const [_order, _card, _discount] = await Promise.all([
          order.save(),
          card.save(),
          order.discount?._id?.toString() != null
            ? db.$Discount.findByIdAndUpdate(order.discount._id, {$inc: {usageCount: 1}})
            : Promise.resolve(null),
        ]);

        opts.ctx.log.property?.('order', _order);
        opts.ctx.log.property?.('card', _card);
        opts.ctx.log.property?.('discount', _discount);

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

    if (
      order == null ||
      order.trackId != trackId ||
      order.result != null ||
      order.customer._id.toString() != opts.ctx.user._id.toString()
    )
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

    const [_order, _card, _discount] = await Promise.all([
      order.save(),
      card.save(),
      order.discount?._id?.toString() != null
        ? db.$Discount.findByIdAndUpdate(order.discount._id, {$inc: {usageCount: 1}})
        : Promise.resolve(null),
    ]);

    opts.ctx.log.property?.('order', _order);
    opts.ctx.log.property?.('card', _card);
    opts.ctx.log.property?.('discount', _discount);

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

        opts.ctx.log.property?.('discountCode', discountCode);
        opts.ctx.log.property?.('planId', planId);

        const discount = await db.$Discount
          .findOne({
            code: discountCode,
            disabled: false,
          })
          .populate(['filters.targetPlans']);

        if (discount == null) {
          const caller = await db.$User.findOne({
            disabled: false,
            'seller.sellerCode': discountCode,
            'seller.isSeller': true,
          });

          opts.ctx.log.property?.('caller', caller);

          if (caller != null) {
            return {
              code: caller.seller.sellerCode,
              discount: caller.seller.salesDiscount,
              discountType: 'decimal',
            } as DiscountData;
          }
        }

        return verifyDiscount(discount, planId) as unknown as DiscountData;
      }),
  }),
});

export default order;
