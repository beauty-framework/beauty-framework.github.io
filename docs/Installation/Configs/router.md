---
sidebar_position: 7
---


# Router Configuration (`config/router.php`)

This config file defines the directories where your controllers are located. The framework will automatically scan these paths and register routes based on PHP attributes.

### 📁 Example

```php
return [
    'controllers' => [
        __DIR__ . '/../app/Controllers/**/*.php',
    ],
];
```

You can define multiple paths if needed:

```php
'controllers' => [
    __DIR__ . '/../app/Controllers/API/*.php',
    __DIR__ . '/../modules/Admin/**/*.php',
],
```

### ⚙️ How It Works

During boot, the router scans all matching files and registers classes/methods marked with `#[Route(...)]` or `#[Middleware(...)]`.

> No need to register routes manually — just organize controllers and annotate them.
