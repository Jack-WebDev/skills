---
name: typescript-best-practices
description: Apply version-aware TypeScript practices when implementing, reviewing, or refactoring TypeScript or TSX code in any application or library.
---

# TypeScript Best Practices

Use TypeScript to make important contracts explicit and invalid states difficult to represent without making the code harder to understand.

## Respect the project version

Before introducing version-specific syntax, compiler options, standard-library APIs, or type-system features, inspect:

- the installed TypeScript version
- the effective `tsconfig`, including inherited configuration
- the runtime and module targets
- relevant framework, dependency, lint, and build constraints
- existing types and runtime validation patterns

Treat the installed compiler and project configuration as authoritative. Do not silently upgrade configuration or rewrite older but valid TypeScript merely to make it look newer.

## Balance inference and explicit contracts

Prefer inference when a local type is clear and accurately inferred. Add explicit types when they clarify or protect:

- exported and public APIs
- callback and dependency boundaries
- domain models
- complex return values
- intentional widening or narrowing

Do not add annotations mechanically. Avoid widening literals or precise dependency types into broader types without a concrete reason. Reuse and derive from authoritative library, schema, and API types instead of recreating them by hand.

Keep exported types stable, purposeful, and understandable. Treat changes to them as compatibility changes.

## Model real domain states

Represent valid states and relationships directly. Prefer precise unions over broad primitives, and use discriminated unions when they make state handling safer and clearer. Use exhaustive handling where missing a case would be significant; an unreachable-case check may be appropriate when the compiler should enforce completeness.

Use generics only when they express a real relationship between values or make a genuinely reusable contract safer. Avoid generic parameters, conditional types, mapped types, and other type-level machinery that add complexity without practical value.

Use utility types intentionally. Do not stack them until the resulting contract becomes difficult to read.

Choose `type` or `interface` based on meaning and project convention:

- prefer a type alias for unions, mapped types, and simple aliases
- use an interface when intentional declaration merging or object-oriented extension semantics are needed

Do not convert between them without a concrete benefit.

## Narrow instead of asserting

Prefer `unknown` for untrusted or genuinely unknown values, then narrow it with runtime checks. Avoid `any` unless an interoperability boundary makes it genuinely unavoidable; keep unavoidable usage narrow and documented by context.

Prefer control-flow narrowing, discriminants, and focused type guards over assertions. Avoid:

- assertions used only to silence the compiler
- double assertions such as `value as unknown as Target`
- non-null assertions when absence is possible
- suppression comments without a specific, justified reason

Treat compiler errors as evidence that a contract or assumption may be wrong. Fix the underlying mismatch rather than weakening types by default.

## Separate static types from runtime safety

TypeScript types disappear at runtime. Validate data from HTTP requests, storage, environment variables, parsed JSON, user input, and other external systems at the boundary before treating it as trusted.

Keep runtime validation and static typing aligned but conceptually separate. When the project uses a schema library, prefer deriving static types from the schema when that avoids two competing definitions of the same contract.

## Verify the result

Use the project's configured compiler and checks. Confirm that:

1. The code is compatible with the installed TypeScript version and `tsconfig`.
2. External values are validated before trusted use.
3. Assertions and escape hatches are absent or narrowly justified.
4. Domain states and exported contracts remain accurate and readable.
5. Type complexity is proportionate to the runtime problem.
