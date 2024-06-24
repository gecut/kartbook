import {ContextSignal} from '@gecut/signal';

import {userContext} from './user.js';
import {client} from '../client/index.js';

import type {CardData} from '@gecut/kartbook-types';

export const cardsContext = new ContextSignal<CardData[]>('cards', 'IdleCallback');
export const selectedCardSlugContext = new ContextSignal<string>('selected-card-slug', 'AnimationFrame');

cardsContext.subscribe(
  (cards) => {
    const slug = cards?.[0]?.slug;

    if (slug) {
      selectedCardSlugContext.value = slug;
    }
  },
  {once: true, receivePrevious: true},
);

export async function loadCards() {
  userContext.requireValue().then(() => {
    client.cards.all.query().then((cards) => {
      cardsContext.value = cards;
    });
  });
}
