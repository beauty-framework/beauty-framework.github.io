---
sidebar_position: 0
---

# JSON-RPC Support

This package adds first-class JSON-RPC 2.0 support to the Beauty Framework. It’s perfect for building RPC APIs, microservices, and inter-service communication with a strict protocol and strong typing.

> ⚠️ This is an **optional module**. You need to install and configure it manually.

---

## Installation

Install the package via Composer:

```bash
make composer require beauty-framework/json-rpc
# Or without Docker
composer require beauty-framework/json-rpc
```


## Registering Console Commands

Add the JSON-RPC commands provider to your CLI config:

```php
// config/commands.php
return [
    // ...
    \Beauty\JsonRPC\Console\RegisterCommands::commands(),
];
```


## Quick Start

1. **Install the JSON-RPC config:**

   ```bash
   make beauty jsonrpc:install
   # Or without Docker
   ./beauty jsonrpc:install
   ```

   > This creates `config/json-rpc.php` with handler discovery settings.

   Example `config/json-rpc.php`:

   ```php
   <?php
   declare(strict_types=1);

   return [
       __DIR__ . '/../app/RpcHandlers/**/*.php',
   ];
   ```

   **Register handlers in your worker**

   After initializing your `$app` in `workers/http-worker.php`, add this line to register all discovered handlers:

   ```php {5}
   $app = (new App(container: $application->containerManager->getContainer()))
       ->withRouterConfig($application->routerConfig)
       ->withMiddlewares($application->middlewares);

   \Beauty\JsonRPC\JsonRpcServer::setHandlers(require base_path('config/json-rpc.php')); // <-- this is required!

   while ($psrRequest = $worker->waitRequest()) {
       // ...
   }
   ```

   This is **required** for all your RpcHandlers to be visible to the JsonRpcServer.
   Otherwise, your methods will not be available!

2. **Add the base JSON-RPC endpoint:**

   Create a controller:

   ```php
   <?php
   declare(strict_types=1);

   namespace App\Controllers;

   use Beauty\Core\Router\Route;
   use Beauty\Http\Enums\HttpMethodsEnum;
   use Beauty\Http\Request\HttpRequest;
   use Beauty\JsonRPC\JsonRpcServer;
   use Psr\Http\Message\ResponseInterface;

   class RpcController
   {
       public function __construct(
           protected JsonRpcServer $rpcServer,
       ) {}

       #[Route(HttpMethodsEnum::POST, '/rpc')]
       public function rpc(HttpRequest $request): ResponseInterface
       {
           return $this->rpcServer->handle($request);
       }
   }
   ```

   This will be your unified entrypoint for all JSON-RPC requests (`/rpc`).

3. **Generate your own RPC handler:**

   ```bash
   make beauty generate:handler TestHandler
   # Or without Docker
   ./beauty generate:handler TestHandler
   ```

   > This will create a file at `app/RpcHandlers/TestHandler.php` with a basic handler skeleton.

4. **Define a method with the #\[RpcMethod] attribute:**

   ```php
   <?php
   declare(strict_types=1);

   namespace App\RpcHandlers;

   use Beauty\JsonRPC\Responses\RpcResponse;
   use Beauty\JsonRPC\RpcMethod;
   use Psr\Http\Message\ResponseInterface;

   class TestHandler
   {
       #[RpcMethod('test.test')]
       public function test(string $msg, array $names, string|int|null $id = null): ResponseInterface
       {
           return new RpcResponse([
               'msg' => $msg,
               'names' => $names,
           ], id: $id);
       }
   }
   ```

   * Method arguments are automatically mapped from the JSON-RPC `params`.
   * An `id` argument (if present) will always receive the request ID (for batch/tracing).
   * You can use DI for services, just typehint the argument (e.g., `LoggerInterface`).


## Example request to your server

```json
{
  "jsonrpc": "2.0",
  "method": "test.test",
  "params": {
    "msg": "Hello",
    "names": ["Alice", "Bob"]
  },
  "id": 42
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "msg": "Hello",
    "names": ["Alice", "Bob"]
  },
  "id": 42
}
```


## Useful Links

* JSON-RPC 2.0 Spec: [https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
* Github: [https://github.com/beauty-framework/jsonrpc](https://github.com/beauty-framework/jsonrpc)


## Why JSON-RPC?

* One entrypoint, no route mess
* Perfect for microservices, P2P, gRPC-like APIs
* Easy to implement batching, DI, versioning
* Simple frontend integration (works anywhere)
