#!/usr/bin/env bash

source .env
docker run \
    --rm \
    -v $(pwd)/content:/app/content \
    -v $(pwd)/public:/app/public \
    -v $(pwd)/eleventy.config.js:/app/eleventy.config.js \
    -v $SSL_FULLCHAIN_PATH:/etc/ssl/certs/chain.pem:ro \
    -v $SSL_PRIVKEY_PATH:/etc/ssl/private/key.pem:ro \
    -p 8080:8080 \
    --name blog-dev \
    blog-dev:latest
