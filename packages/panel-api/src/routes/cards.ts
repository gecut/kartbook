import {db, router, $UserProcedure} from '../core.js';

import type {CardData} from '@gecut/kartbook-types';

const cards = router({
  all: $UserProcedure.query((opts) => {
    const cards = db.$Card
      .find({
        owner: opts.ctx.user,
      })
      .populate('owner');

    return cards as unknown as CardData[];
  }),
});

export default cards;
