import {env} from '@gecut/utilities/env.js';

export default {
  SERVER: {
    HOST: env('HOST', '0.0.0.0', 'string'),
    PORT: env('PORT', 8083, 'number'),
  },
  DATABASE: {
    URI: env('DB_URI', '', 'string'),
  },
  KAVENEGAR_TOKEN: env('KAVENEGAR_TOKEN', '', 'string'),
};
