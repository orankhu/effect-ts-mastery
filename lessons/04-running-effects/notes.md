# Lesson 04 Notes

## Main Point

An `Effect` program should usually be returned from reusable code and run at the
edge of the application.

The lesson uses small boundary helpers to make that edge visible:

- `runCliBoundary` calls `Effect.runSync`.
- `inspectCliBoundary` calls `Effect.runSyncExit`.
- `runHttpBoundary` calls `Effect.runPromise`.
- `inspectHttpBoundary` calls `Effect.runPromiseExit`.

## Why `Exit`

The direct run functions are useful when a boundary wants the successful value
and is willing to let failure leave the boundary as an exception or rejected
Promise.

The `Exit` variants keep success or failure as data. That makes them useful for
teaching, diagnostics, and boundaries that want to translate typed failures into
responses without losing failure information.

## Runtime Boundary Rule

The reusable workflow functions in `src/lesson.ts` return `Effect`. The only
runtime calls in lesson source are explicitly named boundary helpers.

Tests use `@effect/vitest` and wrap Promise-returning boundary helpers with
`Effect.promise`, so the test bodies still run as Effect tests.

## Current Status

Ready for learner review with:

- Worked example implementation.
- Tests for lazy construction, direct sync execution, sync `Exit`, async
  execution, and async `Exit`.
- Learner exercise scaffold for implementing boundary helpers.
- Learner test scaffold with todos.
- README explaining why reusable functions return Effects.
