import {$CardSchema, $UserSchema, $WalletSchema} from '@gecut/kartbook-types';
import {GecutLogger} from '@gecut/logger';
import mongoose from 'mongoose';

import type {CardInterface, UserInterface, WalletInterface} from '@gecut/kartbook-types';

export class KartbookDbConnector {
  constructor(uri: string, logger?: GecutLogger, options?: mongoose.ConnectOptions) {
    this.uri = uri;
    this.options = options;
    this.logger = logger ?? new GecutLogger('db-connector');
  }

  $User = mongoose.model<UserInterface>('User', $UserSchema);
  $Wallet = mongoose.model<WalletInterface>('Wallet', $WalletSchema);
  $Card = mongoose.model<CardInterface>('Card', $CardSchema);

  connector?: typeof mongoose;

  protected uri: string;
  protected options?: mongoose.ConnectOptions;
  protected logger: GecutLogger;

  async connect() {
    if (this.uri.startsWith('mongodb://') || this.uri.startsWith('mongodb+srv://')) {
      this.logger.method?.('connect');
      try {
        return (this.connector = await mongoose.connect(this.uri, this.options));
      }
      catch (error) {
        return this.logger.error('connect', 'connect_failed', error);
      }
    }

    this.logger.error('connect', 'uri_not_valid', {uri: this.uri, options: this.options});

    return null;
  }

  async init() {
    if (this.connector == null) return;

    const userCount = await this.$User.countDocuments();
    const cardCount = await this.$Card.countDocuments();

    if (userCount === 0) {
      const user = await this.$User
        .create({
          firstName: 'سید محمدمهدی',
          lastName: 'زمانیان',
          email: 'dev@mm25zamanian.ir',
          phoneNumber: '09155595488',
          isAdmin: true,
        })
        .then((user) => user.save());

      await this.$Wallet
        .create({
          balance: 0,
          transactions: [],
          owner: user.id,
        })
        .then((user) => user.save());
    }

    if (cardCount === 0) {
      const user = await this.$User.findOne({});

      if (user != null) {
        await this.$Card
          .create({
            cardNumber: ['6219', '8619', '6850', '8969'],
            iban: '440560611828005683666001',
            expireAt: new Date(+new Date().setHours(0, 0, 0, 0) + 86400000),
            owner: user._id,
            slug: 'zmn',
          })
          .then((user) => user.save());
      }
    }
  }
}
