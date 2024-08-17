#!/usr/bin/env bash

source .env
echo $PRIVATE_POSTS_PASSWORD | htpasswd -i -c .htpasswd $PRIVATE_POSTS_USERNAME
