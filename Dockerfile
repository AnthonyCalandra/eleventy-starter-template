FROM node:22-alpine AS build-stage

ENV TZ=America/New_York
ENV NODE_ENV=production

USER node
WORKDIR /app

COPY --chown=node package*.json .
RUN npm install

COPY --chown=node . .
RUN npx @11ty/eleventy

FROM nginx:alpine AS production-stage

ENV TZ=America/New_York

EXPOSE 80 443

COPY --from=build-stage --chown=nginx /app/_site /usr/share/nginx/html
COPY --chown=nginx .htpasswd /etc/nginx/.htpasswd
COPY --chown=nginx nginx.conf /etc/nginx/nginx.conf

USER nginx
