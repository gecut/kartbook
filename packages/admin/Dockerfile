FROM ghcr.io/alwatr/node:21.7.1 as builder

RUN apk add --no-cache git;
RUN set -ex; corepack enable;

COPY . .

RUN set -eux; \
  yarn install --immutable; \
  yarn build; \
  ls -lahF .; \
  ls -RlahF /app/packages/admin;

ENV HOST="0.0.0.0" \
    PORT="80"

EXPOSE 80

CMD ["yarn", "node", "/app/packages/admin/dist/app.js"]

