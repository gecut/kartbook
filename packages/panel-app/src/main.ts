import {loadUser, userContext} from './ui/contexts/user.js';
import {envvm} from './ui/utilities/envvm.js';

window.addEventListener('load', () => {
  const userToken = envvm.get('user-token');

  if (userToken) {
    loadUser();

    userContext.requireValue().then(() => {
      return import('./ui/app-index.js');
    });
  }
  else {
    import('./ui/app-index.js');
  }
});
