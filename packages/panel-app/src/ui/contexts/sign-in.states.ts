import {ContextSignal} from '@gecut/signal';

export const signInStatesContext = new ContextSignal<'tel' | 'otp' | 'info'>('sign-in.states', 'AnimationFrame');

signInStatesContext.setValue('tel');
