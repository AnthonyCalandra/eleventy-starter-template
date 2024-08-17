# eleventy-starter-template

Eleventy is a static blog generator.

This template comes with:

* Containerization
* Pre-configured packages
* HTTPS (HTTP redirection)
* Opinionated structure
* Atom syndication
* Syntax highlighting
* Private blog posts

## How-To

### Configure SSL

Add to `.env`:
```bash
SSL_FULLCHAIN_PATH=/path/to/your/fullchain.pem
SSL_PRIVKEY_PATH=/path/to/your/privkey.pem
```
The `start.sh` and `start-dev.sh` scripts will mount these paths to the container.

### Run a production server

```bash
npm run build
npm run production
```

### Run a live-reload development server

```bash
npm run build:dev
npm run dev
```

### Generate `.htpasswd` for private blog

Add to `.env`:
```bash
PRIVATE_POSTS_USERNAME=username
PRIVATE_POSTS_PASSWORD=password
```
Then run the following to create the `.htpasswd` and rebuild the production docker image:
```bash
npm run generate:htpasswd && npm build:production
```

## Author

Anthony Calandra
