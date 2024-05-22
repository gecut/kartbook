import ky from 'ky';

export const api = ky.extend({
  prefixUrl: import.meta.env.API_URL ?? 'https://api.k32.ir/',
  method: 'get',
});
