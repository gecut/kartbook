import {
  $CardSchema,
  $UserSchema,
  $WalletSchema,
  $PlanSchema,
  $ValidatedCardSchema,
  $OrderSchema,
  $DiscountSchema,
  $AgentRequestSchema,
} from '@gecut/kartbook-types';
import {GecutLogger} from '@gecut/logger';
import mongoose from 'mongoose';

import type {
  AgentRequestInterface,
  CardInterface,
  DiscountInterface,
  OrderInterface,
  UserInterface,
  ValidatedCardInterface,
  WalletInterface,
} from '@gecut/kartbook-types';
import type {PlanInterface} from '@gecut/kartbook-types/plan.js';

export class KartbookDbConnector {
  constructor(uri: string, logger?: GecutLogger, options?: mongoose.ConnectOptions) {
    options = {
      dbName: 'main',

      ...(options ?? {}),
    };

    this.uri = uri;
    this.options = options;
    this.logger = logger ?? new GecutLogger('db-connector');
  }

  $Card = mongoose.model<CardInterface>('Card', $CardSchema);
  $Discount = mongoose.model<DiscountInterface>('Discount', $DiscountSchema);
  $Order = mongoose.model<OrderInterface>('Order', $OrderSchema);
  $Plan = mongoose.model<PlanInterface>('Plan', $PlanSchema);
  $User = mongoose.model<UserInterface>('User', $UserSchema);
  $ValidatedCard = mongoose.model<ValidatedCardInterface>('ValidatedCard', $ValidatedCardSchema);
  $Wallet = mongoose.model<WalletInterface>('Wallet', $WalletSchema);
  $AgentRequest = mongoose.model<AgentRequestInterface>('AgentRequest', $AgentRequestSchema);

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
    const walletCount = await this.$Wallet.countDocuments();
    const planCount = await this.$Plan.countDocuments();
    const cardCount = await this.$Card.countDocuments();
    const orderCount = await this.$Order.countDocuments();
    const validatedCardCount = await this.$ValidatedCard.countDocuments();
    const discountCount = await this.$Discount.countDocuments();
    const agentRequestCount = await this.$AgentRequest.countDocuments();

    this.logger.methodArgs?.('init', {
      userCount,
      walletCount,
      planCount,
      cardCount,
      orderCount,
      validatedCardCount,
      discountCount,
      agentRequestCount,
    });

    if (userCount + walletCount + planCount + discountCount < 5) {
      await this.connector?.connection?.db?.dropDatabase();

      const wallet = await this.$Wallet.create({
        balance: 0,
        transactions: [],
      });

      const user = await this.$User.create({
        firstName: 'سید محمدمهدی',
        lastName: 'زمانیان',
        email: 'dev@mm25zamanian.ir',
        phoneNumber: '09155595488',
        isAdmin: true,
        wallet,
        seller: {
          isSeller: true,
          salesBonus: 800_000,
          salesDiscount: 400_000,

          birthday: new Date(2005, 11, 15),
          nationalCode: '0927865041',
          sellerCode: 'U00S00',
        },
      });

      this.logger.property?.('user', await user.populate('wallet'));

      const plan1 = await this.$Plan.create({
        duration: 31,
        name: 'پلن ماهانه',
        htmlTitle: '',
        isPremium: false,
        price: 490_000,
      });

      this.logger.property?.('plan1', plan1);

      const plan2 = await this.$Plan.create({
        duration: 366,
        name: 'پلن سالانه',
        htmlTitle:
          '<span>اشتراک ویژه <span style="font-size:28px;color:#fcc200;font-weight:bolder;">12</span> ماه</span>',
        isPremium: false,
        price: 2_990_000,
        patternUrl: 'https://cdn.k32.ir/card.pattern.webp',
      });

      this.logger.property?.('plan2', plan2);

      const discount = await this.$Discount.create({
        code: 'KBROOT',
        discount: 100,
        discountType: 'percentage',
        name: 'Root',
        filters: {
          maxUsage: 5,
        },
      });

      this.logger.property?.('discount', discount);
    }
  }
}
