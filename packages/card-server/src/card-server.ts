import {serve} from '@hono/node-server';
import {db, logger, app} from './core';

import './routes/cards';
import config from './config';

db.connect().then(async () => {
  logger.other?.('DB Connected');

  await db.init();

  logger.other?.('DB Initialized');

  serve(
    {
      fetch: app.fetch,
      hostname: config.SERVER.HOST,
      port: config.SERVER.PORT,
    },
    logger.other,
  );

  logger.other?.('Server Launched', {devMode: logger.devMode});
});
