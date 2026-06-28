# Lesson 04: Running Effects And Runtime Boundaries

## Goal

Learn where Effect programs are executed. Reusable workflow code should return
`Effect` values, while `Effect.runSync`, `Effect.runPromise`, `Effect.runSyncExit`,
and `Effect.runPromiseExit` belong at application boundaries such as CLI commands,
HTTP handlers, scripts, or tests.

## Concepts

- `Effect.runSync` for synchronous effects when the boundary needs a plain value.
- `Effect.runPromise` for async boundaries that need a `Promise`.
- `Effect.runSyncExit` for synchronous boundaries that need to inspect success or failure.
- `Effect.runPromiseExit` for async boundaries that need to inspect success or failure.
- `Exit` as data describing whether a run succeeded or failed.
- Runtime boundaries versus reusable business logic.

## Before Coding

Read these first:

- https://effect.website/docs/getting-started/running-effects/
- https://effect.website/docs/runtime/
- `.agents/skills/effect-ts/references/guide-effect.md`

Watch where the runtime call appears. The reusable function returns an
`Effect<A, E, R>`. The boundary decides how to run it and how much failure detail
it wants back.

## Worked Example

Open [src/lesson.ts](src/lesson.ts). The worked example is a small warehouse
handoff workflow.

A warehouse support tool needs to prepare a printable dispatch summary after an
operator scans an order id. The core workflow validates the id, reads the current
time, and renders a line that can be shown in a CLI or sent to an HTTP client.

That workflow is reusable, so it returns an `Effect`. It does not call the
runtime itself.

The boundary helpers show four different ways an application edge might run that
same kind of program:

- `runCliBoundary` uses `Effect.runSync` when the boundary expects a plain value.
- `inspectCliBoundary` uses `Effect.runSyncExit` when the boundary wants `Exit`
  data instead of throwing on failure.
- `runHttpBoundary` uses `Effect.runPromise` when the boundary needs a `Promise`.
- `inspectHttpBoundary` uses `Effect.runPromiseExit` when an async boundary wants
  success or failure as data.

The important habit is not "always use a run function". The habit is: keep
business code effect-returning, and run once at the edge.

## Exercise

Open [src/exercise.ts](src/exercise.ts).

### Story

You are adding a "Preview refund approval" action to a support tool.

A support specialist reviews a refund request, then needs either a console-friendly
preview for an internal operations command or a Promise-returning result for a
web API route. The business workflow should validate the refund id, read the
review timestamp, and build a preview as an `Effect`.

The support tool has two kinds of boundaries:

- the support console wants a plain value for success
- the web API wants a `Promise`
- both boundaries sometimes need `Exit` data so they can inspect typed failures
  without losing failure details

### User Story

As a support specialist, I want the refund preview workflow to stay reusable
while each application edge chooses how to run it, so that console commands and
web handlers do not force runtime details into business logic.

### Implementation Requirements

The reusable workflow helpers are already scaffolded. Finish the boundary
helpers:

1. `runSupportConsoleBoundary`: run a runnable Effect synchronously and return
   the plain success value.
2. `inspectSupportConsoleBoundary`: run a runnable Effect synchronously and
   return an `Exit`.
3. `runSupportApiBoundary`: run a runnable Effect as a `Promise`.
4. `inspectSupportApiBoundary`: run a runnable Effect as a `Promise<Exit>`.

Do not call runtime functions inside the reusable refund workflow. Runtime calls
belong only in the boundary helpers or tests.

## Tests

The worked example tests are in [test/lesson.test.ts](test/lesson.test.ts). They prove:

1. Constructing the business workflow does not execute it.
2. A sync boundary can turn a successful Effect into a plain value.
3. `runSyncExit` returns an `Exit` that can be inspected for typed failure.
4. An async boundary can expose a successful Effect as a `Promise`.
5. `runPromiseExit` returns an async `Exit` instead of rejecting for typed failure.

Your learner tests are in [test/exercise.test.ts](test/exercise.test.ts). Replace
the `it.todo(...)` entries with real tests as you implement the exercise.

Useful commands:

```sh
npm run check
npx vitest run lessons/04-running-effects/test/lesson.test.ts
npx vitest run lessons/04-running-effects/test/exercise.test.ts
```

## Review Questions

1. Why should `prepareDispatchSummary` return an `Effect` instead of calling
   `Effect.runSync` internally?
2. What does `Effect.runSyncExit` preserve that `Effect.runSync` does not return
   as a value?
3. If an HTTP handler already expects a `Promise`, which boundary helper fits
   better: `runSync` or `runPromise`? Why?
4. In the dispatch workflow, what happens if the Effect is constructed but no
   boundary function runs it?
5. Why is it useful for tests to inspect `Exit` directly when teaching runtime
   boundaries?

## Completion Checklist

- [x] Runtime calls appear only in boundary helpers and tests.
- [x] Reusable workflow functions return `Effect`.
- [x] Tests compare direct results and `Exit` results.
- [x] Exercise scaffold exists.
- [x] Learner test scaffold exists.
- [x] `npm run check` passes.
