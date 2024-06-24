import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {GecutLogger} from '@gecut/logger';
import {TRPCError, initTRPC} from '@trpc/server';

import config from './config.js';
import {KavenegarApi} from './utilities/kavenegar.js';

import type {Context} from './utilities/trpc.context.js';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const trpc = initTRPC.context<Context>().create();
export const authorizeMiddleware = trpc.middleware((options) => {
  if (options.ctx.user == null) {
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'unauthorized'});
  }

  return options.next({
    ctx: {
      user: options.ctx.user,
    },
  });
});

export const adminMiddleware = trpc.middleware((options) => {
  if (options.ctx.user?.isAdmin != true) {
    throw new TRPCError({code: 'FORBIDDEN', message: 'user-forbidden'});
  }

  return options.next({
    ctx: {
      user: options.ctx.user,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = trpc.router;

export const $PublicProcedure = trpc.procedure.use(async (opts) => {
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
      logger.error(opts.path, r);

      return r;
    });
});
export const $UserProcedure = $PublicProcedure.use(authorizeMiddleware);
export const $AdminProcedure = $UserProcedure.use(adminMiddleware);

export const logger = new GecutLogger('panel-api');
export const db = new KartbookDbConnector(config.DATABASE.URI, logger.sub('db-connector'));
export const microSMS = new KavenegarApi(config.KAVENEGAR_TOKEN, logger);

logger.property?.('config', config);
