---
sidebar_position: 3
---

# Cache Configuration (`config/cache.php`)

The `cache.php` config file defines which caching drivers your application can use. Beauty Framework supports a variety of drivers including Redis, file-based, in-memory, and RoadRunner KV.

### 🔧 Default Driver

```php
'default' => env('CACHE_DRIVER', 'redis'),
```

You can switch drivers via the `CACHE_DRIVER` env variable.

### 📦 Supported Drivers

* `redis`: requires `ext-redis`
* `file`: stores cache on disk
* `array`: non-persistent runtime cache (useful for testing)
* `memory`: memory-efficient LRU cache with adjustable size
* `roadrunner-kv`: uses RR's KV plugin

### 🚀 Redis Example

```php
'redis' => [
    'driver' => 'redis',
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'port' => env('REDIS_PORT', 6379),
    'database' => env('REDIS_CACHE_DB', 1),
    'prefix' => env('REDIS_CACHE_PREFIX', 'beauty:cache:'),
]
```

### 🧪 Usage Example

```php
use Psr\SimpleCache\CacheInterface;

$cache = container()->get(CacheInterface::class);

$cache->set('key', 'value', 3600);
$value = $cache->get('key');
```

> You can configure multiple stores and use them dynamically within your application.

### 🔧 Custom Cache Driver
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