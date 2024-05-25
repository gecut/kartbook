import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {GecutLogger} from '@gecut/logger';
import {initTRPC} from '@trpc/server';
import config from './config.js';
import {KavenegarApi} from './utilities/kavenegar.js';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const trpc = initTRPC.create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = trpc.router;
export const publicProcedure = trpc.procedure.use((opts) => {
  return opts
    .next()
    .then((v) => {
      logger.methodArgs?.(opts.path, {
        context: opts.ctx,
        input: opts.input,
        type: opts.type,
        ok: v.ok,
      });

      return v;
    })
    .catch((r) => {
      logger.error?.(opts.path, r);

      return r;
    });
});
export const logger = new GecutLogger('panel-api');
export const db = new KartbookDbConnector(config.DATABASE.URI, logger.sub('db-connector'));
export const microSMS = new KavenegarApi(config.KAVENEGAR_TOKEN, logger);

logger.property?.('config', config);
