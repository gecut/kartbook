import {ContextSignal} from '@gecut/signal';

import type {UserData} from '@gecut/kartbook-types';
import type {PartialDeep} from '@gecut/types';

export const userPartialContext = new ContextSignal<PartialDeep<UserData>>('user.partial');

userPartialContext.value = {};
