---
sidebar_position: 3
---

# Configuration

Beauty Framework uses a simple and flexible configuration system powered by PHP config files and environment variables.

---

## 🗂 Config Files

All configuration files are located in the `config/` directory. Each file is a standard PHP file returning an associative array. Examples include:

* `app.php`: application name, environment, version, timezone, locale
* `cache.php`: cache drivers (redis, file, memory, etc.)
* `database.php`: database connections (PostgreSQL, MySQL, SQLite, etc.)
* `event-listeners.php`: mapping events to listeners
* `kv-storage.php`: key-value storage backend
* `middlewares.php`: global middleware stack
* `router.php`: list of controller paths

To access configuration values in your code, use the `config()` helper:

```php
$name = config('app.name'); // returns 'Beauty Framework' by default
```

---

## 🌍 Environment Variables

Beauty Framework uses the `env()` helper to access environment variables, typically defined in the `.env` file.

```php
'host' => env('DB_HOST', '127.0.0.1')
```

This makes it easy to override values per environment without touching the config files.

The `.env` file should be committed as `.env.example` and copied to `.env` locally during setup.

---

## ⚙️ Dependency Bindings

If you need to bind custom implementations or singletons into the container, you can define them in `App\Container\DI::configure`:

```php
$container->singleton(LoggerInterface::class, fn() => new Logger('stdout'));
```

This is a good place to configure services, interfaces, and third-party integrations.

> More about the container and service providers will be covered in a dedicated section.

---

## ⚙️ RoadRunner Configuration

Beauty Framework runs on top of [RoadRunner](https://roadrunner.dev), a powerful application server written in Go.

You can customize RoadRunner behavior by editing the `.rr.yaml` file in your project root. This includes configuration for:

* HTTP server
* Queues
* KV storage
* gRPC services
* Event listeners
* Process pools
* Logging, timeouts, reloads, and more

Example:

```yaml
server:
  command: "php workers/rr-worker.php"
  relay: pipes

http:
  address: 0.0.0.0:8080
  pool:
    max_jobs: 1000
    debug: true

log:
  level: info
```

For full configuration options, refer to the [official RoadRunner documentation](https://roadrunner.dev/docs).
