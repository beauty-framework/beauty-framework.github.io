---
sidebar_position: 0
---

# gRPC Support

The Beauty Framework provides optional support for **gRPC services** via the `beauty-framework/grpc` package, built on top of the official [RoadRunner gRPC plugin](https://docs.roadrunner.dev/docs/plugins/grpc).

> ⚠️ This is an **optional module**. You need to install and configure it manually.

---

## 📦 Installation

Install the package:

```bash
make composer require beauty-framework/grpc
# or without Docker
composer require beauty-framework/grpc
```

Run the setup command:

```bash
make beauty grpc:install
# or without Docker
./beauty grpc:install
```

This will:

* Create the `generated/` directory for compiled classes
* Add `"GRPC\\": "generated/"` namespace to your `composer.json`
* Copy `grpc-worker.php` into the `workers/` directory
* Download the `protoc-gen-php-grpc` binary if needed

You should also update your `Makefile` with the `grpcgen` command:

```makefile
grpcgen:
	docker-compose exec $(APP_CONTAINER) chmod +x /usr/local/bin/protoc-gen-php-grpc
	docker-compose exec -it $(APP_CONTAINER) protoc --plugin=protoc-gen-php-grpc \
	  --php_out=./generated \
	  --php-grpc_out=./generated \
	  $(filter-out $@,$(MAKECMDGOALS))
```

And add `grpcgen` to the `.PHONY` section.

---

## 🔧 Configuration

Update `.rr.yaml`:

```yaml
grpc:
  listen: tcp://0.0.0.0:51015
  pool:
    command: "php workers/grpc-worker.php"
  proto:
    - "proto/helloworld.proto"

reload:
  services:
    grpc:
      dirs: [ "." ]
      recursive: true
      patterns: [ ".proto", ".php" ]
```

Update `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "51015:51015"
```

Update `composer.json` autoload:

```json
"autoload": {
  "psr-4": {
    "App\\": "app/",
    "GRPC\\": "generated/GRPC"
  }
}
```

Create `config/grpc.php`:

```php
return [
    'services' => [
        __DIR__ . '/../app/Controllers/GRPC/**/*.php',
    ],
];
```

---

## 📐 Compiling Protobuf Files

Compile `.proto` files:

```bash
make grpcgen proto/helloworld.proto
# or all:
make grpcgen proto/*.proto
```

Manual alternative:

```bash
docker-compose exec app protoc \
  --plugin=protoc-gen-php-grpc \
  --php_out=./generated \
  --php-grpc_out=./generated \
  proto/helloworld.proto
```

Without Docker:
```bash
protoc \
  --plugin=protoc-gen-php-grpc \
  --php_out=./generated \
  --php-grpc_out=./generated \
  proto/helloworld.proto
```

---

## 🚀 Example Service
```protobuf
syntax = "proto3";

option go_package = "proto/greeter";
option php_namespace = "GRPC\\Greeter";
option php_metadata_namespace = "GRPC\\GPBMetadata";

package helloworld;

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

```php
namespace App\Controllers\GRPC;

use GRPC\Greeter\GreeterInterface;
use GRPC\Greeter\HelloRequest;
use GRPC\Greeter\HelloReply;
use Beauty\GRPC\GrpcService;
use Spiral\RoadRunner\GRPC\ContextInterface;

#[GrpcService(GreeterInterface::class)]
class Greeter implements GreeterInterface
{
    public function SayHello(ContextInterface $ctx, HelloRequest $in): HelloReply
    {
        return new HelloReply([
            'message' => 'Hello ' . $in->getName(),
        ]);
    }
}
```

All service implementations are auto-registered via `#[GrpcService(...)]` attribute.

Worker: `workers/grpc-worker.php`:

```php
$server = new Server(new Invoker(), [ 'debug' => true ]);
$registry = new GrpcServiceRegistry($di, $server);
$registry->registerFromAttributes($grpcConfig['services']);
$server->serve(Worker::create());
```

---

## 🔗 Resources

- RoadRunner gRPC docs: https://docs.roadrunner.dev/docs/plugins/grpc
- Example app: https://github.com/beauty-framework/example-grpc
- This package repo: https://github.com/beauty-framework/grpc

---

## 📝 Notes

* Services are registered via `#[GrpcService(...)]` attribute
* Implementations are auto-discovered from `app/Controllers/GRPC/**/*.php`
* Generated classes live in `generated/`
* You must recompile `.proto` files with `make grpcgen` after changes
