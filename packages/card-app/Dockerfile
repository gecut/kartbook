FROM ghcr.io/alwatr/node:21.7.1 as builder

RUN apk add --no-cache git;
RUN set -ex; corepack enable;

COPY . .

RUN set -eux; \
  yarn install --immutable; \
  yarn build; \
  ls -lahF .; \
  ls -RlahF /app/packages/card-app;

# ---

FROM ghcr.io/alwatr/nginx-pwa:2.5.0 as nginx

COPY --from=builder /app/packages/card-app/dist/ .

RUN pwd; ls -lAhF;

EXPOSE 80
