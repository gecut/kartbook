import {TRPCError} from '@trpc/server';

import type {DiscountInterface} from '@gecut/kartbook-types';

export function verifyDiscount(discount: DiscountInterface | null, planId: string): DiscountInterface {
  if (discount == null) throw new TRPCError({code: 'NOT_FOUND', message: 'discount-not-found'});

  if (
    discount.filters.targetPlans != null &&
    discount.filters.targetPlans.length > 0 &&
    discount.filters.targetPlans.find((plan) => plan._id.toString() == planId) == null
  )
    throw new TRPCError({code: 'FORBIDDEN', message: 'discount-not-applicable-to-this-plan'});

  if (discount.filters.maxUsage != null && discount.filters.maxUsage <= discount.usageCount)
    throw new TRPCError({code: 'FORBIDDEN', message: 'discount-usage-limit-exceeded'});

  const now = Date.now();

  if (discount.filters.startDate != null && new Date(discount.filters.startDate).getTime() > now)
    throw new TRPCError({code: 'FORBIDDEN', message: 'discount-not-yet-started'});

  if (discount.filters.endDate != null && new Date(discount.filters.endDate).getTime() < now)
    throw new TRPCError({code: 'FORBIDDEN', message: 'discount-has-expired'});

  return discount;
}
