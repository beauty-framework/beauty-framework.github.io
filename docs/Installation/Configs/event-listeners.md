---
sidebar_position: 8
---

# Event Listeners Configuration (`config/event-listeners.php`)

This file maps events to their respective listeners. The format follows PSR-14 compatible structure.

### 🔔 Example

```php
return [
    \App\Events\UserRegistered::class => [
        \App\Listeners\SendWelcomeEmail::class,
    ],
];
```

### 🧠 Features

* Multiple listeners per event
* Resolved via DI container
* Async-compatible for job-based listeners

Listeners are automatically registered during boot, so no manual wiring is needed.

> You can use CLI generators like `generate:event` and `generate:listener` to scaffold your event system.

