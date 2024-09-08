import {GecutState} from '@gecut/lit-helper';
import {html} from 'lit/html.js';

import type {ArrayValues} from '@gecut/types';

export function $AgentRequestPage() {
  const states = ['request', 'under-review', 'confirmed', 'rejected', 'loading'] as const;
  const state = new GecutState<ArrayValues<typeof states>>('state', 'loading');

  return html``;
}
