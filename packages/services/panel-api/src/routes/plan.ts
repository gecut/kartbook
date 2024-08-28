import {db, router, $UserProcedure} from '../core.js';

import type {PlanData} from '@gecut/kartbook-types';

const plan = router({
  all: $UserProcedure.query(() => {
    return db.$Plan.find({disabled: false}) as Promise<PlanData[]>;
  }),
});

export default plan;
