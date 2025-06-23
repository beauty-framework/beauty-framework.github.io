# Collection

This package provides powerful and extensible Collection, PaginatedCollection and LazyCollection implementations for the Beauty Framework. It offers a PHP-compliant, chainable, and efficient API for working with structured data.

> ⚠️ This is an **optional module**. You need to install and configure it manually.


## Installation

```bash
make composer require beauty-framework/collection
# or without Docker
composer require beauty-framework/collection
```


## Overview

* `Collection` — eager evaluation, array-like behavior.
* `LazyCollection` — lazy evaluation using generators.
* `PaginatedCollection` - default `Collection` with paginator
* Separate interfaces for operations, accessors, and lazy behavior.
* Built-in support for alternative storages (`Array`, `Ds\Map`).


## Storages

By default collection use `ArrayStorage`, but if you install `ds` extension, collection has use `DsMapStorage`. In framework Dockerfile this extension is already included.
```bash
pecl install ds
```

## Usage

### Creating a Collection

```php
use Beauty\Collection\Collection;

$collection = new Collection([
    ['name' => 'Kirill'],
    ['name' => 'Hui'],
    ['name' => 'Zver'],
]);
```

### Filtering and Mapping

```php
$result = $collection
    ->where('name', 'Kirill')
    ->map(fn($item) => strtoupper($item['name']))
    ->toArray();
```

### Sorting

```php
$sorted = $collection->sortBy('name');
```

### Getting First / Last Items

```php
$first = $collection->first();
$last = $collection->last();
```


## Lazy Collection

```php
use Beauty\Collection\LazyCollection;

$lazy = new LazyCollection(fn() => yield from range(1, 1000000));

$result = $lazy
    ->filter(fn($x) => $x % 2 === 0)
    ->take(10)
    ->flatMap(fn($x) => [$x, $x * 10])
    ->toArray();
```


## Available Methods

### Common Operations

* `map(callable)`
* `filter(callable)`
* `each(callable)`
* `where(string $field, mixed $value)`
* `sortBy(string $field)`
* `chunk(int $size)`
* `reduce(callable, $initial)`
* `flatMap(callable)`
* `paginate(int $perPage)` *(PaginatedCollection only)*

### Accessors

* `first()`
* `last()`
* `toArray()`
* `count()`


## Interfaces

* `CollectionInterface`
* `PaginatedCollectionInterface`
* `SupportsOperations`
* `SupportsAccessors`
* `LazyCollectionInterface`


## API

### Collection
* `map(callable $callback): static`
  Transform each value using the callback.
* `each(callable $callback): static`
  Run a callback over each item (no transform).
* `filter(?callable $callback = null): static`
  Keep only items that pass the callback (or truthy if null).
* `where(string $field, mixed $value): static`
  Filter items where a field/property equals the given value.
* `sortBy(string|callable $callback, string $direction = 'asc'): static`
  Sort by a field or callback.
* `values(): static`
  Re-index the collection numerically.
* `first(): mixed`
  Get the first item in the collection.
* `last(): mixed`
  Get the last item in the collection.
* `get(mixed $key, mixed $default = null): mixed`
  Retrieve a value by key with optional default.
* `put(mixed $key, mixed $value): void`
  Store a value by key.
* `has(mixed $key): bool`
  Determine if a key exists.
* `remove(mixed $key): void`
  Remove a value by key.
* `toArray(): array`
  Convert the collection to a plain array.
* `IteratorAggregate::getIterator()`
  Required to support `foreach` loops.
* `ArrayAccess`
  Enables `$collection[$key]` syntax.
* `Countable::count()`
  Enables `count($collection)`.
* `JsonSerializable::jsonSerialize()`
  Enables `json_encode($collection)`.


### Paginated Collection
like a `Collection`, but with method `paginate(int $perPage, int $page = 1)`

### LazyCollection
* `map(callable $callback): static`
  Lazily transform each value using the callback.
* `filter(?callable $callback = null): static`
  Lazily filter values using the callback (or truthy if null).
* `take(int $limit): static`
  Take the first N elements from the collection.
* `chunk(int $size): static`
  Break the collection into chunks of the given size.
* `reduce(callable $callback, mixed $initial = null): mixed`
  Aggregate values down to a single result.
* `flatMap(callable $callback): static`
  Flatten and transform each item using the callback.
* `first(): mixed`
  Get the first item in the lazy collection.
* `toArray(): array`
  Convert the lazy collection to a plain array.
* `IteratorAggregate::getIterator()`
  Required to support `foreach` loops.


## Resources

- This package repo: https://github.com/beauty-framework/collection
