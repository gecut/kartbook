import {
  UserInterface,
  $UserSchema,
  WalletInterface,
  $WalletSchema,
  CardInterface,
  $CardSchema,
} from '@gecut/kartbook-types';
import {ResourceWithOptions} from 'adminjs';
import mongoose from 'mongoose';

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
