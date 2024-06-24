FROM ghcr.io/alwatr/nginx-cdn:2.5.0

WORKDIR /app
COPY . .

# Config nginx
ENV NGINX_ACCESS_LOG="/var/log/nginx/access.log json"

# Copy builded files from last stage
COPY /app/public/ ./

RUN pwd; ls -lAhF;
