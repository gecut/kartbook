import {envvm} from './envvm.js';

export function isAuthenticated(): boolean {
  return envvm.get('user-token').trim().length > 0;
}
