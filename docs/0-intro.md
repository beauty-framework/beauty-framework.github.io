---
sidebar_position: 1
---

# Introduction

**Beauty Framework** is a fast, lightweight, and fully modular PHP framework built for modern microservices and APIs. It embraces clean architecture principles and provides a Laravel-like developer experience without the bloat.

At its core, Beauty runs on [RoadRunner](https://roadrunner.dev) — a high-performance PHP application server powered by Golang. This enables features like persistent workers, zero-downtime reloads, background jobs, gRPC, and queues — out of the box, with no FPM required.

Beauty is fully **PSR-compliant** (PSR-1, PSR-4, PSR-7, PSR-11, PSR-15, PSR-16), making it interoperable with the modern PHP ecosystem while maintaining clear separation of concerns and testable abstractions.

Each part of the framework is delivered as an independent package — allowing you to use only what you need. Whether you're building a simple REST API or a complex distributed system, Beauty gives you powerful tools without unnecessary overhead.


## Highlights

* 🚀 **Runs on RoadRunner** — fast, reliable, and no FPM
* 📦 **Modular by design** — packages for HTTP, Validation, Queue, Cache, CLI, Events, and more
* 📜 **Attribute-based routing** — `#[Route]`, `#[Middleware]`
* ✅ **PSR standards** — clean, interoperable, decoupled
* 🔄 **Job & event system** — supports Fiber workers, RoadRunner jobs, and PSR-14 listeners


## Philosophy

Beauty was designed for developers who want the elegance of Laravel, the speed of Go, beauty of Simfony and the clarity of clean architecture — all in one place.

Minimal boilerplate. Predictable behavior. Maximum performance.

> Build exactly what you need — nothing more, nothing less.
