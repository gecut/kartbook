import {ContextSignal} from '@gecut/signal';
import {TRPCClientError} from '@trpc/client';

import {loadCards} from './cards.js';
import {loadPlans} from './plans.js';
import {client} from '../client/index.js';
import {envvm} from '../utilities/envvm.js';

import type {UserData} from '@gecut/kartbook-types';

export const userContext = new ContextSignal<UserData>('user', 'IdleCallback');

export async function loadUser() {
  const token = envvm.get('user-token');

  if (token !== '') {
    return await client.user.info
      .query()
      .then((user) => (userContext.value = user))
      .then(() => loadCards())
      .then(() => loadPlans())
      .then(() => true)
      .catch((cause) => {
        const error = TRPCClientError.from(cause);

        if (error.message === 'unauthorized') {
          envvm.remove('user-token');

          window.location.reload();
        }


        return false;
      });
  }

  return false;
}
