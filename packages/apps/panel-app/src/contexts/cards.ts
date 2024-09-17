import IranianBanks from '@gecut/kartbook-banks-data';
import {ContextSignal} from '@gecut/signal';

import {userContext} from './user.js';
import {client} from '../client/index.js';
import {cardDialogSetter} from '../ui/components/card-dialog.js';

import type {Info as Bank} from '@gecut/kartbook-banks-data';
import type {CardData} from '@gecut/kartbook-types';

export type SelectedCardType = {
  card: CardData;
  owner_name: string;
  bank: Bank;
};

export const cardsContext = new ContextSignal<CardData[]>('cards', 'IdleCallback');
export const selectedCardContext = new ContextSignal<SelectedCardType>('selected-card-slug', 'AnimationFrame');

cardsContext.subscribe(
  (cards) => {
    const oldSelectedCard = selectedCardContext.value;
    const newSelectedCard = cards.find((card) => card._id === oldSelectedCard?.card._id);

    if (!oldSelectedCard && !newSelectedCard) {
      const selectedCard = cards?.[0];

      if (selectedCard) {
        setSelectedCard(selectedCard);
      }
    }
    else if (newSelectedCard) {
      setSelectedCard(newSelectedCard);
    }
  },
  {receivePrevious: true},
);

selectedCardContext.subscribe(cardDialogSetter('default'), {priority: -1000, receivePrevious: true});

export async function setSelectedCard(selectedCard: CardData) {
  const [bank] = await Promise.all([IranianBanks.getInfo(selectedCard.cardNumber)]);

  selectedCardContext.value = {
    card: selectedCard,
    owner_name: selectedCard.ownerName || selectedCard.owner.firstName + ' ' + selectedCard.owner.lastName,
    bank,
  };
}

export async function loadCards() {
  userContext.requireValue().then(() => {
    client.card.all.query().then((cards) => {
      cardsContext.value = cards;
    });
  });
}
