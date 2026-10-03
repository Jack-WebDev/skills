---
name: tanstack-query-best-practices
description: Use when writing, modifying, reviewing, or debugging TanStack Query code, including queries, mutations, query keys, caching, invalidation, prefetching, pagination, optimistic updates, server state, and TanStack Router integration.
---

# TanStack Query

Use this skill whenever working with `@tanstack/react-query`.

## Core Principles

Use TanStack Query for **server state**:

- API data
- database-backed data
- remote resources
- cached responses
- asynchronous mutations

Do not use TanStack Query as a replacement for normal React state.

Use React state for temporary client-only state such as:

- open/closed UI
- unsaved form values
- local selections
- temporary interaction state

Before changing query code, inspect:

- installed TanStack Query version
- existing query conventions
- `QueryClient` configuration
- query key conventions
- API/service layer
- TanStack Router integration
- existing `queryOptions` helpers
- mutation/invalidation patterns

Do not force v5 patterns into an older codebase without checking compatibility.

## Queries

Use `useQuery` for reading server data.

Prefer the object syntax:

```tsx
const usersQuery = useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
})
```

The query function should:

- return a Promise
- resolve with the requested data
- throw/reject when the request fails

Do not swallow errors and return fake fallback data unless that is intentional application behavior.

Avoid:

```tsx
useEffect(() => {
  fetchUsers().then(setUsers)
}, [])
```

when the data is server state that TanStack Query should manage.

## Query Keys

Query keys define cache identity.

Every value that changes what data is fetched should normally appear in the query key.

Prefer:

```tsx
useQuery({
  queryKey: ["users", userId],
  queryFn: () => getUser(userId),
})
```

For filtered data:

```tsx
useQuery({
  queryKey: ["users", { page, status }],
  queryFn: () => getUsers({ page, status }),
})
```

Do not use:

```tsx
queryKey: ["users"]
```

when the query function secretly depends on `userId`, `page`, filters, or other changing values.

Query keys must remain serializable and predictable.

Use consistent hierarchical keys:

```tsx
["users"]
["users", "list"]
["users", "list", filters]
["users", "detail", userId]
```

## Reusable Query Definitions

When a query is reused across loaders, components, prefetching, or cache operations, prefer `queryOptions`.

```tsx
export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ["users", "detail", userId],
    queryFn: () => getUser(userId),
  })
}
```

Then:

```tsx
useQuery(userQueryOptions(userId))
```

or:

```tsx
queryClient.ensureQueryData(userQueryOptions(userId))
```

This keeps the `queryKey` and `queryFn` together and preserves TypeScript inference.

Do not create large query-factory abstractions when a small `queryOptions` function is sufficient.

## staleTime

Understand `staleTime` before changing refetch behavior.

By default, query data is considered stale immediately.

Use `staleTime` to describe how long cached data can reasonably be considered fresh.

Example:

```tsx
queryOptions({
  queryKey: ["countries"],
  queryFn: getCountries,
  staleTime: 5 * 60 * 1000,
})
```

Do not disable:

- refetch on mount
- refetch on focus
- refetch on reconnect

just because the application appears to refetch "too often".

First decide whether the correct solution is an appropriate `staleTime`.

Do not set `staleTime: Infinity` globally without understanding the freshness consequences.

## gcTime

Do not confuse `gcTime` with `staleTime`.

- `staleTime` = how long data is considered fresh.
- `gcTime` = how long unused cached data remains before garbage collection.

Change `gcTime` only when cache retention requirements justify it.

## Mutations

Use `useMutation` for operations that change server state.

Examples:

- create
- update
- delete
- submit
- approve
- publish

Prefer:

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
    })
  },
})
```

Keep actual HTTP/database logic outside the React component when practical.

The mutation should coordinate application behavior, not contain an entire service implementation.

## Invalidation

After a successful mutation, identify which cached data is now potentially outdated.

Invalidate that data deliberately.

Prefer:

```tsx
queryClient.invalidateQueries({
  queryKey: ["users"],
})
```

over manually refetching many individual components.

Use specific keys when only specific data changed:

```tsx
queryClient.invalidateQueries({
  queryKey: ["users", "detail", userId],
})
```

Do not invalidate the entire cache after every mutation.

Do not invalidate unrelated resources "just to be safe".

TanStack Query invalidation is usually preferable to manually trying to synchronize every copy of changed server data.

## Direct Cache Updates

When the mutation response already contains the authoritative updated resource, consider updating the cache directly:

```tsx
onSuccess: (user) => {
  queryClient.setQueryData(
    ["users", "detail", user.id],
    user,
  )
}
```

Use this only when the returned data matches what belongs in that cache entry.

Do not manually manipulate caches when simple invalidation would be safer and clearer.

## Dependent Queries

When one query requires data from another, use `enabled`.

```tsx
const userQuery = useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUser(userId),
  enabled: Boolean(userId),
})
```

Do not make requests with invalid placeholder IDs just to satisfy the query function.

## Pagination and Filtering

Put pagination/filter state that affects fetched data in the query key.

```tsx
useQuery({
  queryKey: ["users", { page, search }],
  queryFn: () => getUsers({ page, search }),
})
```

If the URL should preserve that state, let TanStack Router own the URL/search parameters and pass the values into TanStack Query.

Do not maintain separate competing copies of pagination/filter state in:

- the URL
- component state
- query state

unless there is a clear reason.

## TanStack Router Integration

When using TanStack Router:

- Router coordinates routing and route dependencies.
- Query manages server-state caching and freshness.

A common pattern is:

```tsx
loader: ({ context }) =>
  context.queryClient.ensureQueryData(
    userQueryOptions(),
  )
```

Then the component consumes the same query definition.

Pass `QueryClient` through Router context when appropriate.

Do not fetch the same resource independently in both a Router loader and `useQuery` using unrelated cache logic.

## Prefetching

Use TanStack Query's prefetch/cache APIs when data will likely be needed soon.

Prefer:

```tsx
queryClient.prefetchQuery(userQueryOptions(userId))
```

Do not build custom in-memory prefetch caches around TanStack Query.

## Optimistic Updates

Use optimistic updates only when they noticeably improve UX.

An optimistic mutation should have a clear strategy for:

1. canceling conflicting requests
2. saving previous cache state
3. applying the optimistic value
4. rolling back on failure
5. invalidating/reconciling after completion

Do not introduce optimistic updates for trivial flows where normal invalidation is sufficient.

Correctness is more important than eliminating a small loading state.

## Derived Data

Use `select` when a component only needs a transformed subset of query data.

```tsx
const userNamesQuery = useQuery({
  ...usersQueryOptions(),
  select: (users) => users.map((user) => user.name),
})
```

Do not copy query data into `useState` simply to transform it.

Avoid:

```tsx
const { data } = useQuery(...)

const [users, setUsers] = useState([])

useEffect(() => {
  setUsers(data ?? [])
}, [data])
```

This creates unnecessary competing state.

## Loading and Errors

Use query state intentionally:

```tsx
if (query.isPending) {
  return <Loading />
}

if (query.isError) {
  return <ErrorMessage error={query.error} />
}
```

Understand the difference between:

- `isPending`
- `isFetching`
- `isError`
- `isSuccess`

Do not show a full loading screen every time `isFetching` becomes true if usable cached data is already available.

Background refetching should generally not destroy the current UI.

## QueryClient

Create the `QueryClient` at the appropriate application boundary.

Do not create a new `QueryClient` inside a component render:

```tsx
function App() {
  const queryClient = new QueryClient() // avoid
}
```

unless the framework integration intentionally manages its lifecycle that way.

A constantly recreated client destroys useful cache behavior.

## API Layer

Prefer separating request logic from query coordination.

Good:

```tsx
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}
```

Then:

```tsx
useQuery({
  queryKey: ["users", id],
  queryFn: () => getUser(id),
})
```

Do not make every query function responsible for unrelated UI behavior.

## TypeScript

Let TanStack Query infer types whenever possible.

Prefer typed API functions:

```tsx
async function getUser(id: string): Promise<User> {
  // ...
}
```

Then:

```tsx
const query = useQuery({
  queryKey: ["users", id],
  queryFn: () => getUser(id),
})
```

Avoid unnecessary explicit generics such as:

```tsx
useQuery<User, Error, User, QueryKey>(...)
```

when inference already provides the correct types.

Do not solve query typing problems with `as any`.

Fix the source type instead.

## Avoid

Do not:

- use TanStack Query for ordinary UI state
- fetch server state through unnecessary `useEffect`
- omit query dependencies from query keys
- create unstable or non-serializable query keys
- recreate `QueryClient` unnecessarily
- duplicate query data into React state
- invalidate the entire cache after every mutation
- disable refetch behavior without understanding `staleTime`
- confuse `staleTime` and `gcTime`
- manually synchronize many components after mutations
- introduce optimistic updates without rollback handling
- duplicate Router loader data and Query cache
- use `as any` to bypass Query types
- blindly apply APIs from a different TanStack Query version

## Completion Checklist

Before finishing Query work, verify:

- Server state belongs in TanStack Query.
- Query keys completely describe fetched data.
- Reusable queries keep `queryKey` and `queryFn` together.
- Appropriate `staleTime` has been considered.
- Mutations invalidate or update affected cache entries.
- Unrelated cache entries are not invalidated.
- Query data is not unnecessarily copied into React state.
- Router and Query responsibilities are not duplicated.
- Loading and background fetching are handled differently where appropriate.
- QueryClient lifecycle is stable.
- Type inference is preserved.
- The implementation matches the installed TanStack Query version.
- The solution uses standard TanStack Query behavior before adding custom abstractions.