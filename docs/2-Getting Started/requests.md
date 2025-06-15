---
sidebar_position: 2
---

# Create a ValidatedRequest

To handle incoming input with validation, Beauty Framework provides a `ValidatedRequest` class that you can extend for custom logic.

### ✨ Generate via CLI

```bash
make beauty generate:request CreateUserRequest
# Or without Docker:
./beauty generate:request CreateUserRequest
```

This will generate a new request class in `app/Requests`.

---

### 🧱 Example Request Class

```php
namespace App\Requests;

use Beauty\Http\Request\AbstractValidatedRequest;

class CreateUserRequest extends AbstractValidatedRequest
{

    public function rules(): array
    {
        return [
            'name' => ['required', 'min:3'],
            'email' => ['required', 'email'],
        ];
    }
}
```

Custom error messages and attribute names will be supported in a future version. This will allow for localized messages and more readable validation errors:

```php
protected array $messages = [
    'name.required' => 'Name is required.',
];

protected array $attributes = [
    'name' => 'User name',
];
```

---

### ✅ Usage in Controller

You can type-hint this request class directly:

```php
#[Route(HttpMethodsEnum::POST, '/user')]
public function store(CreateUserRequest $request): ResponseInterface
{
    $data = $request->json();

    // Create user logic here...
    return new JsonResponse(201, ['success' => true, 'data' => $data]);
}
```

---

### 💡 Notes

* If validation fails, a `400 Bad request` response is automatically returned
* You can override `authorize()` if needed (e.g., for auth checks)
* ValidatedRequest extends `HttpRequest`, so all request methods are available

> ValidatedRequest is the recommended way to keep your controllers clean and your input logic centralized.
