import {buildAuthenticatedRouter} from '@adminjs/express';
import AdminJS from 'adminjs';
import express from 'express';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import db from './db/index.js';

const port = process.env.PORT || 3000;

const start = async () => {
  const app = express();

  await db.connect();
  await db.init();

  const admin = new AdminJS(options);

  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET ?? '',
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    },
  );

  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
