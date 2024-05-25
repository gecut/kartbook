import ky from 'ky';

export const api = ky.extend({
  prefixUrl: 'https://api.k32.ir/',
  method: 'get',
});
