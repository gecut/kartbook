import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {CardInterface} from '@gecut/kartbook-types';
import {GecutLogger} from '@gecut/logger';
import {InMemorySimpleCache} from '@gecut/utilities/cache/in-memory.simple.js';
import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {etag} from 'hono/etag';
import {timing} from 'hono/timing';
import config from './config';

export const logger = new GecutLogger('card-server');
export const app = new Hono();
export const db = new KartbookDbConnector(config.DATABASE.URI);
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
  app.use(timing());
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
} else {
  app.use(compress());
}

app.use(etag());
