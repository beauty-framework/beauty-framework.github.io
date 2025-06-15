---
sidebar_position: 3
---

# Create a Custom Response (Resource)

In Beauty Framework, you can create structured and reusable response classes by extending `AbstractJsonResource`. These are helpful when returning data from your API — such as users, profiles, or any other resource.

A resource implements `ResponsibleInterface` and can be returned directly from a controller. Internally, it will be converted into a proper `JsonResponse`.

---

### ✨ Example: UserResponse

```php
namespace App\Responses\User;

use Beauty\Http\Response\AbstractJsonResource;

class UserResponse extends AbstractJsonResource
{
    protected array $fields = ['id', 'name', 'email'];

    public function __construct(
        public int $id,
        public string $name,
        public string $email,
    ) {}

    // Optional, AbstractJsonResource will auto generate serialized data
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}
```

This class is used to format the output structure of a single user.

---

### ✅ Usage in Controller

```php
use Beauty\Http\Response\Contracts\ResponsibleInterface;

#[Route(HttpMethodsEnum::GET, '/users')]
public function index(HttpRequest $request): ResponseInterface
{
    // Example array of User entities
    return new JsonResponse(200, [
        'users' => array_map(fn (User $user) => new UserResponse(
            $user->getId(),
            $user->getName(),
            $user->getEmail(),
        ), $users),
    ]);
}

#[Route(HttpMethodsEnum::POST, '/user')]
public function store(CreateUserRequest $request): ResponsibleInterface
{
    $data = $request->json();

    // Example array of User entities
    return new UserResponse(
        $data->getId(),
        $data->getName(),
        $user->getEmail(),
    );
}
```

### 🔧 Custom Headers and Status Codes

You can configure headers or status code fluently:

```php
return (new UserResponse(...))
    ->setStatusCode(201)
    ->setHeader('X-Custom-Header', 'Value');
```

---

### 💡 Notes

* This approach makes it easy to reuse response formats across multiple controllers
* `jsonSerialize()` gives you full control over output structure
* You can also return `AbstractJsonResource` directly if your controller allows `ResponsibleInterface` return types

> Resource responses help separate transformation logic from business logic — keeping your controllers clean and predictable.
