# Curriculum

This curriculum is designed to move from first principles to production-level Effect architecture. It is intentionally ordered. Later lessons assume vocabulary, code style, and habits from earlier lessons.

The machine-readable state lives in `docs/lesson-index.json`. This document explains what each lesson should teach and what future code should prove.

## Phase 1: Core Mental Model

### Lesson 01: Orientation And The Effect Value

Goal: understand that an `Effect` is a lazy value describing work, not the work itself.

Primary reading:

- https://effect.website/docs/getting-started/introduction/
- https://effect.website/docs/getting-started/why-effect/
- https://effect.website/docs/getting-started/the-effect-type/

Concepts:

- Effect as a description.
- Laziness.
- Success, failure, and requirements.
- Why promises alone do not model typed failure or dependencies.

Implementation when started:

- Create a tiny effect that does not run until explicitly executed.
- Add a test proving construction and execution are separate.
- Explain the difference between creating an `Effect` and running it.

Acceptance criteria:

- The lesson README explains laziness in plain language.
- The code has no hidden side effect during effect construction.
- Tests prove the side effect happens only at runtime.

### Lesson 02: Reading `Effect<A, E, R>`

Goal: become fluent in reading and explaining Effect's three type parameters.

Primary reading:

- https://effect.website/docs/getting-started/the-effect-type/
- https://effect.website/docs/getting-started/importing-effect/

Concepts:

- `A` success type.
- `E` expected error type.
- `R` required services.
- `never` as "no values possible".
- How requirements disappear when provided.

Implementation when started:

- Define several effects with intentionally different `A`, `E`, and `R`.
- Add type-level comments and tests that assert runtime behavior.

Acceptance criteria:

- Learner can explain `Effect<number, ParseError, Config>`.
- Tests distinguish success, expected failure, and required service examples.

### Lesson 03: Creating Effects

Goal: learn the core constructors for lifting work into Effect.

Primary reading:

- https://effect.website/docs/getting-started/creating-effects/

Concepts:

- `Effect.succeed`.
- `Effect.fail`.
- `Effect.sync`.
- `Effect.promise`.
- `Effect.try`.
- `Effect.tryPromise`.
- Choosing the right constructor.

Implementation when started:

- Create pure, sync, promise, failure, and try-based examples.
- Demonstrate the difference between expected failure and thrown defects.

Acceptance criteria:

- Each constructor is used for the right kind of work.
- Tests cover success and failure paths.

### Lesson 04: Running Effects And Runtime Boundaries

Goal: understand where effects are run and why reusable code should return effects.

Primary reading:

- https://effect.website/docs/getting-started/running-effects/
- https://effect.website/docs/runtime/

Concepts:

- `Effect.runSync`.
- `Effect.runPromise`.
- `Effect.runSyncExit`.
- `Effect.runPromiseExit`.
- Runtime boundary.
- Application edge versus business logic.

Implementation when started:

- Create runnable effects and inspect both value and `Exit`.
- Keep reusable functions effect-returning.

Acceptance criteria:

- Runtime calls appear only in test or lesson boundary code.
- Tests compare direct result and `Exit` result.

### Lesson 05: Pipelines, Mapping, Flat Mapping, And Generators

Goal: compose effectful programs in both pipeline and generator style.

Primary reading:

- https://effect.website/docs/getting-started/building-pipelines/
- https://effect.website/docs/getting-started/using-generators/

Concepts:

- `pipe`.
- `Effect.map`.
- `Effect.flatMap`.
- `Effect.tap`.
- `Effect.gen`.
- `yield*`.
- Data-first and data-last APIs.

Implementation when started:

- Build the same workflow with `pipe` and `Effect.gen`.
- Compare readability and type inference.

Acceptance criteria:

- Tests prove both workflows are equivalent.
- README explains when to use each style.

### Lesson 06: Control Flow Operators

Goal: express branching, filtering, and conditional behavior without escaping Effect.

Primary reading:

- https://effect.website/docs/getting-started/control-flow-operators/

Concepts:

- Conditional composition.
- Filtering.
- Short-circuiting.
- Keeping control flow typed.

Implementation when started:

- Model a small decision workflow with success and expected rejection.
- Avoid throwing for business conditions.

Acceptance criteria:

- Expected rejections are typed.
- Tests cover all branches.

## Phase 2: Error Mastery

### Lesson 07: Expected Errors As Data

Goal: model business failures as typed values.

Primary reading:

- https://effect.website/docs/error-management/two-types-of-errors/
- https://effect.website/docs/error-management/expected-errors/
- https://effect.website/docs/data-types/data/

Concepts:

- Expected errors.
- `Data.TaggedError`.
- Discriminated error unions.
- Error channel widening.
- Domain error naming.

Implementation when started:

- Build a small parser or validation workflow with multiple domain errors.
- Use tags to recover specific failures.

Acceptance criteria:

- No expected domain error is thrown.
- Tests assert exact error tags.

### Lesson 08: Defects, Cause, And Exit

Goal: distinguish typed failures from unexpected defects and understand failure diagnostics.

Primary reading:

- https://effect.website/docs/error-management/unexpected-errors/
- https://effect.website/docs/error-management/sandboxing/
- https://effect.website/docs/data-types/cause/
- https://effect.website/docs/data-types/exit/

Concepts:

- Defect.
- `Effect.die`.
- `Cause`.
- `Exit`.
- Sandboxing and unsandboxing.
- Fatal versus recoverable thinking.

Implementation when started:

- Create examples that fail, die, and succeed.
- Inspect exits and causes in tests.

Acceptance criteria:

- README explains when not to catch defects.
- Tests distinguish `Failure` and `Die` causes.

### Lesson 09: Matching, Fallbacks, And Recovery

Goal: recover from expected errors precisely.

Primary reading:

- https://effect.website/docs/error-management/fallback/
- https://effect.website/docs/error-management/matching/
- https://effect.website/docs/error-management/error-channel-operations/

Concepts:

- `Effect.catchTag`.
- `Effect.catchTags`.
- `Effect.match`.
- `Effect.matchEffect`.
- `Effect.orElse`.
- Error mapping.
- Narrow recovery.

Implementation when started:

- Recover from one error while preserving another.
- Convert errors into user-facing messages at the boundary.

Acceptance criteria:

- Tests prove unrecovered errors remain typed failures.
- Recovery does not swallow defects.

### Lesson 10: Retry, Timeout, And Schedule Basics

Goal: apply time-aware recovery policies.

Primary reading:

- https://effect.website/docs/error-management/retrying/
- https://effect.website/docs/error-management/timing-out/
- https://effect.website/docs/scheduling/introduction/
- https://effect.website/docs/scheduling/built-in-schedules/

Concepts:

- `Effect.retry`.
- `Effect.timeout`.
- `Schedule`.
- Exponential backoff.
- Recurrence limits.
- Time as a testable service.

Implementation when started:

- Build a flaky operation with a retry schedule.
- Add timeout behavior.

Acceptance criteria:

- Tests do not rely on real sleep.
- README explains policy versus operation.

### Lesson 11: Error Accumulation And Validation

Goal: collect multiple expected failures when fail-fast is not desired.

Primary reading:

- https://effect.website/docs/error-management/error-accumulation/
- https://effect.website/docs/error-management/parallel-and-sequential-errors/

Concepts:

- Validation.
- Error accumulation.
- Parallel versus sequential error behavior.
- User input reporting.

Implementation when started:

- Validate an object with multiple fields.
- Return all field errors instead of only the first.

Acceptance criteria:

- Tests include multiple simultaneous validation errors.
- README states when accumulation is better than fail-fast.

## Phase 3: Services, Layers, And Resources

### Lesson 12: Services With Context Tags

Goal: declare dependencies in `R` instead of passing objects manually.

Primary reading:

- https://effect.website/docs/requirements-management/services/

Concepts:

- Service interface.
- `Context.Tag`.
- Accessing services.
- Requirement propagation.
- Providing a concrete service.

Implementation when started:

- Define a simple service such as `UserRepository` or `RandomId`.
- Write a program that depends on it.
- Provide a test implementation.

Acceptance criteria:

- The program's type exposes its service requirement before provisioning.
- Tests provide a fake service layer or service value.

### Lesson 13: Layers And Dependency Graphs

Goal: construct services with dependencies using layers.

Primary reading:

- https://effect.website/docs/requirements-management/layers/

Concepts:

- `Layer`.
- Live layer.
- Test layer.
- Layer composition.
- Dependency graph.
- `Effect.provide`.

Implementation when started:

- Build one service that depends on another.
- Compose layers to satisfy the final program.

Acceptance criteria:

- README draws the dependency graph.
- Tests prove live and test layers can be swapped.

### Lesson 14: Layer Memoization And Default Services

Goal: understand how layers are reused and how default services fit into runtime behavior.

Primary reading:

- https://effect.website/docs/requirements-management/layer-memoization/
- https://effect.website/docs/requirements-management/default-services/

Concepts:

- Layer memoization.
- Shared construction.
- Clock, Console, Random, Config, Logger as default services.
- Overriding default services.

Implementation when started:

- Create a layer with visible construction count.
- Prove memoization behavior.
- Override a default service where appropriate.

Acceptance criteria:

- Tests prove shared construction happens once where expected.
- README explains default versus custom services.

### Lesson 15: Resource Safety And Scope

Goal: acquire and release resources safely under success, failure, and interruption.

Primary reading:

- https://effect.website/docs/resource-management/introduction/
- https://effect.website/docs/resource-management/scope/

Concepts:

- `Effect.acquireRelease`.
- `Effect.scoped`.
- `Scope`.
- Finalizers.
- Interruption safety.
- Resource ownership.

Implementation when started:

- Model a resource with acquisition and release counters.
- Test release on success and failure.

Acceptance criteria:

- No manual `finally` is needed in business logic.
- Tests prove finalizers run.

### Lesson 16: Configuration

Goal: load configuration in typed, testable, environment-aware ways.

Primary reading:

- https://effect.website/docs/configuration/

Concepts:

- `Config`.
- Config providers.
- Secret/redacted values.
- Config validation.
- Test config.

Implementation when started:

- Define required and optional configuration.
- Provide test config without touching real environment variables.

Acceptance criteria:

- Missing config is a typed/configured failure.
- Tests avoid depending on the developer machine's environment.

## Phase 4: State, Caching, Scheduling, And Coordination

### Lesson 17: Ref And SynchronizedRef

Goal: manage mutable state safely inside Effect.

Primary reading:

- https://effect.website/docs/state-management/ref/
- https://effect.website/docs/state-management/synchronizedref/

Concepts:

- `Ref`.
- Atomic update.
- `SynchronizedRef`.
- Effectful updates.
- Avoiding external mutable variables.

Implementation when started:

- Build a small counter or in-memory store.
- Test concurrent updates.

Acceptance criteria:

- State mutation is encapsulated in Effect primitives.
- Tests prove deterministic final state.

### Lesson 18: Cache And Batching

Goal: avoid duplicate work and batch requests.

Primary reading:

- https://effect.website/docs/caching/caching-effects/
- https://effect.website/docs/caching/cache/
- https://effect.website/docs/batching/

Concepts:

- `Effect.cached`.
- `Cache`.
- Lookup function.
- Time-to-live.
- Request batching.
- Deduplication.

Implementation when started:

- Cache a simulated expensive lookup.
- Batch or deduplicate repeated requests.

Acceptance criteria:

- Tests prove the underlying operation is called fewer times than requested.
- README explains cache lifetime and invalidation tradeoffs.

### Lesson 19: Fibers And Interruption

Goal: understand Effect's lightweight concurrency model.

Primary reading:

- https://effect.website/docs/concurrency/basic-concurrency/
- https://effect.website/docs/concurrency/fibers/

Concepts:

- Fiber.
- Fork.
- Join.
- Interrupt.
- Race.
- Structured concurrency.
- Fiber status.

Implementation when started:

- Fork a child computation.
- Join it and interrupt another.

Acceptance criteria:

- Tests prove interruption changes behavior.
- README explains why fibers are not raw promises.

### Lesson 20: Parallelism And Concurrency Controls

Goal: run many effects safely with bounded concurrency.

Primary reading:

- https://effect.website/docs/concurrency/basic-concurrency/
- https://effect.website/docs/concurrency/semaphore/

Concepts:

- Sequential versus parallel traversal.
- `Effect.all`.
- `Effect.forEach`.
- Concurrency limits.
- `Semaphore`.
- Failure behavior in parallel work.

Implementation when started:

- Process a list with a concurrency limit.
- Track maximum in-flight work.

Acceptance criteria:

- Tests prove the limit is respected.
- README explains fail-fast behavior in parallel composition.

### Lesson 21: Deferred, Queue, PubSub, Semaphore, And Latch

Goal: coordinate fibers with dedicated primitives.

Primary reading:

- https://effect.website/docs/concurrency/deferred/
- https://effect.website/docs/concurrency/queue/
- https://effect.website/docs/concurrency/pubsub/
- https://effect.website/docs/concurrency/semaphore/
- https://effect.website/docs/concurrency/latch/

Concepts:

- `Deferred`.
- `Queue`.
- `PubSub`.
- `Semaphore`.
- `Latch`.
- Back pressure.
- Producer-consumer workflows.

Implementation when started:

- Build a producer-consumer pipeline with a queue.
- Use one coordination primitive beyond queue.

Acceptance criteria:

- Tests prove ordering or coordination behavior.
- README states which primitive solves which problem.

## Phase 5: Streams And Sinks

### Lesson 22: Stream Creation And Consumption

Goal: learn streams as zero-or-more effectful values.

Primary reading:

- https://effect.website/docs/stream/introduction/
- https://effect.website/docs/stream/creating/
- https://effect.website/docs/stream/consuming/

Concepts:

- `Stream`.
- Element type, error type, requirements.
- Creating streams.
- Collecting and running streams.
- Chunked output.

Implementation when started:

- Create finite streams from values and effects.
- Consume them into collections or summaries.

Acceptance criteria:

- Tests prove emitted values and stream completion.
- README compares `Effect<A>` and `Stream<A>`.

### Lesson 23: Stream Errors, Resources, And Back Pressure

Goal: make streams robust under failure and resource ownership.

Primary reading:

- https://effect.website/docs/stream/error-handling/
- https://effect.website/docs/stream/resourceful-streams/
- https://effect.website/docs/stream/operations/

Concepts:

- Stream error handling.
- Resourceful streams.
- Back pressure.
- Transformations.
- Repetition.
- Interruption and finalization.

Implementation when started:

- Build a stream that reads from a scoped resource.
- Recover from one stream error and preserve another.

Acceptance criteria:

- Tests prove finalizer behavior.
- README explains pull-based stream thinking.

### Lesson 24: Sinks And Stream Consumers

Goal: process streams with reusable consumers.

Primary reading:

- https://effect.website/docs/sink/introduction/
- https://effect.website/docs/sink/creating/
- https://effect.website/docs/sink/operations/
- https://effect.website/docs/sink/concurrency/
- https://effect.website/docs/sink/leftovers/

Concepts:

- `Sink`.
- Folding.
- Leftovers.
- Sink composition.
- Concurrent sinks.

Implementation when started:

- Build a sink that summarizes a stream.
- Demonstrate leftovers or early termination.

Acceptance criteria:

- Tests prove sink result and leftover behavior where used.
- README explains when a sink is better than manual collection.

## Phase 6: Data Types And Schema

### Lesson 25: Core Data Types

Goal: use Effect's standard data types intentionally.

Primary reading:

- https://effect.website/docs/data-types/option/
- https://effect.website/docs/data-types/either/
- https://effect.website/docs/data-types/chunk/
- https://effect.website/docs/data-types/data/
- https://effect.website/docs/data-types/duration/
- https://effect.website/docs/data-types/datetime/
- https://effect.website/docs/data-types/redacted/

Concepts:

- `Option`.
- `Either`.
- `Chunk`.
- `Data`.
- `Duration`.
- `DateTime`.
- `Redacted`.
- Equality and immutability expectations.

Implementation when started:

- Refactor nullable, union, and array-like code into appropriate Effect data types.

Acceptance criteria:

- Tests prove no unsafe null access.
- README states when not to overuse each data type.

### Lesson 26: Schema Basics

Goal: validate and transform unknown input safely.

Primary reading:

- https://effect.website/docs/schema/introduction/
- https://effect.website/docs/schema/getting-started/
- https://effect.website/docs/schema/basic-usage/
- https://effect.website/docs/schema/filters/

Concepts:

- `Schema`.
- Decode.
- Encode.
- Parse errors.
- Filters.
- Structs, arrays, unions.
- External boundary validation.

Implementation when started:

- Parse unknown JSON into a typed domain model.
- Report parse failures.

Acceptance criteria:

- No `as SomeType` assertion at input boundary.
- Tests cover valid and invalid inputs.

### Lesson 27: Advanced Schema

Goal: use Schema for domain modeling beyond simple validation.

Primary reading:

- https://effect.website/docs/schema/advanced-usage/
- https://effect.website/docs/schema/transformations/
- https://effect.website/docs/schema/class-apis/
- https://effect.website/docs/schema/default-constructors/
- https://effect.website/docs/schema/json-schema/
- https://effect.website/docs/schema/arbitrary/
- https://effect.website/docs/schema/pretty-printer/

Concepts:

- Transformations.
- Class APIs.
- Defaults.
- JSON Schema generation.
- Arbitrary generation.
- Pretty printing.
- Effect data type integration.

Implementation when started:

- Define a richer domain schema with transformation and default behavior.
- Generate or inspect derived artifacts where useful.

Acceptance criteria:

- Tests cover decode, encode, default, and transformation behavior.
- README explains schema as executable boundary documentation.

## Phase 7: Testing, Runtime, Observability, And Platform

### Lesson 28: Testing Effects, Layers, And Time

Goal: write deterministic tests for Effect programs.

Primary reading:

- https://effect.website/docs/testing/testclock/
- https://github.com/Effect-TS/effect/tree/main/packages/vitest

Concepts:

- Effect-aware tests.
- Test services.
- `TestClock`.
- Test layers.
- Asserting failures.
- Avoiding real time.

Implementation when started:

- Test success, failure, service override, and schedule/time behavior.

Acceptance criteria:

- Tests are deterministic.
- README explains why real sleep is avoided.

### Lesson 29: Runtime And Application Boundaries

Goal: wire effects into an application entrypoint without leaking runtime concerns into business logic.

Primary reading:

- https://effect.website/docs/runtime/
- https://effect.website/docs/platform/runtime/

Concepts:

- Runtime.
- Runtime flags and services.
- Boundary execution.
- `NodeRuntime`.
- Dependency provisioning at the edge.

Implementation when started:

- Create a small boundary module that runs a provided program.
- Keep domain functions runtime-free.

Acceptance criteria:

- Runtime calls are centralized.
- Tests still call reusable effects without starting a full app.

### Lesson 30: Logging, Metrics, Tracing, And Supervisor

Goal: add observability through Effect-native APIs.

Primary reading:

- https://effect.website/docs/observability/logging/
- https://effect.website/docs/observability/metrics/
- https://effect.website/docs/observability/tracing/
- https://effect.website/docs/observability/supervisor/

Concepts:

- Structured logging.
- Log levels and spans.
- Metrics.
- Tracing.
- Supervisor.
- Observability as a layer concern.

Implementation when started:

- Add logs and a metric to a small workflow.
- Supervise or inspect fiber behavior where appropriate.

Acceptance criteria:

- Tests avoid asserting fragile log text unless a lesson-specific logger captures it.
- README explains what belongs in logs, metrics, and traces.

### Lesson 31: Platform Services

Goal: use platform-independent services and provide Node implementations.

Primary reading:

- https://effect.website/docs/platform/introduction/
- https://effect.website/docs/platform/path/
- https://effect.website/docs/platform/filesystem/
- https://effect.website/docs/platform/terminal/
- https://effect.website/docs/platform/command/
- https://effect.website/docs/platform/runtime/

Concepts:

- `@effect/platform`.
- `@effect/platform-node`.
- `Path`.
- `FileSystem`.
- `Terminal`.
- `Command`.
- `NodeContext`.
- `NodeRuntime`.

Implementation when started:

- Build a small file-oriented workflow through platform services.
- Provide Node layers only at the boundary or test setup.

Acceptance criteria:

- Business logic depends on abstract platform services, not Node's `fs` directly.
- Tests use temporary paths or fake services.

### Lesson 32: CLI Workflow

Goal: build a small command-line workflow using Effect patterns.

Primary reading:

- https://effect.website/docs/platform/terminal/
- https://effect.website/docs/platform/command/
- https://github.com/Effect-TS/effect/tree/main/packages/cli

Concepts:

- Terminal interaction.
- Command execution.
- CLI boundaries.
- Exit codes.
- User input validation.

Implementation when started:

- Add `@effect/cli` only if the lesson chooses the full CLI package path.
- Build a command that validates input, performs an effectful action, and reports typed errors.

Acceptance criteria:

- CLI code is thin and delegates to testable effects.
- Tests cover parsing and domain behavior.

### Lesson 33: HTTP And External APIs

Goal: integrate external services without losing typed errors and testability.

Primary reading:

- https://effect.website/docs/platform/introduction/
- `@effect/platform` package README for current HTTP module stability.

Concepts:

- HTTP client as service.
- Request and response schemas.
- Boundary validation.
- Retry and timeout policy.
- Test HTTP service.

Implementation when started:

- Use either the current stable platform APIs or a lesson-local service interface if HTTP APIs remain unstable.
- Validate responses with Schema.

Acceptance criteria:

- External failures are modeled.
- Tests avoid live network calls.

### Lesson 34: Persistence And SQL Concepts

Goal: understand how Effect-style dependency, error, and resource patterns apply to persistence.

Primary reading:

- https://github.com/Effect-TS/effect/tree/main/packages/sql
- Relevant package README for the selected SQL driver.

Concepts:

- Database service.
- Connection/resource layer.
- Query errors.
- Transactions.
- Test database or fake repository.

Implementation when started:

- Add `@effect/sql` and one driver only when needed.
- Build a repository interface before choosing a live backend.

Acceptance criteria:

- Domain code does not depend on a concrete SQL driver directly.
- Tests use fake layer or isolated test database.

### Lesson 35: Architecture And Migration From Promise Code

Goal: convert realistic promise-based TypeScript into Effect architecture.

Primary reading:

- https://effect.website/docs/additional-resources/effect-vs-promise/
- https://effect.website/docs/additional-resources/effect-vs-neverthrow/
- https://effect.website/docs/additional-resources/effect-vs-fp-ts/
- https://effect.website/docs/code-style/guidelines/

Concepts:

- Boundary-first migration.
- Wrapping legacy promises.
- Modeling errors incrementally.
- Service extraction.
- Avoiding all-at-once rewrites.

Implementation when started:

- Start from an intentionally promise-heavy module.
- Refactor it to typed effects, services, schemas, and tests.

Acceptance criteria:

- README documents migration steps and tradeoffs.
- Tests prove behavior stayed the same while types improved.

### Lesson 36: Capstone Production Workflow

Goal: build a small production-shaped Effect application using the full curriculum.

Primary reading:

- Revisit all relevant docs from prior lessons.
- Check package READMEs for any optional package selected.

Concepts:

- End-to-end composition.
- Runtime boundary.
- Config.
- Schema.
- Services and layers.
- Resource safety.
- Concurrency or streams.
- Observability.
- Tests.

Implementation when started:

- Build a small CLI or service workflow with real input, typed output, at least one dependency, and meaningful tests.

Acceptance criteria:

- `npm run check` passes.
- The app has live and test layers.
- The app validates external input.
- The app handles expected errors.
- The app has at least one concurrent, scheduled, or streaming component.
- The README explains architecture and how to run it.

## Progression Rules

- Complete lessons in order unless the user explicitly asks otherwise.
- Do not add future lesson code early.
- Every lesson after Lesson 03 should include at least one expected failure path.
- Every service lesson should include a test layer.
- Every time-based lesson should avoid real waits in tests.
- Every external-boundary lesson should use Schema or justify why not.

## Recommended Study Rhythm

For each lesson:

1. Read the official docs.
2. Predict the key type signatures before coding.
3. Implement the smallest meaningful example.
4. Write tests before expanding the example.
5. Explain what moved through `A`, `E`, and `R`.
6. Record one pitfall in `notes.md`.

The goal is not to memorize the full API. The goal is to build judgment about when a module solves a real problem.
