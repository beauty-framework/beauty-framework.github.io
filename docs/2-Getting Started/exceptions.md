---
sidebar_position: 5
---

# Handle Exceptions

In Beauty Framework, exceptions are the primary way to interrupt the request flow and return error responses. This approach keeps your controller and middleware logic clean while maintaining full control over the HTTP response.


## 🔥 Example: Unauthorized Access

```php
throw new UnauthorizedException('Missing or invalid token');
```

If an exception is thrown anywhere in your middleware, controller, or service, it will be caught and transformed into a proper JSON response automatically.

### 🔄 Response Example

```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid token"
}
```

With HTTP status code: `401 Unauthorized`


## 🧱 Custom Exceptions

You can define your own exceptions by extending `\Exception` or any base class you prefer:

```php
namespace App\Exceptions;

class UnauthorizedException extends \Exception
{
}
```

> You can also override the constructor of your custom exception to simplify message handling or pass additional data. This gives you full flexibility over how errors are represented and returned.


## ⚙️ Built-in Exception Support

Beauty Framework provides built-in support for:

* `ValidationException` — auto-thrown from `ValidatedRequest`
* `HttpException` — base exception for manual responses

The exception system is extremely flexible — you can define and handle any exception type the way you want, whether globally in the worker or locally in your code. No strict interface or inheritance is required.


## ⚙️ Custom Exception Flow

If you need full control over how specific exceptions are handled, you can customize the error flow in your `workers/http-worker.php` file. For example:

```php
if ($psrRequest = $worker->waitRequest()) {
    try {
        // ...handle request and convert to HttpRequest
        $response = $app->handle($request);
        $worker->respond($response);
    } catch (ValidationException $e) {
        $worker->respond(new JsonResponse(400, new ValidationResponse($e->getMessage(), $e->getFails())));
    } catch (UnauthorizedException $e) {
        $worker->respond(new JsonResponse(401, new ErrorResponse($e->getMessage())));
    } catch (Throwable $e) {
        $worker->respond(new JsonResponse(500, new ErrorResponse($e->getMessage())));
        $worker->getWorker()->error((string)$e);
    }
}
```

This allows you to define precise responses for each exception type.

## 💡 Notes

* Exceptions short-circuit the pipeline — no further middleware or controller logic will be executed
* You can return different status codes for different exception types
* Logs and error reporting are handled globally

> Use exceptions to clearly express failure conditions — and let the framework handle the rest.
