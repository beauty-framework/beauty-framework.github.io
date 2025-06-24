# OpenAPI Support

This package brings modern OpenAPI 3 documentation support to the Beauty Framework. Powered by [swagger-php](https://github.com/zircote/swagger-php) under the hood, it lets you document your REST API using PHP 8.1+ attributes and instantly serves up-to-date docs with a beautiful Redoc UI.

> ⚠️ This is an **optional module**. You need to install and configure it manually.

## Installation

```bash
make composer require beauty-framework/openapi-support
# Or without Docker
composer require beauty-framework/openapi-support
```

**Requirements:**

* PHP >=8.1
* beauty-framework/cli ^1.0 (for CLI integration)
* zircote/swagger-php ^5.1 (OpenAPI generator)


## Quick Start

1. **Create your API controller inheriting from `BaseOpenApiController`:**

```php {17}
namespace App\Controllers;

use Beauty\OpenApi\Http\Controllers\BaseOpenApiController;
use OpenApi\Attributes as OAT;

#[OAT\OpenApi(openapi: OAT\OpenApi::VERSION_3_1_0, security: [['bearerAuth' => []]])]
#[OAT\Info(
    version: '1.0.0',
    title: 'Basic single file API',
    attachables: [new OAT\Attachable()]
)]
#[OAT\License(name: 'MIT', identifier: 'MIT')]
#[OAT\Server(url: 'https://localhost/', description: 'API server')]
#[OAT\SecurityScheme(securityScheme: 'bearerAuth', type: 'http', scheme: 'bearer', description: 'Basic Auth')]
#[OAT\Tag(name: 'products', description: 'All about products')]
#[OAT\Tag(name: 'catalog', description: 'Catalog API')]
class ApiController extends BaseOpenApiController
{
    // Instantly exposes /openapi.json and /docs/api!
}
```

2. **Annotate your endpoints and models using [swagger-php attributes](https://zircote.github.io/swagger-php/guide/attributes.html):**

```php {3}
use OpenApi\Attributes as OAT;

#[OAT\Get(path: '/products', tags: ['products'], ...)]
#[Route(method: HttpMethodsEnum::GET, path: '/products')]
public function listProducts() { ... }
```

3. **Register console commands (optional, for static generation):**

Add to `config/commands.php`:

```php {3}
return array_merge(
    // ...
    \Beauty\OpenApi\Console\RegisterCommands::commands(),
    // ...
);
```

4. **Access your docs at:**

* `/openapi.json` for up-to-date OpenAPI spec
* `/docs/api` for Stoplight-powered interactive docs

## Switching Documentation UI
You can control which documentation UI is shown at `/docs/api` by setting the `OPENAPI_MODE` variable in your `.env` file:

```dotenv
OPENAPI_MODE=stoplight # or swagger, redoc, rapid
```

**Supported values:**
- stoplight (default)
- swagger
- redoc
- rapid

The selected viewer will be automatically rendered at `/docs/api` depending on this value.

If you provide an invalid value, Stoplight will be used by default.

## Customization

* Override `documentation()` or `openApiJson()` methods in your controller to change the output.
* Docs page can be replaced or extended as needed.
* You can provide your own action classes (see `SpecsAction` and `RedocAction`) to control exactly how spec and documentation UI are served.

  Example:

  ```php
  #[Route(method: HttpMethodsEnum::GET, path: '/documentation')]
  public function docs(RedocAction $action): ResponseInterface
  {
      return $action();
  }
  ```
* This gives you full control over OpenAPI JSON and Redoc page delivery.

## How it works

* At runtime, `SpecsAction` uses `OpenApiGenerator` to scan your codebase and build the OpenAPI spec (`/openapi.json`).
* `RedocAction` renders a Redoc UI page pointing to `/openapi.json` (other DocActions work like RedocAction).
* For production, you can pre-generate the spec with the CLI command and serve it as a static file for best performance.

## Static Generation

You can generate the OpenAPI spec as a file using the CLI:

```bash
make beauty openapi:generate
# OR without Docker
./beauty openapi:generate
```

Serve `/openapi.json` statically in production for maximum speed.

## Under the Hood

* Built on [zircote/swagger-php](https://github.com/zircote/swagger-php) (OpenAPI 3.1+ compatible).
* 100% compatible with beauty/http responses and PSR-7.

## Limitations & Tips

* **Static vs Dynamic:** If `/public/openapi.json` exists, RoadRunner will serve the file and bypass the controller. Remove the file for dynamic generation.
* **Performance:** Generating the spec dynamically on every request can be slow for big codebases. Use static generation in production.
* **Customization:** Use your own action classes or override the controller methods for full control.

## Resources

* [swagger-php documentation](https://github.com/zircote/swagger-php)
* [OpenAPI Specification](https://swagger.io/specification/)
* [Redoc Documentation](https://redocly.com/docs/redoc/)
