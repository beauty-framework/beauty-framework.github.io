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

The next step is to write the routing in the config `config/router.php`:
```php {3} title="config/router.php"
return [
    'controllers' => [
        __DIR__ . '/../modules/*/src/Controllers/**/*Controller.php',
    ],
];
```

And at the last step, in `bootstrap/kernel.php` add
```php {2} title="bootstrap/kernel.php"
$bootstrap = new class {
    use \Beauty\Module\Core\HasModuleSupportTrait;

    /**
     * @return object
     * @property array $middlewares
     * @property ContainerManager $containerManager
     * @property array $routerConfig
     */
    public function boot(): object
    {
    // ...
    }

    // ...
}
```

And in the same file, in the `initContainerManager` method, add the following to line `83`:
```php {3} title="bootstrap/kernel.php"
        return ContainerManager::bootFrom(array_merge(
            $containers,
            $this->findModuleContainerClasses(),
            [Config::class, Base::class, DI::class]
        ));
```

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

```php {3} title="config/commands.php"
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

If the project is new, you can install a template with preconfigured modularity using the command ([Install documentaion](../../1-Installation/install.md)):
```bash
composer create-project beauty-framework/module-app my-service
```