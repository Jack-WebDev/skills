---
name: react-best-practices
description: Apply version-aware React practices when implementing, reviewing, or refactoring components, hooks, and application UI while preserving the project's established architecture.
---

# React Best Practices

Build predictable, accessible React interfaces with clear state ownership, focused components, and minimal synchronization logic.

## Treat the installed version as authoritative

Before changing React code, inspect the installed `react`, `react-dom`, framework, type definitions, build tooling, and relevant surrounding code. Follow the APIs and conventions supported by those versions.

A React 18 codebase must not be rewritten with React 19-only APIs, syntax, or recommendations merely because they are newer. Use React 19 features only when the installed stack supports them and they suit the task. Do not turn unrelated work into a React, framework, compiler, rendering, or hydration migration.

Preserve the existing rendering and application architecture unless the requested work requires changing it. When an upgrade would be valuable but is out of scope, describe it separately rather than implementing it silently.

## Respect the existing ecosystem

Understand how the project currently handles routing, server rendering, data fetching, forms, state, styling, errors, and testing. Follow sound established conventions and the installed framework's architecture.

Do not introduce or replace a router, global store, form library, data-fetching library, component system, or framework merely because another option is newer or fashionable. Do not introduce framework-specific patterns into an application that does not use that framework.

## Keep components focused

Give each component a clear UI or behavioral responsibility. Prefer understandable JSX and composition over giant configurable components, render machinery, inheritance, or unnecessary wrapper components.

Extract a component or custom hook when it creates a meaningful boundary, clarifies state ownership, isolates cohesive behavior, or enables real reuse. Do not split code based only on line count or create abstractions for hypothetical reuse.

Keep component APIs small and meaningful. Passing props through a few levels is normal; introduce context only when data is genuinely shared across a meaningful subtree. Do not use context as an automatic global-state solution.

## Model state deliberately

Keep state as local as practical and lift it only to the nearest owner that must coordinate it. Do not introduce global state when component, URL, server, or existing library state is sufficient.

Store the minimum source of truth:

- derive values during render instead of synchronizing duplicate state
- avoid contradictory state combinations
- preserve rather than accidentally reset state when component identity should remain stable
- treat state and props as immutable
- use functional state updates when the next value depends on the previous value

Preserve controlled and uncontrolled component semantics. Do not switch between them accidentally or maintain competing sources of truth.

## Use effects for external synchronization

Use effects to synchronize with systems outside React, such as subscriptions, browser APIs, timers, or imperative libraries. Do not use effects as the default mechanism for deriving render values, handling user events, or chaining application control flow.

Keep effect dependencies accurate. Do not suppress dependency warnings to force desired timing. Make setup and cleanup symmetrical, prevent stale asynchronous work from updating state, and ensure behavior remains correct when development tooling runs effects more than once.

## Use hooks and optimization correctly

Follow the Rules of Hooks: call hooks unconditionally at the top level of React components or custom hooks. Custom hooks should represent cohesive reusable behavior, not hide arbitrary code.

Do not add `useMemo`, `useCallback`, or `memo` by default. Use them when profiling, referential stability requirements, or a demonstrated expensive calculation provides a concrete reason. Confirm that their dependencies and maintenance cost do not outweigh the benefit.

Use refs for values that do not participate in rendering or for supported imperative integration. Do not use refs to bypass React's state model.

## Preserve interaction and accessibility

Keep event handling explicit and close to the behavior it triggers. Use semantic HTML first, preserve keyboard access and focus behavior, label controls, and expose meaningful accessible names and states.

Use stable list keys derived from item identity. Avoid array indexes when items can be inserted, removed, filtered, or reordered.

Handle loading, empty, error, and success states where relevant. Preserve the project's existing error-boundary, Suspense, and server/client conventions, and verify their support before introducing new ones.

## Verify the result

Test observable user behavior rather than component internals. Confirm that:

1. Every API and pattern is supported by the installed React and framework versions.
2. Rendering stays pure and state has one clear owner.
3. Derived values are not duplicated in state and effects are truly necessary.
4. Hooks, dependencies, cleanup, and asynchronous behavior are correct.
5. Memoization and abstractions have a concrete benefit.
6. Accessibility and controlled or uncontrolled semantics are preserved.
7. Existing libraries and architecture were respected.
