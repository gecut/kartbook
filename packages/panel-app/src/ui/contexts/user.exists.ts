import {ContextSignal} from '@gecut/signal';

export const userExistsContext = new ContextSignal<boolean>('user.exists');
