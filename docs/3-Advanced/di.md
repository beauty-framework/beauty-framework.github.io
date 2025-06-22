---
sidebar_position: 1
---

# Dependency Injection (DI)

Beauty Framework uses a clean, explicit, and fully modular Dependency Injection system based around static DI classes. All service bindings are configured through a single entrypoint — the `DI::configure` method in your app or module. No global calls, no magic autowiring — just straightforward dependency wiring you always control.


## Key Concepts

* **DI class**: Every app/module can (and should) define its own `DI` class (usually at `App\Container\DI` or `Module\YourModule\Container\DI`).
* **configure method**: All bindings go inside the static `configure(ContainerManager $container)` method. No other place, ever.
* **Bindings**: You bind interfaces, classes, or names to concrete implementations or closures.
* **Resolution**: All controller/service dependencies are injected by the framework automatically based on your bindings — you never fetch dependencies from the container manually.


## How to Register Bindings (THE ONLY WAY!)

1. **Create a DI class if it doesn't exist:**

```php
namespace App\Container;

use Beauty\Core\Container\ContainerManager;
use Psr\Log\LoggerInterface;
use Spiral\RoadRunner\Logger;

class DI
{
    public static function configure(ContainerManager $container): void
    {
        // Register logger as singleton via factory closure
        $container->singleton(LoggerInterface::class, fn() => new Logger('stdout'));
    }
}
```

* Use `$container->bind(interface, implementation)` for regular bindings.
* Use `$container->singleton(interface, closure)` for singletons — the closure will be called once.
* Use `$container->instance(interface, $instance)` for ready objects.
* **ALWAYS** put your bindings in `DI::configure`.


## How Dependencies Are Injected

You never resolve services manually. Just type-hint what you need in your constructors, and Beauty will inject it for you according to your bindings.

```php
class ReportService {
    public function __construct(LoggerInterface $logger, CacheManager $cache) {
        // ...
    }
}
```

Any controller, service, or class created by the framework gets all its dependencies injected automatically.


## Module Example

Each module ships with its own `DI` class for clean isolation:

```php
namespace Module\Blog\Container;

use Beauty\Core\Container\ContainerManager;
use Module\Blog\Repositories\PostRepositoryInterface;
use Module\Blog\Repositories\PostRepository;

class DI
{
    public static function configure(ContainerManager $container): void
    {
        $container->singleton(PostRepositoryInterface::class, fn() => new PostRepository());
    }
}
```

## Best Practices

* Bind interfaces, never concrete classes — always inject abstractions.
* Use closures for anything that needs parameters/config/logic.
* Keep all bindings together in `DI::configure` — this is the contract for your app/module.
* Never pull dependencies directly from the container (no service location!).


For advanced usage (factories, contextual bindings, conditional wiring), see the repo or contact the core team.
