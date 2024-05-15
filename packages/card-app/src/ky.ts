import ky from 'ky';

export const api = ky.extend({
  prefixUrl: import.meta.env.API_URL ?? 'https://kbcs.darkube.app/',
  method: 'get',
});
