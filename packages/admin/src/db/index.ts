import {Database, Resource} from '@adminjs/mongoose';
import {KartbookDbConnector} from '@gecut/kartbook-db-connector';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({Database, Resource});

const db = new KartbookDbConnector(process.env.DB_URI as string, undefined, {
  appName: 'admin',
});

export default db;
