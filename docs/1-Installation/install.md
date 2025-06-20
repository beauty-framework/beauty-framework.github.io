---
sidebar_position: 1
---

# Installation

Beauty Framework can be installed either via Docker (recommended) or manually using Composer and RoadRunner.


## 🚀 Recommended: Docker Setup

### 1. Create a new project:

```bash
composer create-project beauty-framework/app my-service
cd my-service
```

### 2. Copy the environment file:

```bash
cp .env.example .env
```

### 3. Set your database name:

In the `.env` file, set the `DB_DATABASE` value:

```dotenv
DB_DATABASE=my_service
```

### 4. Edit Docker settings:

* In `docker-compose.yml`, update the network name:

  ```yaml
  networks:
    default:
      name: your-custom-network-name
  ```
* Update container name prefixes (e.g., `bf-app`, `bf-redis`) to your own project prefix.

### 5. Start the services:

The Docker setup includes everything you need to get started:

* PHP with RoadRunner
* Redis
* PostgreSQL (with default credentials from `.env`)

To launch the environment, run:

```bash
make up
```

This will bring up the full environment with PHP, Redis, RoadRunner and all required services.

Dockerfile is located in `.docker/php/Dockerfile`.
<details>
  <summary>Docker</summary>

  <details>
    <summary>**Dockerfile:**</summary>

      ```dockerfile
  FROM ghcr.io/roadrunner-server/roadrunner:2024 AS roadrunner

FROM php:8.4-alpine AS base

ARG WWWUSER=1000
ARG WWWGROUP=1000

RUN --mount=type=bind,from=mlocati/php-extension-installer:2,source=/usr/bin/install-php-extensions,target=/usr/local/bin/install-php-extensions \
    apk add --no-cache libtool autoconf g++ make protobuf-dev protobuf unzip curl \
    && install-php-extensions \
        @composer-2 \
        opcache \
        zip \
        bcmath \
        sockets \
        pcntl \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        amqp \
        redis \
        msgpack \
        grpc \
        intl \
    && curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v24.4/protoc-24.4-linux-x86_64.zip \
    && unzip protoc-24.4-linux-x86_64.zip -d /usr/local \
    && rm protoc-24.4-linux-x86_64.zip

COPY --from=roadrunner /usr/bin/rr /usr/local/bin/rr

WORKDIR /var/www

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY ./composer.json ./composer.lock ./
RUN composer install --no-dev --optimize-autoloader || true

COPY .docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

RUN addgroup -g ${WWWGROUP} appuser \
    && adduser -u ${WWWUSER} -G appuser -s /bin/sh -D appuser

FROM base AS prod

COPY . .

USER appuser

EXPOSE 8080

CMD ["rr", "serve", "-c", ".rr.yaml"]

FROM base AS dev

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=trigger" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.idekey=PHPSTORM" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && apk del .build-deps

USER appuser

EXPOSE 8080 9003

CMD ["rr", "serve", "-c", ".rr.yaml"]
  ```
  </details>

  <details>
    <summary>**docker-compose.yml**</summary>

 ```yml
services:
  app:
    build:
      context: .
      dockerfile: .docker/php/Dockerfile
      target: prod
    restart: always
    container_name: grpc-br-app
    working_dir: /var/www
    ports:
      - "8080:8080"
      - "51015:51015"
    volumes:
      - .:/var/www:cached
      - ./protoc-gen-php-grpc:/usr/local/bin/protoc-gen-php-grpc
    depends_on:
      - db
      - redis
    networks:
      - example-grpc-beauty-network

  db:
    image: postgres:16-alpine
    container_name: grpc-br-postgres
    restart: always
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - example-grpc-beauty-network

  redis:
    image: redis:alpine
    container_name: grpc-br-redis
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - example-grpc-beauty-network

volumes:
  pg_data:
  redis_data:

networks:
  example-grpc-beauty-network:
    driver: bridge
```
  </details>

  <details>
    <summary>**docker-compose.override.yml**</summary>

```yml
services:
  app:
    build:
      target: dev
    environment:
      PHP_IDE_CONFIG: "serverName=stage"
    restart: unless-stopped
    #ports:
    #    - "9003:9003"

  db:
    restart: unless-stopped
    ports:
      - "5432:5432"

  redis:
    restart: unless-stopped
    ports:
      - "6379:6379"
```
  </details>
</details>


## 🛠 Manual Installation

If you prefer not to use Docker:

### 1. Install dependencies:

```bash
composer install
```

### 2. Get the RoadRunner binary:

```bash
./vendor/bin/rr get-binary
```

### 3. Start the RoadRunner server:

```bash
./rr serve
```


## ✅ Requirements

* PHP **8.1+**
* Extensions:

  * `ext-redis`
  * `ext-protobuf`
* Composer
* RoadRunner

> For the best developer experience, Docker is highly recommended.


Once installed, you’re ready to explore routing, controllers, middleware, jobs, and everything Beauty has to offer.
