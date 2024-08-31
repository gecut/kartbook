import {ContextSignal} from '@gecut/signal';

import {client} from '../client/index.js';

import type {PlanData} from '@gecut/kartbook-types';

export const plansContext = new ContextSignal<PlanData[]>('plans', 'IdleCallback');

export async function loadPlans() {
  client.plan.all.query().then((plans) => {
    plansContext.value = plans;
  });
}
