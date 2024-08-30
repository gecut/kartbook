import db from '../db/index.js';

import type {ResourceWithOptions} from 'adminjs';

export const resources: Array<ResourceWithOptions> = [
  {
    resource: db.$User,
    options: {},
  },
  {
    resource: db.$Wallet,
    options: {},
  },
  {
    resource: db.$Order,
    options: {},
  },
  {
    resource: db.$Card,
    options: {},
  },
  {
    resource: db.$ValidatedCard,
    options: {},
  },
  {
    resource: db.$Plan,
    options: {},
  },
];
