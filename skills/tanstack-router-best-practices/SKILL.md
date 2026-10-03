---
name: tanstack-router-best-practices
description: Apply TanStack Router best practices when creating, modifying, reviewing, or debugging routes, navigation, search params, loaders, route context, authentication, layouts, and route-level state.
---

# TanStack Router

Use this skill whenever working with `@tanstack/react-router` or routing inside a TanStack Start application.

## Core Principles

Write routing code that is:

- Type-safe
- Predictable
- URL-driven
- Easy to navigate and maintain
- Compatible with the project's installed TanStack Router version
- Consistent with the project's existing routing approach

Prefer simple TanStack Router primitives over custom abstractions.

Do not introduce wrappers, helpers, route factories, or routing abstractions unless they remove real repeated complexity.

## Before Changing Routes

Inspect the existing project first.

Check:

- installed TanStack Router version
- file-based vs code-based routing
- route directory structure
- router creation/configuration
- root route
- route context
- authentication approach
- existing loaders
- search-param validation
- TanStack Query usage
- existing error/pending/not-found handling

Do not rewrite an existing routing architecture simply because a newer pattern exists.

For new projects, prefer file-based routing unless there is a concrete reason not to.

## File-Based Routing

When the project uses file-based routing:

- Use `createFileRoute`.
- Follow TanStack Router file naming conventions.
- Let the route hierarchy express layouts and nesting.
- Use pathless layout routes for shared behavior/layouts that should not add URL segments.
- Keep routes focused on route responsibilities.
- Never manually edit generated route-tree files such as `routeTree.gen.ts`.

Avoid duplicating the filesystem route hierarchy in custom configuration.

## Route Components

Keep route files readable.

A route may coordinate:

- params
- search validation
- loader dependencies
- loaders
- authentication/authorization routing
- route context
- metadata
- pending/error/not-found behavior
- the route component

Do not put large amounts of unrelated business logic directly into the route definition.

Extract domain logic into appropriate modules while keeping route-specific coordination in the route.

## Path Parameters

Use TanStack Router's typed params APIs.

Prefer:

```tsx
const { postId } = Route.useParams()
```

Do not manually parse the pathname.

When navigating, provide dynamic values using `params`.

Prefer:

```tsx
navigate({
  to: "/posts/$postId",
  params: { postId },
})
```

Do not manually interpolate URLs such as:

```tsx
navigate({
  to: `/posts/${postId}`,
})
```

when TanStack Router can type the route.

## Search Parameters

Treat search params as typed URL state.

Use them for state that should survive:

- refreshes
- browser back/forward
- bookmarking
- sharing URLs

Examples:

- pagination
- filters
- sorting
- selected tabs
- search queries

Validate search params at the route boundary.

Prefer schema validation where the project already uses a validation library.

Never blindly trust raw search params.

Use:

```tsx
Route.useSearch()
```

instead of manually reading `window.location.search`.

When updating one search value, preserve existing values when appropriate:

```tsx
navigate({
  to: ".",
  search: (prev) => ({
    ...prev,
    page: 2,
  }),
})
```

## Data Loading

Use route loaders when data is needed as part of entering/rendering a route.

Keep loader dependencies explicit.

If loader output depends on search params, declare that dependency with `loaderDeps`.

Prefer:

```tsx
export const Route = createFileRoute("/users")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  loader: ({ deps }) => getUsers(deps.page),
})
```

Do not secretly read changing URL state inside a loader without declaring the dependency.

This keeps caching, preloading, and reload behavior predictable.

Keep loaders focused on data needed by the route.

Avoid fetching route-critical data in `useEffect` when the router can coordinate it before rendering.

## TanStack Query

If the project uses TanStack Query, do not create competing sources of truth between Router loaders and Query.

A common pattern is:

- Router coordinates when data is needed.
- TanStack Query owns caching, freshness, refetching, and mutations.

Pass the `QueryClient` through router context when appropriate.

Loaders may preload/ensure query data before the component renders.

Keep query keys complete. If data depends on a route param or search value, that value normally belongs in the query key.

Do not duplicate the same server data independently in loader state and Query cache without a reason.

## Route Context

Use router context for dependencies routes need access to, such as:

- authentication state
- `QueryClient`
- application services
- request-scoped dependencies

Prefer dependency injection through context over importing mutable global instances everywhere.

Do not use router context as a dumping ground for arbitrary application state.

## Authentication

Use `beforeLoad` for route-level authentication checks.

For groups of protected routes, prefer a protected/pathless layout route rather than repeating the same check on every child.

Example:

```tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
```

Do not rely on component-level redirects to protect routes if `beforeLoad` can prevent the route from loading in the first place.

A route guard protects UI navigation. It is **not** a security boundary.

Private APIs, server functions, and backend endpoints must perform their own authentication and authorization.

## Navigation

Prefer:

```tsx
<Link />
```

for user-clickable navigation.

Prefer:

```tsx
useNavigate()
```

for imperative navigation caused by application logic.

Use typed `to`, `params`, `search`, and `hash` options instead of constructing URL strings manually.

Do not use:

```tsx
window.location.href = ...
```

for normal internal application navigation.

Do not use plain `<a>` elements for internal Router navigation unless a full document navigation is intentionally required.

## Nested Routes and Layouts

Use nested routes when pages genuinely share layout or route behavior.

Use `<Outlet />` for child route rendering.

Do not duplicate headers, navigation, authentication checks, or shared page structure across sibling routes when a parent layout can own them.

Do not create deeply nested route hierarchies without a meaningful UI, URL, or behavioral reason.

## Errors, Pending States, and Not Found

Handle route-level failure states intentionally.

Use the Router's:

- `pendingComponent`
- `errorComponent`
- `notFoundComponent`

where appropriate.

Prefer boundaries close to the part of the route tree that can fail.

Do not make every error fall through to one generic application-level error screen when a local route can provide a useful recovery experience.

## Performance

Use Router preloading rather than building custom hover-prefetch systems.

Use route code splitting when the application benefits from it.

When supported by the project's setup, prefer TanStack Router's automatic code splitting over maintaining unnecessary manual lazy-loading infrastructure.

Do not optimize route loading blindly. Measure or identify an actual loading/bundle problem first.

## Type Safety

Do not bypass Router types with:

```tsx
as any
```

or unnecessary type assertions.

If TanStack Router reports an invalid route, param, search value, or navigation target, fix the underlying mismatch.

Prefer route-specific APIs such as:

```tsx
Route.useParams()
Route.useSearch()
Route.useLoaderData()
Route.useRouteContext()
```

When code far from the route needs route APIs, consider `getRouteApi()` rather than creating circular imports.

## Avoid

Do not:

- manually edit generated route trees
- parse route params from `window.location`
- manually concatenate typed route URLs
- store shareable URL state only in React state
- perform route authentication solely inside components
- fetch route-critical data through unnecessary `useEffect`
- hide loader dependencies
- use unvalidated external search params
- duplicate route guards across many child routes
- create custom routing abstractions without a demonstrated need
- force the latest TanStack Router API into an older codebase
- confuse client route guards with server authorization

## Completion Checklist

Before finishing routing work, verify:

- Route structure matches the intended URL/layout hierarchy.
- Params remain type-safe.
- Search params are validated.
- Loader dependencies are explicit.
- Authentication uses the appropriate route boundary.
- Server-side authorization still exists where required.
- Navigation uses Router APIs.
- Shared layout behavior is not duplicated.
- Query and Router responsibilities are not duplicated.
- Generated files were not manually modified.
- Error/pending/not-found states are handled where necessary.
- The implementation matches the installed TanStack Router version.
- The solution is simpler than any abstraction it replaces.