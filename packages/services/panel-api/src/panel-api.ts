import {createHTTPServer} from '@trpc/server/adapters/standalone';
import cors from 'cors';

import config from './config.js';
import {db, logger, $PublicProcedure, router} from './core.js';
import card from './routes/card.js';
import order from './routes/order.js';
import plan from './routes/plan.js';
import seller from './routes/seller.js';
import user from './routes/user.js';
import {createContext} from './utilities/trpc.context.js';

const appRouter = router({
  health: $PublicProcedure.query(() => 'Gecut Web Server (KartBook Panel Api)'),
  user,
  card,
  plan,
  order,
  seller,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

db.connect().then(() => {
  logger.other?.('Database Connected');

  db.init().then(() => {
    logger.other?.('Database Initialized');

    server.listen(config.SERVER.PORT, config.SERVER.HOST);

    logger.other?.('Server Launched On', 'http://' + config.SERVER.HOST + ':' + config.SERVER.PORT);
  });
});
