---
sidebar_position: 6
---

# Middleware Configuration (`config/middlewares.php`)

This file defines **global middleware** that will be executed for every request, before reaching your route/controller.

### 🛡 Example

```php
return [
    'global' => [
        // \App\Middlewares\CorsMiddleware::class,
        // \App\Middlewares\RateLimiterMiddleware::class,
    ],
];
```

These are different from per-route middleware declared via attributes like:

```php
#[Middleware(AuthMiddleware::class)]
class HomeController
{
    // ...

    #[Route(HttpMethodsEnum::POST, '/home')]
    #[Middleware(AdminMiddleware::class)]
    public function home(HelloRequest $request): ResponseInterface
    {
        // ...
    }
}
```

### 🔍 Use Cases

* CORS headers
* Rate limiting
* Global error handling
* Logging

> Middleware are PSR-15 compatible and resolved via the container.
