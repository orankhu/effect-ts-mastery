# Resource Map

Verified on 2026-06-24 from official Effect documentation, the Effect GitHub repository, and npm package metadata.

## Primary Sources

Use these first whenever a lesson needs current syntax or semantics.

| Resource | URL | Use |
| --- | --- | --- |
| Effect home | https://effect.website/ | High-level positioning and ecosystem links. |
| Documentation introduction | https://effect.website/docs/getting-started/introduction/ | Navigation, official learning order, feature overview, community links. |
| Installation | https://effect.website/docs/getting-started/installation/ | Supported runtimes and TypeScript requirement. The docs require TypeScript 5.4 or newer. |
| Effect type | https://effect.website/docs/getting-started/the-effect-type/ | The `Effect<Success, Error, Requirements>` mental model. |
| Creating effects | https://effect.website/docs/getting-started/creating-effects/ | Constructors for sync, async, success, failure, and promise workflows. |
| Running effects | https://effect.website/docs/getting-started/running-effects/ | `runSync`, `runPromise`, exits, and runtime boundaries. |
| Generators | https://effect.website/docs/getting-started/using-generators/ | `Effect.gen`, `yield*`, and sequential composition style. |
| Pipelines | https://effect.website/docs/getting-started/building-pipelines/ | `pipe`, data-first/data-last APIs, and readable composition. |
| Error management | https://effect.website/docs/error-management/two-types-of-errors/ | Expected errors, defects, fallbacks, matching, retry, timeout, sandboxing, and accumulation. |
| Requirements and services | https://effect.website/docs/requirements-management/services/ | `Context`, `Tag`, services, and how requirements flow through types. |
| Layers | https://effect.website/docs/requirements-management/layers/ | Dependency construction, layer composition, provisioning, memoization, and application wiring. |
| Resource management | https://effect.website/docs/resource-management/introduction/ | Safe acquisition and release, including failure and interruption behavior. |
| Scope | https://effect.website/docs/resource-management/scope/ | Lifetime management and scoped resources. |
| Runtime | https://effect.website/docs/runtime/ | Runtime construction, service provisioning, and execution boundaries. |
| Scheduling | https://effect.website/docs/scheduling/introduction/ | Repetition, retry schedules, combinators, cron, and schedule-driven workflows. |
| State management | https://effect.website/docs/state-management/ref/ | `Ref`, `SynchronizedRef`, and `SubscriptionRef`. |
| Concurrency | https://effect.website/docs/concurrency/basic-concurrency/ | Parallel execution, fibers, coordination primitives, queues, PubSub, semaphores, and latches. |
| Streams | https://effect.website/docs/stream/introduction/ | Pull-based streaming, resourceful streams, operations, and error handling. |
| Sinks | https://effect.website/docs/sink/introduction/ | Consumers for streams, leftovers, concurrency, and sink composition. |
| Testing | https://effect.website/docs/testing/testclock/ | Time-controlled tests and deterministic scheduling. |
| Code style | https://effect.website/docs/code-style/guidelines/ | Effect idioms, dual APIs, branded types, pattern matching, and avoiding excessive nesting. |
| Data types | https://effect.website/docs/data-types/data/ | `Data`, `Option`, `Either`, `Cause`, `Exit`, `Chunk`, `Duration`, `DateTime`, `Redacted`, and related modules. |
| Schema | https://effect.website/docs/schema/introduction/ | Data validation, parsing, transformations, JSON Schema, arbitrary generation, and pretty printing. |
| Platform | https://effect.website/docs/platform/introduction/ | Cross-platform abstractions and stable `@effect/platform` modules. |
| API reference | https://effect-ts.github.io/effect/ | Function-level reference when docs are not enough. |
| GitHub repository | https://github.com/Effect-TS/effect | Source, package list, examples, issues, and release context. |

## Package Snapshot

The workspace was initialized with exact versions from npm:

| Package | Version | Role |
| --- | --- | --- |
| `effect` | `3.21.4` | Core runtime, Effect data type, concurrency, Schema, Stream, Schedule, data types, services, layers. |
| `@effect/platform` | `0.96.2` | Platform-independent services and abstractions. |
| `@effect/platform-node` | `0.107.0` | Node.js layers for platform services. |
| `@effect/vitest` | `0.29.0` | Effect-aware Vitest helpers for later test lessons. |
| `typescript` | `6.0.3` | Strict TypeScript compiler. |
| `tsx` | `4.22.4` | TypeScript execution during lessons. |
| `vitest` | `3.2.6` | Test runner compatible with `@effect/vitest@0.29.0`. |
| `vite` | `6.4.3` | Direct dev dependency used by Vitest; pinned to avoid the affected newer transitive `esbuild` range. |
| `@types/node` | `26.0.0` | Node.js typings. |

Command used:

```sh
npm view effect version
npm view @effect/platform version
npm view @effect/platform-node version
npm view @effect/vitest version
npm view typescript version
npm view tsx version
npm view vitest version
npm view vitest@3 version --json
npm view vite@6 version --json
npm view @types/node version
```

Latest `vitest` was `4.1.9` at setup time, but `@effect/vitest@0.29.0` peers on `vitest@^3.2.0`, so the scaffold uses `vitest@3.2.6`. Vitest 3 supports Vite 5, 6, or 7; this scaffold pins `vite@6.4.3` to avoid a low-severity transitive `esbuild` advisory observed with `vite@7.3.5`.

## Optional Packages For Later

Do not install these until the matching lesson needs them.

| Package | Verified Version | Suggested Lesson |
| --- | --- | --- |
| `@effect/cli` | `0.75.2` | CLI application capstone. |
| `@effect/opentelemetry` | `0.63.0` | Observability and tracing capstone. |
| `@effect/sql` | `0.51.1` | Persistence capstone. |

## Reading Policy

1. Prefer official Effect docs for conceptual learning.
2. Use API reference when exact function overloads, type parameters, or options matter.
3. Use the GitHub repository to inspect package READMEs, examples, and source-level behavior.
4. Use community articles and videos only as secondary learning aids, not as authoritative syntax.
5. Before implementing a future lesson, re-check docs or installed package typings if an API might have changed.

## Source-to-Lesson Map

| Topic | Start With | Follow With |
| --- | --- | --- |
| Core mental model | Effect type | Creating effects, running effects, generators, pipelines |
| Error handling | Two types of errors | Expected errors, defects, matching, retry, timeout, sandboxing, accumulation |
| Dependency injection | Managing services | Default services, layers, layer memoization |
| Resource safety | Resource management introduction | Scope |
| Runtime boundaries | Runtime | Platform runtime |
| Scheduling | Scheduling introduction | Repetition, built-in schedules, combinators, cron, examples |
| State | Ref | SynchronizedRef, SubscriptionRef |
| Caching and batching | Caching effects | Cache, batching |
| Concurrency | Basic concurrency | Fibers, Deferred, Queue, PubSub, Semaphore, Latch |
| Streams | Stream introduction | Creating, consuming, error handling, operations, resourceful streams |
| Sinks | Sink introduction | Creating, operations, concurrency, leftovers |
| Testing | TestClock | `@effect/vitest`, service overrides, layer tests |
| Schema | Schema introduction | Basic usage, filters, transformations, class APIs, JSON Schema, arbitrary |
| Platform | Platform introduction | FileSystem, Path, Terminal, Command, Runtime, KeyValueStore |

## External Learning Aids

Use these when a learner wants a second explanation after reading the official docs.

- Official YouTube channel: https://www.youtube.com/@effect-ts
- Effect Discord: linked from https://effect.website/docs/getting-started/introduction/
- Effect blog: https://effect.website/blog/
- Official playground: https://effect.website/play

Keep lesson implementation decisions anchored in the installed packages and official documentation.
