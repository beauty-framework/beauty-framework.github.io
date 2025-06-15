---
sidebar_position: 1
---

# Events & Listeners

Beauty Framework provides a simple, decoupled event system inspired by PSR-14.
It allows you to dispatch events and register listeners that will react to them.
This is useful for handling side effects such as logging, email notifications, statistics, etc.

## ✨ Defining an Event

An event is just a simple class with public properties:

```php
namespace App\Events;

class SaveTaskInLogEvent
{
    public function __construct(
        public int $todoId,
        public int $userId,
        public string $message,
    ) {}
}
```

You can generate an event using the CLI:

```bash
make beauty generate:event SaveTaskInLogEvent
# or without Docker
./beauty generate:event SaveTaskInLogEvent
```

## 🧠 Creating a Listener

A listener is a class with a `handle()` method that receives the event as an argument.
Dependencies are injected automatically:

```php
namespace App\Listeners;

use App\Events\SaveTaskInLogEvent;
use App\Services\Todo\TaskLogsService;
use Psr\Log\LoggerInterface;
use Beauty\Database\Connection\Exceptions\QueryException;
use DateMalformedStringException;

class TaskLogInDBListener
{
    public function __construct(
        private TaskLogsService $taskLogsService,
        private LoggerInterface $logger,
    ) {}

    public function handle(SaveTaskInLogEvent $event): void
    {
        try {
            $taskLog = $this->taskLogsService->save(
                $event->todoId,
                $event->userId,
                $event->message
            );

            $this->logger->info('Task log created', [
                'id' => $taskLog->getId(),
                'todo_id' => $taskLog->getTodoId(),
            ]);
        } catch (QueryException|DateMalformedStringException $exception) {
            $this->logger->error('Create task log error: ' . $exception->getMessage());
        }
    }
}
```

You can generate a listener using the CLI:

```bash
make beauty generate:listener TaskLogInDBListener
# or without Docker
./beauty generate:listener TaskLogInDBListener
```

## 🚀 Dispatching Events

To dispatch an event, inject `EventDispatcherInterface` and call `dispatch()`:

```php
use App\Events\SaveTaskInLogEvent;
use Psr\EventDispatcher\EventDispatcherInterface;

class SomeService
{
    public function __construct(
        protected EventDispatcherInterface $eventDispatcher,
    ) {}

    public function runLogic(): void
    {
        $this->eventDispatcher->dispatch(
            new SaveTaskInLogEvent(1, 42, 'Task created')
        );
    }
}
```

## ⚙️ Registering Listeners

Listeners are registered in your project in `config/event-listeners.php`:

```php
<?php
declare(strict_types=1);

/**
 * @var array<class-string, class-string[]>
 */
return [
    \App\Events\SaveTaskInLogEvent::class => [
        \App\Listeners\TaskLogInDBListener::class,
    ],
];
```

Beauty will automatically load this configuration during bootstrap.

## ✅ Summary

* Events are simple data classes
* Listeners handle logic, dependencies are injected
* Register your listeners in `config/event-listeners.php`
* Easily dispatch events to trigger logic decoupled from the main flow
* Generate boilerplate with:

  * `make beauty generate:event YourEvent`
  * `make beauty generate:listener YourListener`
