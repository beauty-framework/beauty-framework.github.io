---
sidebar_position: 1
---

# Define a Route and Controller

To create a new controller, use the CLI command:

```bash
make beauty generate:controller HelloController
# Or without Docker:
./beauty generate:controller HelloController
```

This will generate a controller file in `app/Controllers`.


In Beauty Framework, controllers are simple PHP classes where you define methods annotated with the `#[Route(...)]` attribute. This makes routing expressive and clean.

## 📁 Example Directory

Controllers typically live in `app/Controllers`, which is scanned automatically based on `config/router.php`. You can organize them into subfolders (e.g., `app/Controllers/Admin/`, `app/Controllers/API/`), and specify multiple paths in the config:

```php
// config/router.php
return [
    'controllers' => [
        __DIR__ . '/../app/Controllers/**/*.php',
        __DIR__ . '/../app/Modules/**/*.php',
    ],
];
```

## 🚀 Example Controller

```php
namespace App\Controllers;

use Beauty\Http\Enums\HttpMethodsEnum;
use Beauty\Http\Request\HttpRequest;
use Beauty\Http\Response\JsonResponse;
use Beauty\Routing\Attributes\Route;
use Psr\Http\Message\ResponseInterface;

class HelloController
{
    #[Route(HttpMethodsEnum::GET, '/users')]
    public function index(HttpRequest $request): ResponseInterface
    {
        return new JsonResponse(data: [
            'users' => [
                [
                    'id' => 1,
                    'name' => 2,
                ],
            ]
        ]);
    }
}
```

This registers a `GET /hello` route which returns a JSON response.

## ⛓️ Route path params

To set path parameters, the following mechanism is used: parameters are set in the route and can be obtained as method (action) arguments. Support for optional parameters will be added in the future.

```php
    #[Route(HttpMethodsEnum::GET, '/tasks/{projectId}')]
    public function index(HttpRequest $request, int $projectId): ResponseInterface
```

## ⚙️ Available HTTP Methods

Beauty Framework supports all standard HTTP methods via `HttpMethodsEnum`:

```php
enum HttpMethodsEnum: string
{
    case GET = 'GET';
    case POST = 'POST';
    case PUT = 'PUT';
    case PATCH = 'PATCH';
    case DELETE = 'DELETE';
    case HEAD = 'HEAD';
}
```

These can be used when declaring routes:

```php
#[Route(HttpMethodsEnum::POST, '/submit')]
```

## 🔧 Notes

* Methods can be named (`index`, `store`, etc.)
* You can type-hint custom Request classes or dependencies in method arguments
* Each controller and method can use additional attributes like `#[Middleware(...)]`
* The return type of the controller method must be either `Psr\Http\Message\ResponseInterface` or `Beauty\Http\Response\Contracts\ResponsibleInterface`


Once defined, this route will automatically be registered on app boot — no manual wiring required.

> Continue with ValidatedRequest to handle incoming input and validation.
