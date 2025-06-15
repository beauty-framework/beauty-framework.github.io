---
sidebar_position: 3
---

# Jobs System

Beauty Framework supports lightweight and powerful job dispatching, which can be executed immediately or deferred to background workers via RoadRunner.

This section walks you through how to create and dispatch jobs, configure options, and utilize dependency injection.

## 📦 Defining a Job

Jobs are defined by extending `Beauty\Jobs\AbstractJob`:

```php
namespace App\Jobs;

use Beauty\Jobs\AbstractJob;
use Psr\Log\LoggerInterface;

class LogUserJob extends AbstractJob
{
    public function __construct(
        private int $userId,
        private string $email,
    ) {}

    public function handle(): void
    {
        /** @var LoggerInterface $logger */
        $logger = $this->container->get(LoggerInterface::class);

        $logger->info('User registered', [
            'id' => $this->userId,
            'email' => $this->email,
            'timestamp' => time(),
        ]);
    }
}
```

You can generate jobs with:

```bash
make beauty generate:job LogUserJob
# or without Docker
./beauty generate:job LogUserJob
```

## ⚙️ Dispatching a Job

To dispatch a job, inject the `Beauty\Jobs\Dispatcher` and call `dispatch()`:

```php
use App\Jobs\LogUserJob;
use Beauty\Jobs\Dispatcher;

class AuthService
{
    public function __construct(
        protected Dispatcher $dispatcher,
    ) {}

    public function registerUser(): void
    {
        $this->dispatcher->dispatch(new LogUserJob(1, 'user@example.com'));
    }
}
```

## 🧰 Job Options

Jobs can define additional runtime behavior via helper methods:

```php
$job = (new LogUserJob(1, 'user@example.com'))
    ->withDelay(10)               // Delay job for 10 seconds
    ->withPriority(5)             // Set priority
    ->withHeader('source', 'api')// Custom metadata
    ->onQueue('emails')           // Custom queue name
    ->tags('auth', 'register');   // Tags (for observability)
```

These values are set using the `JobOptions` API:

```php
namespace Beauty\Jobs\Options;

final class JobOptions
{
    public function __construct(
        public int|null $delay = null,
        public int|null $priority = null,
        public array $headers = [],
    ) {}

    public function withDelay(int $seconds): self
    {
        $this->delay = $seconds;
        return $this;
    }

    public function withPriority(int $priority): self
    {
        $this->priority = $priority;
        return $this;
    }

    public function withHeaders(array $headers): self
    {
        $this->headers = $headers;
        return $this;
    }
}
```

## 🧱 Dependency Injection

Each job has access to the container. You can retrieve any dependency like so:

```php
$logger = $this->container->get(LoggerInterface::class);
```

## 🛠 Worker Setup

Jobs are handled in a separate worker file:

```
/workers/jobs-worker.php
```

Ensure it’s configured in `.rr.yaml` under the `jobs` section.

See the official RoadRunner docs:
👉 [https://docs.roadrunner.dev/docs/queues-and-jobs/overview-queues](https://docs.roadrunner.dev/docs/queues-and-jobs/overview-queues)

## 🔗 Repository

Jobs are implemented in the `beauty-framework/jobs` package (already connected in the framework):

[https://github.com/beauty-framework/jobs](https://github.com/beauty-framework/jobs)

## ✅ Summary

* Extend `AbstractJob` and implement the `handle()` method
* Inject dependencies via `$this->container`
* Control execution with fluent job options
* Dispatch jobs via the `Dispatcher` service
* Job processing happens inside `/workers/jobs-worker.php`
* Use `make beauty generate:job YourJob` to generate boilerplate
* Powered by RoadRunner Queues (see [RR docs](https://docs.roadrunner.dev/docs/queues-and-jobs/overview-queues))
