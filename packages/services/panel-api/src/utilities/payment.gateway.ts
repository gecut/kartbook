import fetch from 'node-fetch';

import type {ZibalResults, ZibalStatus} from '@gecut/kartbook-types';
import type {GecutLogger} from '@gecut/logger';

interface ZibalResponse_Request {
  trackId: number;
  result: number;
  message: string;
}
interface ZibalResponse_Verify {
  paidAt: string;
  amount: number;
  result: ZibalResults;
  status: ZibalStatus;
  refNumber: number;
  description: string;
  cardNumber: string;
  orderId: string;
  message: string;
}

export class ZibalGateWay {
  constructor(merchant: string, rootLogger: GecutLogger) {
    this.merchant = merchant;
    this.logger = rootLogger.sub('zibal');
  }

  merchant: string;
  host = 'gateway.zibal.ir';
  version = 'v1';
  logger;

  request(amount: number, orderId: string, mobile: string) {
    return this.__$request<ZibalResponse_Request>('request', {
      amount,
      orderId,
      mobile,
      callbackUrl: 'https://panel.kartbook.ir/cards/create/callback',
    });
  }
  verify(trackId: number) {
    return this.__$request<ZibalResponse_Verify>('verify', {trackId});
  }

  protected async __$request<R>(action: string, json: Record<string, string | number>) {
    const path = `/${this.version}/${action}`;

    json['merchant'] = this.merchant;

    const url = `https://${this.host}${path}`;

    this.logger.methodArgs?.('__$request', {url, action, params: json, path});

    return await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }

        return response.json() as Promise<R>;
      })
      .then((response) => {
        this.logger.methodFull?.('__$request', {action, params: json, path}, response);

        return response;
      })
      .catch((error) => {
        this.logger.error?.('__$request', error);

        return null;
      });
  }
}
