---
sidebar_position: 10
---


# Console Commands Configuration (`config/commands.php`)

This file registers all custom CLI commands available to your application.

### 📦 Example

```php
return [
    \App\Console\Commands\MyCommand::class,
];
```

These classes must extend `\Beauty\Console\Command` and implement the `handle()` method.

Once registered, commands are available via:

```bash
./beauty help
```

> Core commands from the framework are auto-registered. You only need to register your own.
