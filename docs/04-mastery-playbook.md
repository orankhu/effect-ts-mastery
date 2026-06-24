# Mastery Playbook

This playbook defines the standards used throughout the curriculum.

## Mastery Definition

Mastery means being able to:

- Read `Effect<A, E, R>` signatures and predict runtime behavior.
- Convert promise-heavy TypeScript into typed, composable Effect programs.
- Model expected errors separately from defects.
- Build dependency-injected services with `Context.Tag` and `Layer`.
- Manage resource lifecycles safely under success, failure, and interruption.
- Use fibers, schedules, queues, streams, and sinks to build concurrent workflows.
- Validate and transform external data with `Schema`.
- Test effects deterministically, including time, randomness, services, and failures.
- Wire production boundaries with platform services, runtime configuration, logging, metrics, and tracing.
- Know when Effect is worth using and when plain TypeScript is enough.

## Core Mental Models

### Effect Is A Value

An `Effect` is a value that describes work. Creating it does not run the work. Running belongs at the edge of the application.

### The Type Signature Is A Contract

`Effect<A, E, R>` means:

- `A`: the success value.
- `E`: the expected error channel.
- `R`: required services or environment.

If `E` is `never`, the workflow has no modeled expected errors. If `R` is `never`, it requires no services.

### Errors Are Data

Expected failures should be named, typed values. Defects should represent bugs or truly unexpected failures.

### Requirements Are Dependencies

When a program needs a database, logger, clock, configuration, or file system, the requirement should appear in `R` until a layer provides it.

### Layers Are Constructors

Services define what code needs. Layers define how those services are built. Providing a layer removes requirements from the final program.

### Scope Owns Lifetimes

Resources that must be closed should be acquired in a scope and released by Effect, not by hand-written `finally` blocks scattered through business logic.

### Fibers Are Managed Concurrency

Fibers are lightweight Effect computations. They can be forked, joined, interrupted, raced, supervised, and composed with typed failure semantics.

## Coding Standards

- Use strict TypeScript. Do not loosen compiler settings to make a lesson pass.
- Prefer small named functions over deeply nested pipelines.
- Use `pipe` when it improves readability; do not force every line into `pipe`.
- Use `Effect.gen` for imperative-looking control flow with typed errors and requirements.
- Use `Effect.all`, `Effect.forEach`, and concurrency options for structured parallelism.
- Use `Effect.scoped`, `Scope`, or `Effect.acquireRelease` for resources.
- Use `Layer` for service construction and test doubles.
- Use `Schema` at all external boundaries: JSON, config, HTTP payloads, files, and environment variables.
- Keep runtime calls at boundaries: CLI entrypoints, HTTP handlers, scripts, or tests.
- Avoid global mutable state unless the lesson is explicitly about replacing it with `Ref` or services.

## Testing Standards

Every implementation lesson should include at least one test.

Test categories:

- Pure transformations: direct assertions.
- Effects that succeed: `Effect.runPromise` in the test or Effect-aware test helpers.
- Effects that fail: assert typed failure, not thrown exceptions.
- Services: provide test layers.
- Time: use `TestClock`.
- Concurrency: assert final outcomes, interruption, or ordering guarantees without relying on real sleeps.
- Schema: assert both successful decode and representative parse failures.

## Review Checklist

Before completing a lesson:

- Does the code compile under strict TypeScript?
- Does the test prove the lesson's main concept?
- Are expected errors in the error channel instead of hidden exceptions?
- Are defects treated intentionally?
- Are dependencies explicit in `R` until provided?
- Is runtime execution at the boundary?
- Are resources scoped?
- Are names concrete and domain-focused?
- Is the lesson README clear enough to revisit later?

## Common Anti-Patterns

| Anti-pattern | Better approach |
| --- | --- |
| Wrapping every tiny expression in `Effect.succeed` | Keep pure code pure; lift only at boundaries or when composition benefits. |
| Throwing for expected domain failure | Use typed errors with `Effect.fail`. |
| Catching `unknown` everywhere | Model known errors and let defects remain defects. |
| Passing a giant dependency object manually | Define services and provide layers. |
| Running effects deep inside helper functions | Return effects and run once at the boundary. |
| Real sleeps in tests | Use schedules and `TestClock`. |
| Manually opening and closing resources | Use scoped acquisition and release. |
| Parsing external JSON with type assertions | Use `Schema.decodeUnknown` or related Schema APIs. |
| Overusing advanced modules too early | Learn the core `Effect`, error, service, and layer model first. |

## Capstone Path

The final mastery capstone should be a small production-shaped application:

- CLI or HTTP entrypoint.
- Config loaded through Effect.
- Typed input validation with Schema.
- File system or API integration through platform services.
- Service interfaces and live/test layers.
- Concurrent workflow using fibers, queues, streams, or schedules.
- Typed error model and defect reporting.
- Tests for success, failure, config, time, and service substitution.
- Logging plus at least one metric or trace span.

Do not start the capstone until the core, errors, services, layers, resource, concurrency, testing, schema, and platform phases are complete.
