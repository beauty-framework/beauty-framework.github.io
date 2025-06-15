---
sidebar_position: 2
---

# App Configuration (`config/app.php`)

The `app.php` config file contains general application settings such as environment, name, and debug mode. These values are typically controlled through the `.env` file.

### 🔧 Available Options

```php
return [
    'name' => env('APP_NAME', 'Beauty Framework'),
    'env' => env('APP_ENV', 'local'),
    'version' => env('APP_VERSION', '1.0.0'),
    'timezone' => env('APP_TIMEZONE', 'UTC'),
    'locale' => env('APP_LOCALE', 'en'),
    'debug' => env('APP_DEBUG', false),
];
```

### 🧪 Usage Example

```php
if (config('app.debug')) {
    // Enable detailed error logging
}
```

These values are globally accessible using the `config()` helper anywhere in your application.

> You can change these values in `.env` without touching the PHP config directly.
