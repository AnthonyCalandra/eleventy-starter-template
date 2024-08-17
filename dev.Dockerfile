FROM node:22-alpine

EXPOSE 8080

ENV TZ=America/New_York

USER node
WORKDIR /app

COPY --chown=node package*.json .
RUN npm install

COPY --chown=node . .

ENTRYPOINT [ "npx", "@11ty/eleventy", "--serve", "--port=8080" ]
