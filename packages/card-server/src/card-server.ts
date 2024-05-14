import {serve} from '@hono/node-server';

import config from './config';
import {db, logger, app} from './core';
import './routes/cards';

app.get('/', (c) => c.redirect('/server-info'));
app.get('/server-info', (c) => c.text('Gecut Web Server', 200));

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
    console.log,
  );

  logger.other?.('Server Launched', {devMode: logger.devMode});
});
