FROM ghcr.io/alwatr/nginx-core:2.5.0

COPY etc/nginx/ /etc/nginx/

ENV NGINX_CLIENT_MAX_BODY_SIZE=1k \
    NGINX_SENDFILE=on \
    NGINX_SENDFILE_MAX_CHUNK=2m \
    NGINX_TCP_NOPUSH=on \
    NGINX_TCP_NODELAY=on \
    NGINX_OPEN_FILE_CACHE="max=5000 inactive=1h" \
    NGINX_OPEN_FILE_CACHE_VALID=30s \
    NGINX_OPEN_FILE_CACHE_MIN_USES=2 \
    NGINX_OUTPUT_BUFFERS="8 8k" \
    NGINX_EXPIRES_DYNAMIC=epoch \
    NGINX_EXPIRES_STATIC=max \
    NGINX_EXPIRES_DEFAULT=epoch \
    NGINX_LIMIT_REQ_RATE=400 \
    NGINX_LIMIT_REQ_BURST=1000 \
    NGINX_GZIP=on \
    NGINX_GZIP_VARY=on \
    NGINX_GZIP_COMP_LEVEL=5 \
    NGINX_GZIP_MIN_LENGTH=256 \
    NGINX_DISABLE_SYMLINKS=if_not_owner

ARG BUILD_REV
ARG BUILD_DATE

LABEL org.opencontainers.image.title="gecut/kartbook/card-api" \
      org.opencontainers.image.description="This is a high-performance version of NGINX, which has been enhanced by Gecut for the purpose of serving JSON content efficiently." \
      org.opencontainers.image.base.name="ghcr.io/alwatr/nginx-core:2.5.0" \
      org.opencontainers.image.version="2.5.0" \
      org.opencontainers.image.ref.name="2.5.0-nginx1.25.4-alpine3.18-slim" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.created=${BUILD_DATE} \
      org.opencontainers.image.revision=${BUILD_REV} \
      org.opencontainers.image.vendor="Gecut" \
      org.opencontainers.image.source="https://github.com/gecut/kartbook" \
      org.opencontainers.image.url="https://github.com/gecut/kartbook" \
      org.opencontainers.image.documentation="https://github.com/gecut/kartbook" \
      org.opencontainers.image.authors="S. MohammadMahdi Zamanian <dev@mm25zamanian.ir> (https://mm25zamanian.ir)"