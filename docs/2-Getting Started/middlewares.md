---
sidebar_position: 4
---

# Add Middleware

Middleware in Beauty Framework follow the [PSR-15](https://www.php-fig.org/psr/psr-15/) standard, allowing you to intercept, modify, or block requests before they reach your controller.

You can register middleware globally or attach them to specific routes or controllers using PHP attributes.

---

## 🛠 CLI Generator

To scaffold a new middleware:

```bash
make beauty generate:middleware AuthMiddleware
# Or without Docker:
./beauty generate:middleware AuthMiddleware
```

This creates a new file in `app/Middlewares/` with a ready-to-use class.

---

## ✨ Example: AuthMiddleware

```php
namespace App\Middlewares;

use App\Exceptions\UnauthorizedException;
use App\Repositories\Contracts\UserTokenRepositoryInterface;
use Beauty\Http\Middleware\AbstractMiddleware;
use Beauty\Http\Request\HttpRequest;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware extends AbstractMiddleware
{
    public function __construct(
        private UserTokenRepositoryInterface $tokenRepository,
    ) {}

    public function handle(HttpRequest $request, RequestHandlerInterface $next): ResponseInterface
    {
        $bearer = $request->getHeaderLine('Authorization');

        if (!str_starts_with($bearer, 'Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        $clearToken = trim(substr($bearer, 7));
        $token = $this->tokenRepository->findByToken($clearToken);

        if ($token === null) {
            throw new UnauthorizedException('Unauthorized');
        }

        // Attach the authenticated user to the request for downstream use
        $request = $request->withAttribute('user', $token->getUser());

        return $next->handle($request);
    }
}
```

This middleware extracts the bearer token from the `Authorization` header, checks it using a token repository, and injects the authenticated user into the request. If the token is missing or invalid, an exception is thrown, interrupting the flow.

---

This allows type-safe injection of `HttpRequest` instead of raw `ServerRequestInterface`.

---

## 🧭 How to Apply Middleware

### ✅ 1. Globally

Edit `config/middlewares.php`:

```php
return [
    'global' => [
        \App\Middlewares\AuthMiddleware::class,
    ],
];
```

These will apply to every request.

### ✅ 2. Controller-Level

```php
use Beauty\Http\Middleware\Middleware;

#[Middleware(AuthMiddleware::class)]
class UserController { ... }
```

### ✅ 3. Method-Level

```php
#[Middleware(AuthMiddleware::class)]
#[Route(HttpMethodsEnum::GET, '/users')]
public function index(HttpRequest $request): ResponseInterface
{
    $user = $request->getAttribute('user');

    return new JsonResponse([
        'message' => 'Hello, ' . $user->getName()
    ]);
}
```

You can stack multiple middlewares with multiple `#[Middleware(...)]` annotations.

---

## 💡 Notes

* Middleware support full DI — dependencies will be injected automatically
* Middleware can throw exceptions to interrupt the request pipeline (e.g., `UnauthorizedException`)
* Use `withAttribute()` to pass contextual data like `user` into the request
* Middleware are useful for auth, logging, rate-limiting, CORS, etc.

> Middleware give you full control over how requests enter your application and how responses leave it.
