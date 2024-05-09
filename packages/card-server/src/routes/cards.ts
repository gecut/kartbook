import {zValidator} from '@hono/zod-validator';
import {z} from 'zod';
import {app, getCardBySlug} from '../core';
import {startTime, endTime} from 'hono/timing';

app.get('/:slug', zValidator('param', z.object({slug: z.string()})), async (c) => {
  const {slug} = c.req.valid('param');

  startTime(c, 'db');

  const card = await getCardBySlug(slug);

  endTime(c, 'db');

  if (!card) {
    return c.json(
      {
        ok: false,
        data: {
          error: 'card-not-found',
          message: 'Card Not Found',
        },
      },
      404,
    );
  }

  if (card.disabled) {
    return c.json(
      {
        ok: false,
        data: {
          error: 'card-disabled',
          message: 'Card Disabled',
        },
      },
      403,
    );
  }

  return c.json({
    ok: true,
    data: card,
  });
});
