---
name: golang-best-practices
description: Apply idiomatic Go best practices when writing, reviewing, refactoring, or designing Go code. Use for Go packages, services, CLIs, APIs, libraries, tests, error handling, interfaces, concurrency, and project structure.
---

# Go Engineering

Write idiomatic, simple, maintainable Go.

## Core rules

- Prefer obvious code over clever abstractions.
- Prefer concrete types until an interface solves a real problem.
- Define small interfaces at the point of consumption.
- Do not introduce Java, TypeScript, DDD, Clean Architecture, repository,
  factory, or DI patterns without a concrete need.
- Handle errors explicitly and add useful context with `%w`.
- Use `context.Context` for cancellation, deadlines, and request-scoped work.
- Do not store contexts in long-lived structs.
- Do not introduce concurrency unless it provides a real benefit.
- Every goroutine must have a clear lifecycle and termination strategy.
- Prefer the standard library when it solves the problem cleanly.
- Respect the Go version in `go.mod`.
- Follow existing project conventions unless they are clearly harmful.
- Keep exported APIs small.
- Prefer early returns over deep nesting.
- Write behavior-focused tests.
- Use `gofmt`, `go vet`, and `go test` when appropriate.

## Before changing code

Inspect the surrounding package first.

Understand:

- package responsibility
- existing types and interfaces
- error conventions
- concurrency assumptions
- tests
- callers

Make the smallest coherent change.

## Final standard

When multiple implementations are correct, choose the one an experienced Go
developer can understand fastest.
