---
sidebar_position: 9
---

# CLI & Console Kernel

Beauty Framework includes a powerful and flexible CLI system for building and running custom console commands.

All commands extend the `AbstractCommand` class, and must implement:

* `name()` — command name (e.g. `beauty migrate`)
* `description()` — short description shown in help
* `handle(array $args)` — main execution logic

## ✨ Create a Command

You can generate a new command using the generator:

```bash
make beauty generate:command MyCommand
// or without Docker
./beauty generate:command MyCommand
```

This will create a scaffold in `app/Console/Commands/MyCommand.php`.

Example usage inside the command:

```php
use Beauty\Cli\Console\AbstractCommand;

class MyCommand extends AbstractCommand
{
    public function name(): string
    {
        return 'my:command';
    }

    public function description(): ?string
    {
        return 'Demo command';
    }

    public function handle(array $args): int
    {
        $this->info('Running command...');
        return 0;
    }
}
```

> ℹ️ Services are automatically injected via constructor using DI.

## 🧱 Command Registration

Register your commands in `config/commands.php`:

```php
return array_merge(
    \Beauty\Core\Console\RegisterCommands::commands(),
    class_exists(\Beauty\Jobs\Console\RegisterCommands::class) ? \Beauty\Jobs\Console\RegisterCommands::commands() : [],
    [
        \App\Console\Commands\MyCommand::class, // <-- Add here!
    ]
);
```

---

## 🎨 CLI Output Formatting

You can format CLI output using helper methods provided by the framework:

| Method                   | Description           | Output Style      | Available via `$this->...` |
| ------------------------ | --------------------- | ----------------- | -------------------------- |
| `line($msg)`             | Plain line            | Default           | ✅                          |
| `info($msg)`             | Informational message | Blue              | ✅                          |
| `success($msg)`          | Success message       | Green             | ✅                          |
| `warn($msg)`             | Warning message       | Yellow            | ✅                          |
| `error($msg)`            | Error message         | Red               | ✅                          |
| `debug($msg)`            | Debug output          | Purple (if debug) | ❌                          |
| `emergency($msg)`        | Critical/emergency    | Bold Red          | ❌                          |
| `table($headers, $rows)` | Tabular output        | Aligned Table     | ❌                          |

```php
CliOutput::line('');
// Or
$this->line('');
```

These methods use ANSI codes and take care of width alignment and color formatting automatically.

## 🔗 Repository

CLI are implemented in the `beauty-framework/cli` package (already connected in the framework):

[https://github.com/beauty-framework/cli](https://github.com/beauty-framework/cli)
