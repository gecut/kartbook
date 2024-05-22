import {$UserSchema, $WalletSchema, $CardSchema} from '@gecut/kartbook-types';
import {ResourceWithOptions} from 'adminjs';
import mongoose from 'mongoose';

import type {UserInterface, WalletInterface, CardInterface} from '@gecut/kartbook-types';

export const resources: Array<ResourceWithOptions> = [
  {
    resource: mongoose.model<UserInterface>('User', $UserSchema),
    options: {},
  },
  {
    resource: mongoose.model<WalletInterface>('Wallet', $WalletSchema),
    options: {},
  },
  {
    resource: mongoose.model<CardInterface>('Card', $CardSchema),
    options: {},
  },
];
