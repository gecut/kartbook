import {GecutLogger} from '@gecut/logger';
import fetch from 'node-fetch';

export interface KavenegarResponse {
  return: {
    status: number;
  };
  entries: Array<unknown> | null;
}
export interface SendOptions {
  receptor: string[];
  message: string;
  sender?: string;
}
export interface VerifyOptions {
  receptor: string;
  template: string;
  token: string;
  token2?: string;
  token3?: string;
  type?: string;
}

export class KavenegarApi {
  constructor(apiKey: string, rootLogger: GecutLogger) {
    this.apiKey = apiKey;
    this.logger = rootLogger.sub('kavenegar');
  }

  apiKey: string;
  host = 'api.kavenegar.com';
  version = 'v1';
  logger;

  send(options: SendOptions) {
    options = this.sanitize(options);

    this.logger.methodArgs?.('send', options);

    return this.request('sms', 'send', {...options, receptor: options.receptor.join(',')});
  }

  lookup(options: VerifyOptions) {
    options = this.sanitize(options);

    this.logger.methodArgs?.('lookup', options);

    return this.request('verify', 'lookup', {...options});
  }

  protected async request(action: string, method: string, params: Record<string, string>) {
    const path = `/${this.version}/${this.apiKey}/${action}/${method}.json`;

    this.logger.methodArgs?.('request', {action, method, params, path});

    return await fetch(`http://${this.host}${path}`, {
      method: 'POST',
      body: new URLSearchParams(params),
    })
      .then((response) => response.json() as Promise<KavenegarResponse>)
      .then((response) => {
        this.logger.methodFull?.('request', {action, method, params, path}, response);

        return response;
      });
  }

  private sanitize<T extends object>(obj: T): Required<T> {
    this.logger.methodArgs?.('sanitize', obj);

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (!obj[key]) {
          delete obj[key];
        }
      }
    }

    return obj as Required<T>;
  }
}
