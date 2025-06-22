# Modules Support

Beauty Framework is modular by design: all extra features, domain logic, and integrations are delivered as isolated modules. This approach keeps your app fast, clean, and focused—only use what you need.

> ⚠️ This is an **optional module**. You need to install and configure it manually.


## Installing module support

Add module support to your app:

```bash
make composer require beauty-framework/module-support
# Or without Docker
composer require beauty-framework/module-support
```

This package enables first-class module generation, autoloading, and seamless integration for modular development.


## Generating a new module

Beauty Framework ships with a CLI command for creating ready-to-use module scaffolding:

```bash
make beauty generate:module <module-name>
# Or without Docker
./beauty generate:module <module-name>
```

**What happens:**

* A new module appears at `modules/<module-name>`
* Standard structure in `src/` with recommended folders:

  * Controllers
  * Services
  * Repositories
  * Middlewares
  * Entities
  * DTO
  * Events
  * Listeners
  * Container/DI.php (dependency bindings)
* Module gets its own `composer.json` with PSR-4 namespace (e.g. `Module\HelloWorld\`)
* The root composer.json is automatically patched with a path repository and required dependency

#### Example

```bash
make beauty generate:module blog
# Or without Docker
./beauty generate:module blog
```

Creates:

```text
modules/blog/
 ├─ src/
 │   ├─ Controllers/
 │   ├─ Services/
 │   ├─ Repositories/
 │   ├─ Middlewares/
 │   ├─ Entities/
 │   ├─ DTO/
 │   ├─ Events/
 │   ├─ Listeners/
 │   └─ Container/DI.php
 └─ composer.json
```

## Registering module commands

To enable module-related CLI commands everywhere, edit your `config/commands.php`:

```php {3}
return [
    ...
    \Beauty\Module\Console\RegisterCommands::commands(),
    ...
];
```

Now `generate:module` and other module tools are always available in your CLI.

And at the last, update composer
```bash
make composer update
# Or without Docker
composer update
```

## Why modules?

* Keep code separated, independent, and reusable
* Add/remove features with zero bloat
* Compose your app from building blocks—no unnecessary overhead

For advanced usage (custom stubs, more folders, code templates) see the **Advanced** section in the docs.
