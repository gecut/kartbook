import {AdminJSOptions} from 'adminjs';

import componentLoader from './component-loader.js';
import {resources} from './resources.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/',
  loginPath: '/sign-in',
  logoutPath: '/sign-out',
  resources,
  databases: [],
  branding: {
    companyName: 'Gecut',
    withMadeWithLove: true,
  },
  version: {
    admin: true,
    app: '1.0.0-beta.0',
  },
};

export default options;
