---
sidebar_position: 7
---

# Business Logic in Services

Beauty Framework encourages keeping your **controllers thin** and **services focused**. Services are responsible for encapsulating business logic and can depend on repositories, helpers, loggers, and other components.


## 🧱 Example: AuthService

Let's create an `AuthService` that handles user registration and login:

```php
namespace App\Services\Auth;

use App\DTO\Auth\LoginDTO;
use App\DTO\Auth\RegisterDTO;
use App\Entities\UserToken;
use App\Exceptions\ServerErrorException;
use App\Jobs\LogUserJob;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\UserTokenRepositoryInterface;
use Beauty\Database\Connection\ConnectionInterface;
use Beauty\Database\Connection\Exceptions\QueryException;
use Beauty\Http\Request\Exceptions\ValidationException;
use Beauty\Jobs\Dispatcher;
use Psr\Log\LoggerInterface;
use Random\RandomException;
use Symfony\Component\PasswordHasher\Hasher\NativePasswordHasher;

class AuthService
{
    public function __construct(
        protected NativePasswordHasher $hasher,
        protected ConnectionInterface $connection,
        protected UserRepositoryInterface $userRepository,
        protected UserTokenRepositoryInterface $tokenRepository,
        protected LoggerInterface $logger,
        protected Dispatcher $dispatcher,
    ) {}

    public function login(LoginDTO $dto): UserToken
    {
        try {
            $user = $this->userRepository->findByEmail($dto->email);

            if (!$user || !$this->hasher->verify($user->getPassword(), $dto->password)) {
                throw new ValidationException('Invalid credentials');
            }

            return $this->tokenRepository->create($user->getId(), $this->generateToken());
        } catch (QueryException $e) {
            $this->logger->error($e->getMessage());
            throw new ServerErrorException('Server error');
        }
    }

    public function register(RegisterDTO $dto): UserToken
    {
        try {
            return $this->connection->transaction(function () use ($dto) {
                $dto->password = $this->hasher->hash($dto->password);

                $user = $this->userRepository->create($dto);
                $token = $this->generateToken();

                $userToken = $this->tokenRepository->create($user->getId(), $token);
                $this->dispatcher->dispatch(new LogUserJob($user->getId(), $user->getEmail()));

                return $userToken;
            });
        } catch (QueryException $e) {
            $this->logger->error($e->getMessage());
            throw new ServerErrorException('Server error');
        }
    }

    protected function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}
```


## 🧾 Using a Service in Controller

Services are automatically injected into your controller methods via DI, **or via constructor**:

### 🔹 Method Injection

```php
use App\Services\Auth\AuthService;
use App\DTO\Auth\RegisterDTO;
use Beauty\Http\Request\ValidatedRequest;
use Beauty\Http\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;

#[Route(HttpMethodsEnum::POST, '/auth/register')]
public function register(ValidatedRequest $request, AuthService $service): ResponseInterface
{
    $dto = $request->toDto(RegisterDTO::class);
    $token = $service->register($dto);

    return new JsonResponse(201, [
        'token' => $token->getToken(),
        'user_id' => $token->getUser()->getId(),
    ]);
}
```

### 🔹 Constructor Injection

```php
use App\Services\Auth\AuthService;

class AuthController
{
    public function __construct(private AuthService $authService) {}

    #[Route(HttpMethodsEnum::POST, '/auth/register')]
    public function register(ValidatedRequest $request): ResponseInterface
    {
        $dto = $request->toDto(RegisterDTO::class);
        $token = $this->authService->register($dto);

        return new JsonResponse(201, [
            'token' => $token->getToken(),
            'user_id' => $token->getUser()->getId(),
        ]);
    }
}
```


## 🧩 Notes

* Services allow grouping logic and dependencies in a reusable way
* You can use services in controllers, jobs, listeners, etc.
* They are auto-injected from the container
* Transactions are fully supported via `ConnectionInterface`
* Exception handling should be done inside the service when necessary

> Keep controllers small — let services do the heavy lifting.
