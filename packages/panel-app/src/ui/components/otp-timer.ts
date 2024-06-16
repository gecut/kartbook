import {GecutAsyncDirective} from '@gecut/lit-helper/directives/async-directive.js';
import {noChange} from 'lit';
import {directive} from 'lit/directive.js';

import type {PartInfo} from 'lit-html/async-directive.js';

class OtpTimerDirective extends GecutAsyncDirective {
  constructor(partInfo: PartInfo) {
    super(partInfo, 'otp-timer');
  }

  protected timer?: number;

  override render(): unknown {
    if (!this.timer) {
      const time = Date.now() + 60 * 1_000 * 2;

      this.timer = setInterval(() => {
        const now = Date.now();
        const diff = time - now;

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        if (seconds + minutes <= 0) {
          clearInterval(this.timer);
        }

        this.setValue(`${minutes}:${seconds}`);
      }, 500);

      this.setValue('2:00');
    }

    return noChange;
  }

  protected override disconnected(): void {
    super.disconnected();
    clearInterval(this.timer);
  }
}

export const otpTimer = directive(OtpTimerDirective);
