---
sidebar_position: 4
---

# Database Configuration (`config/database.php`)

The `database.php` file defines available database connections and the default one your application should use.

### 🔧 Default Connection

```php
'default' => env('DB_CONNECTION', 'pgsql'),
```

This value can be switched using the `DB_CONNECTION` environment variable.

### 🛠 Supported Drivers

* `pgsql` (PostgreSQL)
* `mysql`
* `sqlite`
* `sqlsrv`

Each driver can be configured using its own env-based options:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', 5432),
    'database' => env('DB_DATABASE', 'app'),
    'username' => env('DB_USERNAME', 'user'),
    'password' => env('DB_PASSWORD', 'secret'),
    'charset' => 'utf8',
],
```

### 🧪 Usage Example

```php
use Beauty\Database\Connection\ConnectionInterface;

$db = container()->get(ConnectionInterface::class);

$results = $db->select("SELECT * FROM users WHERE active = ?", [true]);
```

### 🔧 Create custom driver

For example for Oracle:
1. Implement `Beauty\Database\Connection\Drivers\DriverInterface`

```php
class OracleDriver implements DriverInterface
{
    public function supports(string $driver): bool {
        return $driver === 'oracle';
    }

    public function make(array $config): ConnectionInterface {
        $dsn = "oci:host=$config['host'];port=$config['port'];dbname=$config['db']";

        $pdo = new PDO($dsn, $config['user'], $config['pass']);

        return new PdoConnection($pdo);
    }
}
```
2. Add connection to `config/database.php` in `connections` section:
```php
return [
    'default' => 'pgsql',
    'connections' => [
        'oracle' => [
            'driver' => 'oracle',
            'host' => '127.0.0.1',
            'port' => 12343,
            'db' => 'app',
            'username' => 'user',
            'password' => 'secret',
        ],
    ],
];
```
3. Register it into `ConnectionFactory`:

```php
$factory = new ConnectionFactory([
    // ...
    new OracleDriver(),
]);
```