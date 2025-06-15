---
sidebar_position: 4
---

# Cache System

Beauty Framework provides a fast, PSR-16 compliant cache abstraction layer with support for multiple backends and easy configuration via `config/cache.php`.

## 🧱 Basic Usage

Any service can use caching by injecting `Psr\SimpleCache\CacheInterface`:

```php
use Psr\SimpleCache\CacheInterface;

class UserService
{
    public function __construct(
        private CacheInterface $cache,
    ) {}

    public function getData(): string
    {
        $data $this->cache->get('key');

        if (!$data) {
            $this->cache->set('key', 'value', 3600)
        }

        return $data ?? 'value';
    }
}
```

## ⚙️ Supported Drivers

Caching behavior is configured in `config/cache.php`:

```php
return [
    'default' => env('CACHE_DRIVER', 'redis'),

    'stores' => [
        'redis' => [...],
        'roadrunner-kv' => [...],
        'array' => [...],
        'file' => [...],
        'memory' => [...],
    ],
];
```

Available drivers:

* `redis` — via native Redis extension
* `roadrunner-kv` — integration with [RoadRunner KV plugin](https://docs.roadrunner.dev/docs/key-value/overview-kv)
* `array` — in-memory array cache
* `file` — filesystem-based cache
* `memory` — LRU memory cache with configurable size

👉 See full configuration options and how to define custom drivers: [`Configs/Сache`](../1-Installation/Configs/cache.md)

## 🛠 Configuration Loader

The configuration binding for the cache system is registered in:

```
App\Container\Cache
```

This class reads the settings from `config/cache.php` and binds the proper cache implementation.

In addition, the container pre-binds the following for direct access:

* `\Redis::class`
* `\Spiral\RoadRunner\KeyValue\Factory::class`

You can use them in your services if you need lower-level access.

## 💡 Available Cache Methods

The following methods are supported from `CacheInterface`:

* `get(string $key, mixed $default = null): mixed`
* `set(string $key, mixed $value, null|int|DateInterval $ttl = null): bool`
* `delete(string $key): bool`
* `has(string $key): bool`
* `clear(): bool`
* `getMultiple(array $keys, mixed $default = null): iterable`
* `setMultiple(iterable $values, null|int|DateInterval $ttl = null): bool`
* `deleteMultiple(iterable $keys): bool`

## 🔗 Repository

Cache are implemented in the `beauty-framework/cache` package (already connected in the framework):

[https://github.com/beauty-framework/cache](https://github.com/beauty-framework/cache)

## ✅ Summary

* Use PSR-16 `CacheInterface` for caching
* Easily switch between drivers in `config/cache.php`
* Redis is recommended for production
* RoadRunner KV plugin is supported
* Full support for TTLs, tags (if implemented), and multiple store backends

> For advanced usage and driver extension, check the configuration doc: [`Configs/Сache`](../1-Installation/Configs/cache.md)
