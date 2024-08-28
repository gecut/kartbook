FROM ghcr.io/alwatr/nginx-cdn:2.5.0

# Config nginx
ENV NGINX_ACCESS_LOG="/var/log/nginx/access.log json"

COPY etc/nginx/ /etc/nginx/
COPY public/ ./

RUN pwd; ls -lAhF;
