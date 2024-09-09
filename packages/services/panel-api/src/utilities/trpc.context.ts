import {db} from '../core.js';

import type {UserInterface} from '@gecut/kartbook-types/user.js';
import type {inferAsyncReturnType} from '@trpc/server';
import type {CreateNextContextOptions} from '@trpc/server/adapters/next';

async function getUserFromHeader(request: CreateNextContextOptions['req']) {
  const authorization = request.headers['authorization'];

  if (authorization != null) {
    const token = String(authorization).replace('Bearer ', '');

    try {
      const user = await db.$User.findOne({token, disabled: false}).populate('wallet');

      if (user?.disabled != true) return user as UserInterface;
    }
    catch (error) {
      return null;
    }
  }

  return null;
}

export async function createContext({req}: CreateNextContextOptions) {
  const user = await getUserFromHeader(req);

  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
