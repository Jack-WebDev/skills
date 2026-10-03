---
name: vitest-best-practices
description: Use when writing, modifying, reviewing, or debugging Vitest tests, test configuration, mocks, spies, fixtures, setup files, coverage, test projects, async tests, or testing TypeScript and React code with Vitest.
---

# Vitest

Use this skill whenever working with `vitest`.

## Core Principles

Write tests that are:

- Easy to understand
- Independent
- Deterministic
- Focused on behavior
- Fast enough to run frequently
- Resistant to implementation-detail refactors

Prefer simple tests over clever test infrastructure.

Test observable behavior, not internal implementation details.

## Before Writing Tests

Inspect the project first.

Check:

- installed Vitest version
- existing `vitest.config.*`
- test naming/location conventions
- test environment
- setup files
- existing test utilities
- mocking conventions
- React Testing Library usage
- monorepo/test project configuration
- coverage configuration

Follow established good patterns, but do not reproduce poor testing practices simply for consistency.

Do not blindly use APIs from a newer Vitest version.

## Test Structure

Prefer:

```ts
describe("calculateTotal", () => {
  it("returns the total price of all items", () => {
    const result = calculateTotal([
      { price: 10 },
      { price: 20 },
    ])

    expect(result).toBe(30)
  })
})
```

Test names should describe behavior.

Good:

```ts
it("rejects an order when the customer has insufficient credit")
```

Avoid vague names:

```ts
it("works")
it("test order")
it("handles case")
```

Use Arrange / Act / Assert conceptually, but do not add comments for obvious sections unless they improve readability.

## Test Behavior, Not Implementation

Prefer testing:

```ts
expect(result).toEqual(expectedResult)
```

over asserting internal calls that users or consumers do not care about.

Avoid testing:

- private implementation details
- internal variable values
- exact internal function-call sequences
- framework internals

unless those interactions are genuinely part of the contract being tested.

Tests should survive reasonable internal refactoring.

## Test One Behavior

A test should normally verify one coherent behavior.

It may contain multiple assertions when they all describe the same outcome.

Good:

```ts
expect(user.name).toBe("Jack")
expect(user.active).toBe(true)
```

Do not mechanically force one assertion per test.

Also avoid one enormous test that covers many unrelated scenarios.

## Inputs and Edge Cases

Test meaningful boundaries.

For a function like:

```ts
getDiscount(amount)
```

consider:

- normal input
- boundary values
- empty input
- invalid input
- failure conditions

Do not generate dozens of nearly identical tests simply to increase test count.

Use table-driven tests when several cases express the same rule:

```ts
it.each([
  [0, 0],
  [100, 10],
  [200, 20],
])("returns the correct discount for %i", (amount, expected) => {
  expect(getDiscount(amount)).toBe(expected)
})
```

## Async Tests

Always await asynchronous behavior.

Prefer:

```ts
it("loads the user", async () => {
  const user = await getUser("123")

  expect(user.id).toBe("123")
})
```

Do not:

```ts
it("loads the user", () => {
  getUser("123").then((user) => {
    expect(user.id).toBe("123")
  })
})
```

unless the Promise itself is returned.

Use:

```ts
await expect(getUser("missing")).rejects.toThrow()
```

for expected Promise failures.

Never leave unresolved asynchronous work behind after a test.

## Mocks

Mock only when necessary.

Good candidates include:

- external HTTP services
- clocks
- random values
- expensive infrastructure
- filesystem boundaries
- third-party integrations

Avoid mocking the code being tested.

Prefer real collaborators when they are:

- fast
- deterministic
- easy to construct

Excessive mocking couples tests to implementation details.

## `vi.fn`

Use `vi.fn()` when you need a fake function.

```ts
const sendEmail = vi.fn()

sendEmail("user@example.com")

expect(sendEmail).toHaveBeenCalledWith("user@example.com")
```

Use function-call assertions only when the interaction itself matters.

## `vi.spyOn`

Use `vi.spyOn` when observing or temporarily replacing an existing method is appropriate.

```ts
const spy = vi
  .spyOn(logger, "error")
  .mockImplementation(() => {})

expect(spy).toHaveBeenCalled()
```

Restore spies when necessary.

Prefer:

```ts
afterEach(() => {
  vi.restoreAllMocks()
})
```

when the suite creates spies that should never leak between tests.

Vitest specifically warns that mock state should be cleared or restored between tests when appropriate.

## Module Mocking

Use `vi.mock` deliberately.

Remember that `vi.mock` calls are hoisted.

```ts
vi.mock("./email-service", () => ({
  sendEmail: vi.fn(),
}))
```

Do not assume normal statement ordering applies to module mocks.

Avoid mocking an entire module when only one external boundary actually needs replacing.

Be especially careful with module mocking in Browser Mode because native ESM imposes additional restrictions.

## Resetting Mock State

Understand the difference between:

- clearing calls
- resetting implementations
- restoring original implementations

Use the least destructive option required.

Do not globally reset everything after every test without understanding why.

Tests must not depend on mock state left behind by previous tests.

## Fake Timers

Use fake timers for behavior based on:

- delays
- intervals
- timeouts
- scheduled retries

Example:

```ts
vi.useFakeTimers()

try {
  const callback = vi.fn()

  schedule(callback)

  await vi.advanceTimersByTimeAsync(1000)

  expect(callback).toHaveBeenCalled()
} finally {
  vi.useRealTimers()
}
```

Do not use real multi-second waits in unit tests.

Restore real timers after tests using fake timers.

## Dates

When behavior depends on the current time, control the clock rather than relying on the actual current date.

For example:

```ts
vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
```

This makes tests deterministic.

Restore the clock afterward.

## Test Setup

Use `setupFiles` for genuinely shared test initialization such as:

- custom matchers
- polyfills
- DOM cleanup configuration
- global test-library setup

Vitest runs setup files before test-file collection.

Do not turn setup files into hidden application bootstrapping.

A reader should be able to understand most test dependencies from the test itself.

## Test Environment

Choose the environment based on what the code actually needs.

Use `node` for code that does not require a DOM.

Use a DOM-compatible environment only when testing browser/DOM-dependent code.

Do not use `jsdom` for every test merely because the project contains React.

For tests that need actual browser behavior, consider Vitest Browser Mode instead of relying on DOM simulation. Vitest treats Browser Mode separately from Node test environments.

## React Tests

When testing React, prefer behavior visible to the user.

With Testing Library, prefer queries such as:

```ts
screen.getByRole("button", {
  name: "Save",
})
```

over implementation-specific selectors.

Prefer:

- roles
- labels
- visible text
- accessible names

Avoid:

```ts
container.querySelector(".save-button")
```

unless semantic queries cannot reasonably identify the element.

Do not test React component internals or hook implementation details when user behavior can be tested instead.

## Testing Hooks

Test hooks through their public behavior.

Do not duplicate React's own tests.

For custom hooks containing meaningful application logic, test:

- state transitions
- returned values
- external effects

Prefer testing through the component using the hook when that better represents actual behavior.

## External Requests

Do not make real network requests in unit tests.

Prefer mocking at an external boundary using an appropriate tool such as MSW when the project already uses it.

For service-layer tests, mock the HTTP boundary rather than every internal function.

Keep the test realistic while remaining deterministic.

## Database Tests

Clearly distinguish:

- unit tests
- integration tests

Unit tests should not silently depend on a real production-like database.

Integration tests may use a real test database when database behavior is what needs verification.

Never point automated tests at production data.

Each database test should leave the environment in a predictable state.

## Test Data

Prefer small explicit fixtures.

Good:

```ts
const user = {
  id: "user-1",
  name: "Jack",
  active: true,
}
```

Avoid enormous fixtures containing irrelevant fields.

Use factories/builders only when fixture creation has genuinely become repetitive or complex.

Do not introduce a sophisticated test-data framework for three simple objects.

## Configuration

Keep `vitest.config.ts` simple.

Example:

```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
  },
})
```

Vitest already provides sensible default test-file patterns, so avoid overriding `include` unless the project actually needs custom discovery.

Do not duplicate configuration unnecessarily across packages.

## Shared Configuration

In monorepos, a shared configuration can contain genuinely common defaults.

Package-level configs may extend or merge it when they need:

- aliases
- different environments
- package-specific setup
- browser tests
- package-specific include patterns

Do not put application-specific aliases into a supposedly generic shared configuration.

## Aliases

When tests need aliases matching application imports, configure them explicitly and consistently.

Example:

```ts
resolve: {
  alias: {
    "@app": fileURLToPath(
      new URL("./src", import.meta.url),
    ),
  },
}
```

Do not rewrite production imports just to satisfy the test runner if proper test resolution can solve the problem.

## Test Projects

For monorepos or applications requiring materially different test configurations, use Vitest test projects.

Examples:

- Node unit tests
- browser tests
- package-specific suites
- integration tests

Current Vitest uses the `