---
sidebar_position: 1
---

# Configuration Overview

Beauty Framework provides a clean and structured configuration system based on PHP arrays and `.env` variables. All configuration files are stored in the `config/` directory.

You can access configuration values anywhere using the `config()` helper:

```php
$debug = config('app.debug');
```

### 🔍 How It Works

* Each file in `config/` returns an associative array.
* Configuration keys follow the format: `filename.key` (e.g., `app.name`, `cache.default`)
* Environment variables can be used inside config files with the `env()` helper.

### 🧭 Key Files

* `app.php` — general app settings
* `cache.php` — caching drivers and stores
* `database.php` — DB connections
* `middlewares.php` — global middlewares
* `router.php` — controller discovery
* `event-listeners.php` — event to listener mapping
* `kv-storage.php` — key-value backend
* `commands.php` — console commands

### 🌍 Environment Variables

Define `.env` in your root project directory. Example:

```dotenv
APP_NAME="Beauty Framework"
APP_DEBUG=true
DB_CONNECTION=pgsql
```

Values from `.env` are read via the `env()` function and used in `config/*.php` files.

---

> This system keeps your application clean, centralized, and environment-aware.
