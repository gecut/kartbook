import {$CardSchema, $UserSchema, $WalletSchema} from '@gecut/kartbook-types';
import mongoose from 'mongoose';

import type {CardInterface, UserInterface, WalletInterface} from '@gecut/kartbook-types';

export class KartbookDbConnector {
  constructor(uri: string, options?: mongoose.ConnectOptions) {
    this.uri = uri;
    this.options = options;
  }

  $User = mongoose.model<UserInterface>('User', $UserSchema);
  $Wallet = mongoose.model<WalletInterface>('Wallet', $WalletSchema);
  $Card = mongoose.model<CardInterface>('Card', $CardSchema);

  connector?: typeof mongoose;

  protected uri: string;
  protected options?: mongoose.ConnectOptions;

  async connect() {
    await mongoose.connect(this.uri, this.options);
  }

  async init() {
    const userCount = await this.$User.countDocuments();
    const cardCount = await this.$Card.countDocuments();

    if (userCount === 0) {
      const user = await this.$User
        .create({
          firstName: 'MohammadMahdi',
          lastName: 'Zamanian',
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
