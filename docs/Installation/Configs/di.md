---
sidebar_position: 11
---


# Dependency Injection Configuration (`App\Container\DI`)

Beauty Framework uses a powerful and flexible DI container built on top of `php-di`. You can configure your own bindings in the `App\Container\DI::configure` class.

### 🔧 Example Binding

```php
$container->singleton(LoggerInterface::class, fn() => new Logger('stdout'));
```

This is useful for:

* Binding interfaces to implementations
* Registering shared singletons
* Injecting third-party services (e.g. SDKs)

All controllers and services receive their dependencies automatically via constructor injection.

> This file gives you full control over the application's dependency graph.
