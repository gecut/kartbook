import {GecutState} from '@gecut/lit-helper';

import {userContext} from './user.js';
import {client} from '../client/index.js';

import type {OrderData} from '@gecut/kartbook-types';

export const invitesState = new GecutState<OrderData[]>('invites');

userContext.subscribe((user) => {
  if (user?.seller?.isSeller === true) {
    client.seller.invites
      .query()
      .then(
        (invites) => (invitesState.value = invites.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))),
      );
  }
});
