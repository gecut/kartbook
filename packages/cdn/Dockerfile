FROM ghcr.io/alwatr/nginx-cdn:2.5.0

# Config nginx
ENV NGINX_ACCESS_LOG="/var/log/nginx/access.log json"

# Copy builded files from last stage
COPY ./public/ ./

RUN pwd; ls -lAhF;
