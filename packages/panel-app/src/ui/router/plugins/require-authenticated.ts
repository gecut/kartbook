import {userContext} from '../../contexts/user.js';
import {envvm} from '../../utilities/envvm.js';

import type {Plugin} from '@thepassle/app-tools/router.js';

const requireAuthenticated = (redirect: string): Plugin => ({
  name: 'requireAuthenticated',
  shouldNavigate: () =>
    ({
      condition: async () => {
        if (envvm.get('user-token').trim() === '') return false;

        const user = await userContext.requireValue();

        return !!user;
      },
      redirect,
    }) as any,
});

export default requireAuthenticated;
