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
