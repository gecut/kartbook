import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {GecutLogger} from '@gecut/logger';
import {InMemorySimpleCache} from '@gecut/utilities/cache/in-memory.simple.js';
import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {cors} from 'hono/cors';
import {etag} from 'hono/etag';
import {timing} from 'hono/timing';

import config from './config';

import type {CardInterface} from '@gecut/kartbook-types';

export const logger = new GecutLogger('card-server');
export const app = new Hono();
export const db = new KartbookDbConnector(config.DATABASE.URI, logger.sub('db-connector'));
export const cardsInMemoryCache = new InMemorySimpleCache<CardInterface>(512);

export const getCardBySlug = async (slug: string) => {
  if (cardsInMemoryCache.has(slug)) {
    setTimeout(async () => {
      const card = await db.$Card
        .findOne({
          slug: slug,
        })
        .populate('owner');

      if (card) {
        cardsInMemoryCache.set(slug, card);
      }
    }, 0);

    const card = cardsInMemoryCache.get(slug)!;

    logger.methodFull?.('getCardBySlug', {slug, fromCache: true}, card);

    return card;
  }

  const card = await db.$Card
    .findOne({
      slug: slug,
    })
    .populate('owner');

  if (card) {
    cardsInMemoryCache.set(slug, card);
  }

  logger.methodFull?.('getCardBySlug', {slug, fromCache: false}, card);

  return card;
};

if (logger.devMode) {
  app.use(async (context, next) => {
    logger.methodArgs?.('request', {
      url: context.req.path,
    });
    await next();
    logger.methodArgs?.('response', {
      url: context.req.path,
      status: `${context.res.status} ${context.res.ok ? 'Ok' : 'Error'}`,
    });
  });
}
else {
  app.use(compress());
}

app.use(timing({enabled: logger.devMode}));
app.use(etag());
app.use(
  cors({
    origin: '*',
  }),
);

logger.property?.('config', config);
