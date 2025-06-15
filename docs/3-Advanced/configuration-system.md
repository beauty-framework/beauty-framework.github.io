---
sidebar_position: 8
---

# Configuration System

Beauty Framework uses a clean and consistent configuration system based on plain PHP arrays. All configuration files live in the `config/` directory and are automatically loaded at runtime.

You can access configuration values via the global `config()` helper:

```php
config('cache.default'); // 'redis'
config('database.connections.pgsql.host'); // '127.0.0.1'
```

You can also inject the `ConfigRepository` class if needed.

```php
use Beauty\Core\Config\ConfigRepository;

public function __construct(
    private ConfigRepository $config
) {
    $defaultCache = $this->config->get('cache.default');
}
```

---

## 🗂 Directory Structure

All configuration files live in the `config/` directory. For example:

```
config/
├── app.php
├── cache.php
├── database.php
├── events.php
├── jobs.php
├── logging.php
├── queue.php
└── services.php
```

---

## 🧩 Nested Keys

You can use dot notation to access deeply nested values:

```php
config('database.connections.pgsql.port'); // 5432
```

---

## 🚀 Caching

Internally, the configuration system caches parsed configs for fast access. You don’t need to manually warm up anything.

---

## 🧱 Extensibility

You can easily add your own configuration files in `config/`.

Example: `config/image.php`

```php
<?php

return [
    'resize' => true,
    'max_width' => 1920,
];
```

Access:

```php
config('image.max_width'); // 1920
```

---

## 📁 Configuration Loader

The internal loader is responsible for recursively loading all files in `config/`. It also supports environment overrides and ensures immutability after boot (unless explicitly allowed).

---

## 🛠 Where It's Defined

The main configuration loader is registered in:

```
App\Container\Config\RegisterConfig
```

---

## 📚 Related Docs

* [Installation / Configuration](../1-Installation/configure.md)
* [Installation / Configs / database](../1-Installation/Configs/database.md)
* [Installation / Configs / cache](../1-Installation/Configs/cache.md)

Use those docs if you want to create your own config or provide providers for new services.

---

Beauty makes config access and customization seamless and developer-friendly — no more `.env` hunting or YAML chaos.
