#!/usr/bin/env bash

source .env
docker run \
    --detach \
    --restart unless-stopped \
    -v $SSL_FULLCHAIN_PATH:/usr/local/nginx/conf/fullchain.pem:ro \
    -v $SSL_PRIVKEY_PATH:/usr/local/nginx/conf/privkey.pem:ro \
    -p 443:443 -p 80:80 \
    --name blog \
    blog:latest || {
        exitcode=$?
        echo "docker run failed with exit code: $exitcode"
        exit 1
    }
