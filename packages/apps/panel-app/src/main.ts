import {loadUser, userContext} from './contexts/user.js';
import {envvm} from './utilities/envvm.js';

window.addEventListener('load', () => {
  const userToken = envvm.get('user-token');

  if (userToken) {
    loadUser().then(() => {
      userContext.requireValue().then(() => {
        return import('./ui/app-index.js');
      });
    });
  }
  else {
    import('./ui/app-index.js');
  }
});
