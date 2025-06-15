# Beauty Framework Roadmap

## ✅ Completed Milestones

* **Framework** (`beauty-framework/app`)

  * General file structure
  * Workers
  * Docker
  * `.rr.yaml` config
  * `Makefile`
  * Configuration

* **Core Framework** (`beauty-framework/core`)

  * PSR-7, PSR-11, PSR-15 compatibility
  * DI container via `php-di/php-di`
  * Attribute-based routing (`#[Route]`)
  * Global + per-route middleware support via `#[Middleware]`
  * `config/*.php` loader with support for nested keys
  * Runtime overrides and caching
  * PSR-14 Dispatcher and Listeners

* **HTTP Package** (`beauty-framework/http`)

  * Extended PSR-7 `HttpRequest`
  * `AbstractValidationRequest` for validation
  * `JsonResponse`, `RedirectResponse`, `StreamedResponse`, `BinaryFileResponse`
  * `AbstractJsonResource` helpers
  * Middleware system with attribute support
  * Response normalization with `ResponsibleInterface`

* **Validation Package** (`beauty-framework/validation`)

  * Fork of `rakit/validation` with nullable type support
  * `ValidatedRequest` implementation
  * Controller-level validation via attributes

* **CLI Package** (`beauty-framework/cli`)

  * Console kernel and command system
  * Command generator (`generate:command`)
  * Output formatting helpers (`line`, `info`, `warn`, etc.)

* **Database Package** (`beauty-framework/database`)

  * Connection manager with support for `pgsql`, `mysql`, `sqlite`, `sqlsrv`
  * Simple QueryBuilder and `ConnectionInterface`
  * Support for custom drivers

* **Jobs System** (`beauty-framework/jobs`)

  * Jobs abstraction for `roadrunner-jobs`
  * Async jobs, compitable with RR

* **Process System** (`beauty-framework/parallels`)

  * Concurrent job runner with `Fiber` strategy

* **gRPC Package** (`beauty-framework/grpc`)

  * Attribute-based service registration (`#[GrpcService]`)
  * Auto-discovery and `grpc-worker.php` support
  * Generator toolchain for `.proto` compilation

* **Cache System** (`beauty-framework/cache`)

  * PSR-16 cache interface
  * Redis-based implementation
  * Cache drivers (`file`, `redis`, `roadrunner-kv`, `array`, `memory (LRU)`)

## 🚧 In Progress

* **ORM** (`beauty-framework/orm`)

  * Query Builder (`beauty-framework/database` abstraction)
  * Data Mapper or ActiveRecord models

* **Security Package** (`beauty-framework/security`)

  * Password hashing (Symfony adapter)
  * Auth system (tokens, guards)

* **Testing Support** (`beauty-framework/testing`)

  * PHPUnit integration
  * Framework-aware test helpers


## 🧪 Planned Modules

| Package                      | Description                                                       |
|------------------------------|-------------------------------------------------------------------|
| `beauty-framework/eventbus`  | Distributed event bus (via Redis Streams or similar)              |
| `beauty-framework/scheduler` | Scheduler with `commands` supports                                |
| `beauty-framework/orm`       | Lightweight query builder and migrations                          |
| `beauty-framework/testing`   | Advanced test utilities, CLI test runner                          |
| `beauty/config`              | Full-featured env/config system (done in `core`, may split later) |

## 📘 Documentation

* All core packages are being documented via Docusaurus
* Hosting at: [https://beauty-framework.github.io/](https://beauty-framework.github.io/)
* Each module includes:

  * Installation guide
  * Usage examples
  * API reference
  * CLI commands if applicable

## 💡 Ideas (Future Research)

* Facades like Laravel (optional package)
* Built-in Swagger/OpenAPI generator
* WebSocket Gateway (RR broadcast integration)
* Microservice skeletons and templates

---

*Last updated: 2025-06-15*
