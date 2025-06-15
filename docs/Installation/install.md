---
sidebar_position: 1
---

# Installation

Beauty Framework can be installed either via Docker (recommended) or manually using Composer and RoadRunner.

---

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

---

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

---

## ✅ Requirements

* PHP **8.1+**
* Extensions:

  * `ext-redis`
  * `ext-protobuf`
* Composer
* RoadRunner

> For the best developer experience, Docker is highly recommended.

---

Once installed, you’re ready to explore routing, controllers, middleware, jobs, and everything Beauty has to offer.
