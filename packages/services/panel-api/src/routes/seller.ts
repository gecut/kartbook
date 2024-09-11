import {db, router, $UserProcedure} from '../core.js';

import type {OrderData} from '@gecut/kartbook-types';

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
      .populate('customer')) as unknown as OrderData[];
  }),
});

export default seller;
