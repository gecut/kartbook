import {ContextSignal} from '@gecut/signal';

export const titleContext = new ContextSignal<string>('title', 'IdleCallback');
