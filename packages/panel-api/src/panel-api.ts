import {createHTTPServer} from '@trpc/server/adapters/standalone';
import user from './routes/user.js';
import {db, logger, publicProcedure, router} from './core.js';
import config from './config.js';

const appRouter = router({
  health: publicProcedure.query(() => 'Gecut Web Server (KartBook Panel Api)'),
  user,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

db.connect().then(() => {
  logger.other?.('Database Connected');

  db.init().then(() => {
    logger.other?.('Database Initialized');

    server.listen(config.SERVER.PORT, config.SERVER.HOST).on('listening', () => {
      logger.other?.('Server Launched On', 'http://' + config.SERVER.HOST + ':' + config.SERVER.PORT);
    });
  });
});