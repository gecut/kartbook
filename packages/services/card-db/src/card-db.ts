import http from 'node:http';

import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import {GecutLogger} from '@gecut/logger';

import config from './config.js';

const logger = new GecutLogger('card-db');
const db = new KartbookDbConnector(config.DATABASE.URI, logger.sub('db'), {
  appName: 'card-db',
});

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400, 'BAD REQUEST');
    return response.end('BAD REQUEST');
  }

  const slug = request.url.split('/').pop();

  if (!slug) {
    response.writeHead(400, 'BAD REQUEST');
    return response.end('BAD REQUEST');
  }

  const card = await db.$Card
    .findOne({
      slug: slug,
    })
    .populate('owner');

  if (!card) {
    response.writeHead(404, {'Content-Type': 'application/json'});

    return response.end(
      JSON.stringify({
        ok: false,
        data: {
          error: 'card-not-found',
          message: 'Card Not Found',
        },
      }),
    );
  }

  if (card.disabled) {
    response.writeHead(403, {'Content-Type': 'application/json'});

    return response.end(
      JSON.stringify({
        ok: false,
        data: {
          error: 'card-disabled',
          message: 'Card Disabled',
        },
      }),
    );
  }

  response.writeHead(200, {'Content-Type': 'application/json'});

  return response.end(
    JSON.stringify({
      ok: true,
      data: card,
    }),
  );
});

db.connect().then(async () => {
  logger.other?.('DB Connected');

  await db.init();

  logger.other?.('DB Initialized');

  server.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
    console.log(`Server running on port ${config.SERVER.HOST}:${config.SERVER.PORT}`);
  });

  logger.other?.('Server Launched', {devMode: logger.devMode});
});
