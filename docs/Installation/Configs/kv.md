---
sidebar_position: 5
---

# KV Storage Configuration (`config/kv-storage.php`)

This file defines the default key-value store driver used by components that rely on centralized, non-cache storage.

### 🔧 Example

```php
return [
    'default' => env('KV_STORAGE_DRIVER', 'redis'),
];
```

Key-value storage is useful for scenarios like:

* Rate limiting
* Shared state across workers

For supported drivers you can see a [roadrunner](https://docs.roadrunner.dev/docs/key-value/overview-kv) documentation.

> This is separate from `cache.php` to provide a distinct layer for structured KV operations.
