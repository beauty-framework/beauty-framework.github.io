---
sidebar_position: 5
---

# Local Process Management

Beauty Framework provides a lightweight concurrency API out of the box via [beauty-framework/parallels](https://github.com/beauty-framework/parallels), allowing you to run multiple operations in parallel using Fibers (and in the future — RoadRunner Jobs).

This is useful for executing several slow operations (e.g., API calls, queries) in a non-blocking and structured way.

## ⚙️ Concurrent::run()

The core method is `Concurrent::run()`:

```php
use Beauty\Parallels\Concurrent;

$results = Concurrent::run([
    'task-1' => fn() => 1 + 1,
    'task-2' => fn() => strtoupper('hello'),
]);

print_r($results);
```

Output:

```php
[
    'task-1' => 2,
    'task-2' => 'HELLO',
]
```

## 🧰 Execution Modes

By default, execution happens using PHP Fibers:

```php
Concurrent::run([
    'a' => fn() => 42,
], 5); // Timeout: 5s, mode: fiber
```

You can also specify the execution mode explicitly:

```php
use Beauty\Parallels\WorkersName;

Concurrent::run([
    'slow' => fn() => sleep(1),
], 10, WorkersName::FIBER);
```

### Available modes:

| Mode      | Description                       |
| --------- | --------------------------------- |
| `fiber`   | Default. Uses PHP Fibers          |
| `process` | WIP. Executes via RoadRunner Jobs |

> ℹ️ The `process` mode is experimental and not recommended for production yet.

## 🔒 Locking via RoadRunner

If you need to manage concurrency using distributed locks, you can use the RoadRunner `LockInterface` and access it via DI:

```php
public function __construct(
    protected LockInterface $lock,
) {}
```

For more information, see [RoadRunner Locks documentation](https://docs.roadrunner.dev/docs/plugins/locks).

## 🧱 Summary

* Run multiple closures in parallel with `Concurrent::run()`
* Default execution uses Fibers for lightweight multitasking
* Custom timeout and mode can be configured
* Distributed locks are supported via RoadRunner's Lock plugin
* Based on the `beauty-framework/parallels` package

## 🔗 Repository

Parallels are implemented in the `beauty-framework/parallels` package (already connected in the framework):

[https://github.com/beauty-framework/parallels](https://github.com/beauty-framework/parallels)
