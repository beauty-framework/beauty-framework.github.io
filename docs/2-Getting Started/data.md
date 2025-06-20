---
sidebar_position: 6
---

# Work with Database (Repositories)

Beauty Framework provides a clean and lightweight way to interact with databases through low-level SQL and **Repository classes**. There is **no ORM yet** — instead, we use a powerful interface: `Beauty\Database\Connection\ConnectionInterface`.

> ⚠️ The ORM is currently under development — this approach gives you full control in the meantime.


## 🧱 Example: UserRepository

You can create repository interfaces and their implementations in `App\Repositories\Contracts` and `App\Repositories`, respectively.

### 🔌 Interface

```php
namespace App\Repositories\Contracts;

use App\DTO\Auth\RegisterDTO;
use App\Entities\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): User|null;
    public function create(RegisterDTO $dto): User;
}
```

### 🧰 Implementation

```php
namespace App\Repositories;

use App\DTO\Auth\RegisterDTO;
use App\Entities\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Beauty\Database\Connection\ConnectionInterface;
use PDO;

class UserRepository implements UserRepositoryInterface
{
    public function __construct(
        private ConnectionInterface $connection,
    ) {}

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->connection->query(
            'SELECT id, name, email, password, created_at FROM users WHERE email = ? LIMIT 1',
            [$email]
        );

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrateUser($data) : null;
    }

    public function create(RegisterDTO $dto): User
    {
        $stmt = $this->connection->query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id, name, email, password, created_at',
            [$dto->name, $dto->email, $dto->password]
        );

        return $this->hydrateUser($stmt->fetch(PDO::FETCH_ASSOC));
    }

    private function hydrateUser(array $data): User
    {
        return new User(
            id: (int)$data['id'],
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            createdAt: new \DateTimeImmutable($data['created_at']),
        );
    }
}
```


## 🧩 Entity Example

Entities are simple readonly value objects:

```php
namespace App\Entities;

final readonly class User
{
    public function __construct(
        private int $id,
        private string $name,
        private string $email,
        private string $password,
        private \DateTimeImmutable $createdAt,
    ) {}

    public function getId(): int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getEmail(): string { return $this->email; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getPassword(): string { return $this->password; }
}
```


## 🧾 Dependency Binding

To inject repository interfaces, register them in your `App\Container\DI` class in method `configure`:

```php
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;

$container->bind(UserRepositoryInterface::class, UserRepository::class);
```

All services and controllers will receive the implementation automatically via DI.


## ⚙️ Raw SQL Power

Beauty provides direct database access using `ConnectionInterface`:

```php
public function update(string $sql, array $bindings = []): int;
public function select(string $sql, array $bindings = []): array;
public function transaction(callable $callback): mixed;
```

You have full control over performance, queries, and batching.


## 💡 Notes

* Repositories encapsulate your data access logic
* You can return rich entity objects or DTOs
* All queries are safe and parameterized
* ORM is in development — stay tuned

> Use repositories to decouple persistence from business logic and keep your services clean.
