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