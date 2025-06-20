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

👉 See full configuration options: [`Configs/Сache`](../1-Installation/Configs/cache.md)


## 🔧 Custom Cache Driver
Memcached for example

```php
use Memcached;
use Psr\SimpleCache\CacheInterface;

class Memcache implements CacheInterface
{
    public function __construct(private Memcached $memcached) {}

    public function get(string $key, mixed $default = null): mixed {
        $value = $this->memcached->get($key);
        return $value === false ? $default : $value;
    }

    public function set(string $key, mixed $value, $ttl = null): bool {
        return $this->memcached->set($key, $value, $ttl ?? 0);
    }

    public function delete(string $key): bool {
        return $this->memcached->delete($key);
    }

    public function clear(): bool {
        return $this->memcached->flush();
    }

    public function getMultiple(iterable $keys, mixed $default = null): iterable {
        $results = [];
        foreach ($keys as $key) {
            $results[$key] = $this->get($key, $default);
        }
        return $results;
    }
    public function setMultiple(iterable $values, $ttl = null): bool {
        foreach ($values as $key => $value) {
            if (!$this->set($key, $value, $ttl)) return false;
        }
        return true;
    }

    public function deleteMultiple(iterable $keys): bool {
        foreach ($keys as $key) {
            if (!$this->delete($key)) return false;
        }
        return true;
    }

    public function has(string $key): bool {
        return $this->memcached->get($key) !== false;
    }
}
```

```php
use Beauty\Cache\Driver\CacheDriverInterface;
use Psr\SimpleCache\CacheInterface;
use Memcached;

class MemcachedCacheDriver implements CacheDriverInterface
{
    public function supports(string $driver): bool
    {
        return $driver === 'memcached';
    }

    public function make(array $config): CacheInterface
    {
        $memcached = new Memcached();
        $memcached->addServer($config['host'] ?? '127.0.0.1', $config['port'] ?? 11211);

        return new Memcache($memcached);
    }
}
```

And registry in `config/cache.php` in `stores` section:
```php
return [
    'default' => env('CACHE_DRIVER', 'redis'),
    'stores' => [
        'memcached' => [
            'driver' => 'memcached',
            'host' => env('MEMCACHED_HOST', '127.0.0.1'),
            'port' => env('MEMCACHED_PORT', 11211),
        ],
    ];
```

Add `App\Container\Cache` in factory:
```php
        $factory = new CacheFactory([
            new RedisCacheDriver(),
            new KVCacheDriver(),
            new ArrayCacheDriver(),
            new FileCacheDriver(),
            new LruCacheDriver(),
            new MemcachedCacheDriver(), // <- this
        ]);
```

For example - watch `Tarantool` driver in this repo - https://github.com/beauty-framework/tarantool-support


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
