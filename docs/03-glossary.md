# Glossary

This glossary is the shared vocabulary for all future lessons.

| Term | Meaning | Mastery cue |
| --- | --- | --- |
| Effect | A lazy value that describes a workflow which can succeed, fail, or require services. | You can say what happens before and after it is run. |
| `Effect<A, E, R>` | The core type shape: success `A`, expected error `E`, requirements `R`. | You can read signatures without running code. |
| Success channel | The `A` type parameter. The value produced when the workflow succeeds. | You know which combinators transform only success. |
| Error channel | The `E` type parameter. The modeled, expected failures. | You avoid throwing for known business errors. |
| Requirements channel | The `R` type parameter. Services required to run the workflow. | You can tell which layer must be provided. |
| `never` | TypeScript's uninhabited type. In `E`, it means no modeled expected errors. In `R`, it means no requirements. | You know why providing a service removes it from `R`. |
| `unknown` | A type-safe "we do not know yet" type. Often appears at unsafe boundaries. | You validate or narrow it instead of asserting. |
| Laziness | Effect construction does not execute the described work. | You can write a test proving construction did nothing. |
| Runtime | The machinery that executes an Effect with services, fiber supervision, and platform behavior. | You keep runtime calls at app edges. |
| Boundary | The place where an Effect program is executed or external data enters/leaves. | You run effects and validate data there. |
| `runSync` | Runs a synchronous effect and returns its value or throws if it fails/dies. | You use it only when async is impossible and failure is understood. |
| `runPromise` | Runs an effect and returns a Promise. | You use it at async boundaries, not inside reusable logic. |
| `Exit` | Data type representing success or failure of a completed effect. | You inspect failures without throwing. |
| `Cause` | Structured failure information including fail, die, interrupt, and combined causes. | You can debug whether something failed, died, or was interrupted. |
| Expected error | A known, modeled failure represented in `E`. | You create named error types for domain failure. |
| Defect | An unexpected bug or unrecoverable problem, not modeled as expected failure. | You do not hide defects with broad catch-all recovery. |
| `Effect.fail` | Creates an Effect that fails with an expected error. | You use it for business failure. |
| `Effect.die` | Creates a defect. | You reserve it for impossible or bug-like states. |
| `Effect.succeed` | Creates an Effect that succeeds with a value. | You avoid wrapping every pure value unless composition needs it. |
| `Effect.sync` | Captures synchronous side effects lazily. | You use it when work should be delayed until runtime. |
| `Effect.promise` | Captures a Promise-returning computation. | You know rejected promises become defects unless modeled differently. |
| `Effect.try` | Captures sync code that may throw and maps thrown values to expected errors. | You use it for unsafe sync APIs. |
| `Effect.tryPromise` | Captures promise code that may reject and maps rejection to expected errors. | You use it for legacy async APIs. |
| `pipe` | A composition helper that passes a value through functions. | You use it when transformations read top to bottom. |
| `map` | Transforms the success value of an effect. | You do not use it when the transform returns another Effect. |
| `flatMap` | Sequences effectful work depending on a previous success. | You use it when the next step is effectful. |
| `tap` | Runs an effectful observation while preserving the original success value. | You use it for logging or validation side effects. |
| `Effect.gen` | Generator-based syntax for sequencing effects with `yield*`. | You use it for readable multi-step workflows. |
| `yield*` | In Effect generators, unwraps the success value of an effect while preserving error and requirement types. | You can predict how `E` and `R` widen. |
| Control flow operators | Effect combinators for branching, filtering, and conditional execution. | You keep business decisions inside the typed program. |
| `Data.TaggedError` | Helper for defining immutable tagged error classes. | You recover by tag instead of brittle string checks. |
| Tagged union | A union discriminated by a stable `_tag` or similar field. | You use exhaustive matching where possible. |
| `catchTag` | Recovers one tagged error type. | You preserve other error cases. |
| `catchTags` | Recovers several tagged errors. | You avoid broad recovery when only specific errors are handled. |
| `match` | Converts success or failure into a plain value. | You use it near boundaries for final rendering. |
| `matchEffect` | Converts success or failure into another effect. | You use it when recovery is effectful. |
| Fallback | Alternative effect used when the first fails. | You understand which error types survive. |
| Retry | Re-running a failed effect according to policy. | You separate operation from retry schedule. |
| Timeout | Failing or ending work that takes too long. | You model timeout as part of expected behavior. |
| Schedule | A reusable recurrence policy for retrying, repeating, or time-based behavior. | You compose schedules instead of hand-writing loops. |
| Duration | Effect data type for time spans. | You avoid raw millisecond magic numbers where clarity matters. |
| TestClock | Test service for deterministic time control. | You do not sleep for real in tests. |
| Validation | Checking input against rules, often with accumulated errors. | You know when fail-fast is not user-friendly. |
| Error accumulation | Collecting multiple failures instead of stopping at the first. | You use it for forms, config, and batch validation. |
| Service | An interface describing a dependency needed by a program. | You can swap live and test implementations. |
| Context | A typed map from tags to services. | You understand how requirements are satisfied. |
| Tag | A typed key for accessing a service from context. | You create one tag per service. |
| Layer | A recipe for building services and satisfying requirements. | You can draw the dependency graph. |
| Live layer | Production implementation of a service. | You provide it at application startup. |
| Test layer | Test implementation of a service. | You use it to avoid real IO or randomness. |
| Layer composition | Combining layers so dependencies of one are satisfied by another. | You can wire service graphs without manual plumbing. |
| Layer memoization | Sharing layer construction within a scope/runtime where appropriate. | You can prove a service is not rebuilt unexpectedly. |
| `Effect.provide` | Supplies a layer or context to remove requirements from a program. | You know what remains in `R` after provision. |
| Default services | Runtime-provided services such as clock, random, console, config, and logging. | You can override them in tests. |
| Config | Typed configuration description. | You avoid direct `process.env` reads in business logic. |
| Redacted | Data type for sensitive values that should not print raw secrets. | You do not leak tokens in logs. |
| Scope | Lifetime boundary for resources and finalizers. | You know who owns resource cleanup. |
| Finalizer | Cleanup action registered for scoped resources. | You expect it to run on success, failure, and interruption. |
| `acquireRelease` | Acquires a resource and registers its release action. | You use it instead of scattered manual cleanup. |
| `scoped` | Runs a scoped resource or program within a managed scope. | You know when resource lifetime ends. |
| Interruption | Cooperative cancellation of running fibers. | You design finalizers to handle it. |
| Fiber | Lightweight concurrent Effect computation. | You can fork, join, interrupt, and supervise it. |
| Fork | Start an Effect on a new fiber. | You understand ownership of the child fiber. |
| Join | Wait for a fiber's result. | You know joined errors are part of the parent flow. |
| Race | Run effects concurrently and use the winner. | You know what happens to losers. |
| Structured concurrency | Concurrency where child lifetimes are managed by parent scopes. | You do not leak background work accidentally. |
| `Effect.all` | Combine many effects into one, sequentially or concurrently depending on options. | You can control ordering and concurrency. |
| `Effect.forEach` | Traverse a collection with an effectful function. | You use concurrency options deliberately. |
| Semaphore | Concurrency primitive for limiting permits. | You bound parallel work. |
| Deferred | A one-shot promise-like value integrated with Effect. | You coordinate fibers without unsafe external promises. |
| Queue | Concurrent queue for producer-consumer workflows. | You understand back pressure and shutdown. |
| PubSub | Publish-subscribe channel for broadcasting values. | You know the difference from a queue. |
| Latch | Coordination primitive for releasing waiting fibers. | You use it to stage concurrent tests or workflows. |
| Ref | Atomic mutable reference managed by Effect. | You replace external mutation with controlled updates. |
| SynchronizedRef | Ref supporting effectful atomic updates. | You use it when updates require effects. |
| SubscriptionRef | Ref with subscription semantics. | You use it when state changes need to be observed. |
| Cache | Managed lookup cache with policy and effectful loading. | You control duplicate work and expiration. |
| Batching | Combining multiple requests into fewer operations. | You reduce repeated backend calls. |
| Stream | Effectful producer of zero or more values. | You use it for sequences, files, events, and back pressure. |
| Sink | Effectful consumer of stream values. | You reuse stream processing logic. |
| Chunk | Efficient immutable collection used heavily by streams. | You avoid assuming all stream output is a plain array. |
| Back pressure | Downstream demand controls upstream production. | You prevent uncontrolled memory growth. |
| Resourceful stream | Stream that owns or uses scoped resources. | You ensure resources close on stream end or interruption. |
| Schema | Executable description of data shape, validation, and transformation. | You validate unknown input at boundaries. |
| Decode | Convert encoded or unknown data into typed domain data. | You handle parse errors explicitly. |
| Encode | Convert domain data back to encoded representation. | You know transformations may be bidirectional. |
| ParseError | Schema failure describing why data did not match. | You expose useful validation messages. |
| Filter | Schema refinement that adds constraints. | You validate more than primitive shape. |
| Transformation | Schema conversion from one representation to another. | You model Date/string or branded/domain conversions. |
| Class API | Schema pattern for defining domain classes with derived schema behavior. | You know when a class helps and when a struct is enough. |
| JSON Schema | Standard schema representation derived from Effect Schema. | You export contracts for other tools when needed. |
| Arbitrary | Generated sample data, often useful for property-style testing. | You test more than one hand-picked example. |
| Pretty printer | Human-readable rendering from Schema. | You produce consistent display output. |
| Platform | Effect package family for platform-independent IO. | You avoid hard-coding Node APIs in core logic. |
| Path | Platform service for path operations. | You do not assume one OS path style in core code. |
| FileSystem | Platform service for file operations. | You keep file IO testable. |
| Terminal | Platform service for terminal interaction. | You model CLI input/output as services. |
| Command | Platform service for running external commands. | You isolate process execution. |
| NodeContext | Node-specific layer bundle for platform services. | You provide it at Node app boundaries. |
| NodeRuntime | Node-specific runtime helper. | You use it in actual entrypoints, not domain modules. |
| Logger | Service for logging through Effect runtime. | You do not use random `console.log` in core logic. |
| Metric | Measured value such as counter, gauge, histogram, or summary. | You know what behavior should be observable. |
| Tracing | Recording spans that describe workflow timing and relationships. | You add spans around meaningful operations. |
| Supervisor | Runtime observer for fiber lifecycle. | You inspect or manage running fibers. |
| Branded type | Type refined with a compile-time brand. | You prevent mixing plain strings with domain-specific strings. |
| Equivalence | Type class for equality comparison. | You avoid ad hoc comparison logic. |
| Order | Type class for ordering values. | You sort domain data consistently. |
| Hash | Hashing support used by immutable collections. | You understand why equality and hashing travel together. |
| CLI boundary | Command-line entrypoint that parses args and runs an Effect. | You keep CLI parsing thin and domain logic testable. |
| HTTP boundary | API client or server edge where requests and responses are validated. | You use Schema and typed errors around network IO. |
| Repository | Service that encapsulates persistence operations. | You do not let database details leak into domain logic. |
| Live/test split | Keeping production layers separate from test layers. | You can run meaningful tests without real infrastructure. |
| Capstone | Final integrated project applying the full curriculum. | You combine services, schema, errors, concurrency, tests, and runtime. |

## Signature Reading Cheatsheet

```ts
Effect.Effect<A, E, R>
```

Read as:

- It may succeed with `A`.
- It may fail with expected error `E`.
- It needs services `R`.

Examples:

```ts
Effect.Effect<number, never, never>
```

An effect that succeeds with a number, has no modeled expected failure, and needs no services.

```ts
Effect.Effect<User, UserNotFound | DatabaseError, UserRepository>
```

An effect that may produce a `User`, may fail with `UserNotFound` or `DatabaseError`, and needs `UserRepository`.

```ts
Effect.Effect<void, ConfigError, FileSystem | Path>
```

An effect that produces no useful value, may fail with `ConfigError`, and needs file system plus path services.

## Common Translation Table

| Plain TypeScript habit | Effect habit |
| --- | --- |
| `throw new Error("bad input")` for expected input failure | `Effect.fail(new BadInput(...))` |
| `try/catch` around every async call | `Effect.tryPromise` once, then typed recovery |
| `Promise.all(items.map(...))` | `Effect.forEach(items, fn, { concurrency: "unbounded" })` or a bounded number |
| Passing `{ db, logger, config }` everywhere | Services and layers |
| `setTimeout` in tests | `TestClock` and schedules |
| `JSON.parse(data) as User` | `Schema.decodeUnknown(UserSchema)(data)` |
| `console.log` inside domain code | `Effect.log` or logger service |
| Manual open/close with scattered `finally` | Scoped acquisition and release |
| Global mutable cache | `Cache`, `Ref`, or a service layer |
