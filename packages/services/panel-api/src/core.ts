import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {GecutLogger} from '@gecut/logger';
import {TRPCError, initTRPC} from '@trpc/server';
import ky from 'ky';

import config from './config.js';
import {KavenegarApi} from './utilities/kavenegar.js';
import {ZibalGateWay} from './utilities/payment.gateway.js';

import type {Context} from './utilities/trpc.context.js';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const trpc = initTRPC.context<Context>().create();

export const loggerMiddleware = trpc.middleware((options) => {
  return options.next({
    ctx: {
      log: logger.sub(`[${options.path}: {${options.type.toUpperCase()}}]`),
    },
  });
});

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

export const $PublicProcedure = trpc.procedure.use(loggerMiddleware).use(async (opts) => {
  return opts
    .next()
    .then((v) => {
      opts.ctx.log.methodArgs?.('request', {
        ok: v.ok,
        user: opts.ctx.user
          ? {
            id: opts.ctx.user._id.toString(),
            name: opts.ctx.user.firstName + ' ' + opts.ctx.user.lastName,
          }
          : null,
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
export const db = new KartbookDbConnector(config.DATABASE.URI, logger.sub('db-connector'), {
  appName: 'panel-api',
});
export const microSMS = new KavenegarApi(config.KAVENEGAR_TOKEN, logger);
export const zibalGateway = new ZibalGateWay(config.ZIBAL.PAYMENT, logger);

export const zibalAPILogger = logger.sub('zibal-api');
export const zibalAPI = ky.create({
  prefixUrl: 'https://api.zibal.ir/v1/facility/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + config.ZIBAL.INQUIRY,
  },
  retry: {
    limit: 5,
  },
  redirect: 'follow',
  hooks: {
    beforeRequest: [
      (request) => {
        zibalAPILogger.methodArgs?.('request', {
          url: request.url,
          method: request.method.toUpperCase(),
          headers: request.headers,
          mode: request.mode.toUpperCase(),
        });
      },
    ],
    beforeError: [
      async (error) => {
        zibalAPILogger.error('error', error.name, {
          url: error.request.url,
          body: await error.request.json(),
          result: await error.response.json(),
          message: error.message,
        });

        return error;
      },
    ],
  },
});

logger.property?.('config', config);
