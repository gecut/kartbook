import IranianBanks from '@gecut/kartbook-banks-data';
import {ContextSignal} from '@gecut/signal';

import {userContext} from './user.js';
import {client} from '../client/index.js';

import type {Info as Bank} from '@gecut/kartbook-banks-data';
import type {CardData} from '@gecut/kartbook-types';

export type DataContextType = {
  slug: string;
  cardNumber: [string, string, string, string];
  iban: string;
  owner_name: string;
  bank: Bank;
};

export const cardsContext = new ContextSignal<CardData[]>('cards', 'IdleCallback');
export const selectedCardSlugContext = new ContextSignal<DataContextType>('selected-card-slug', 'AnimationFrame');

cardsContext.subscribe(
  (cards) => {
    const selectedCard = cards?.[0];

    if (selectedCard) {
      setSelectedCard(selectedCard);
    }
  },
  {once: true, receivePrevious: true},
);

export async function setSelectedCard(selectedCard: CardData) {
  selectedCardSlugContext.value = {
    cardNumber: selectedCard.cardNumber,
    iban: selectedCard.iban ?? '',
    owner_name: selectedCard.ownerName ?? selectedCard.owner.firstName + ' ' + selectedCard.owner.lastName,
    slug: selectedCard.slug,
    bank: await IranianBanks.getInfo(selectedCard.cardNumber),
  };
}

export async function loadCards() {
  userContext.requireValue().then(() => {
    client.cards.all.query().then((cards) => {
      cardsContext.value = cards;
    });
  });
}
