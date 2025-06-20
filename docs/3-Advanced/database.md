---
sidebar_position: 6
---

# Database Access

Beauty Framework provides a minimal yet flexible database layer via the [beauty-framework/database](https://github.com/beauty-framework/database) package.

It supports direct SQL queries, transactions, and multiple connection types — while allowing for easy extensibility.


## 📦 Features

* Lightweight abstraction over native PDO
* Safe query execution with prepared statements
* Transactions with rollback support
* Multiple driver support: PostgreSQL, MySQL, SQLite, SQL Server
* Extendable `ConnectionInterface`


## ⚙️ Basic Usage

```php
use Beauty\Database\Connection\ConnectionInterface;

class MyService
{
    public function __construct(
        private ConnectionInterface $db,
    ) {}

    public function getData(): array
    {
        return $this->db->select('SELECT * FROM users WHERE active = ?', [1]);
    }
}
```


## 🔄 Transactions

Use `transaction()` to ensure safe execution:

```php
$db->transaction(function (ConnectionInterface $tx) {
    $tx->insert('INSERT INTO users (name) VALUES (?)', ['Kirill']);
    $tx->update('UPDATE stats SET count = count + 1');
});
```

If any exception is thrown — the transaction is rolled back.


## 🔧 Drivers and Configuration

Database drivers are configured in `config/database.php`. Here's a sample structure:

```php
<?php

return [
    'default' => env('DB_CONNECTION', 'pgsql'),

    'connections' => [
        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', 5432),
            'database' => env('DB_DATABASE', 'app'),
            'username' => env('DB_USERNAME', 'user'),
            'password' => env('DB_PASSWORD', 'secret'),
            'charset' => 'utf8',
        ],

        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', 3306),
            'database' => env('DB_DATABASE', 'app'),
            'username' => env('DB_USERNAME', 'user'),
            'password' => env('DB_PASSWORD', 'secret'),
            'charset' => 'utf8mb4',
        ],

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', 'dev.sqlite'),
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', 1433),
            'database' => env('DB_DATABASE', 'app'),
            'username' => env('DB_USERNAME', 'user'),
            'password' => env('DB_PASSWORD', 'secret'),
            'encrypt' => env('DB_ENCRYPT', 'no'),
            'trust_cert' => env('DB_TRUST_CERT', 'yes'),
        ],
    ],
];
```

For details about configuration — see: [Configs/Database](../1-Installation/Configs/database.md)


## 🛠️ Create custom driver

For example for Oracle (abstract example):
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

For example - watch `Cockroach DB` driver in this repo - https://github.com/beauty-framework/cockroach-db-support


## 🔗 Repository

Database are implemented in the `beauty-framework/database` package (already connected in the framework):

[https://github.com/beauty-framework/database](https://github.com/beauty-framework/database)


## 📌 Notes

* You can bind your own custom implementations of `ConnectionInterface`.
* Database layer is intentionally simple — a query builder/ORM is planned in future versions.
