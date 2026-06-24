# Effect TS Mastery

This folder is a documentation-first learning workspace for mastering Effect in TypeScript.

Current state: boilerplate is ready, resources are mapped, and the lesson sequence is documented. No lesson implementation code has been added yet. The only TypeScript file in `src/` is a neutral placeholder so `tsc` has an input before Lesson 01 starts.

## Quick Start

```sh
cd effect-ts-mastery
npm install
npm run check
```

## What Is Installed

- `effect`: core Effect runtime, data types, Schema, Stream, Schedule, services, layers, and concurrency primitives.
- `@effect/platform`: platform-independent services such as `FileSystem`, `Path`, `Terminal`, `Command`, and platform runtime helpers.
- `@effect/platform-node`: Node.js layer implementations for platform services.
- `@effect/vitest`, `vitest`, `typescript`, `tsx`: test and execution tooling for future lessons.

Version snapshot verified on 2026-06-24:

| Package | Version |
| --- | --- |
| `effect` | `3.21.4` |
| `@effect/platform` | `0.96.2` |
| `@effect/platform-node` | `0.107.0` |
| `@effect/vitest` | `0.29.0` |
| `typescript` | `6.0.3` |
| `tsx` | `4.22.4` |
| `vitest` | `3.2.6` |
| `vite` | `6.4.3` |

Note: latest `vitest` from npm was `4.1.9` at setup time, but `@effect/vitest@0.29.0` declares a peer dependency on `vitest@^3.2.0`, so this project pins the newest compatible 3.x release. `vite@6.4.3` is pinned directly to stay inside Vitest 3's supported Vite range while avoiding a low-severity advisory in a newer Vite transitive `esbuild`.

## Project Layout

```text
effect-ts-mastery/
  docs/
    00-resource-map.md
    01-curriculum.md
    02-next-lesson-protocol.md
    03-glossary.md
    04-mastery-playbook.md
    lesson-index.json
  lessons/
    README.md
    01-effect-value/
      README.md
      notes.md
      src/
      test/
  resources/
    README.md
  src/
    boilerplate.ts
  tests/
    .gitkeep
  package.json
  tsconfig.json
  vitest.config.ts
```

## How Future Lessons Should Work

When you say "next lesson", use this rule:

1. Open `docs/lesson-index.json`.
2. Pick the first lesson whose `status` is `pending`.
3. Read the matching section in `docs/01-curriculum.md`.
4. Create only the files named by that lesson's `implementationPlan`.
5. Add code, tests, and notes for that lesson only.
6. Run `npm run check`.
7. Mark the lesson as `completed` in `docs/lesson-index.json` only after the acceptance criteria pass.

Do not skip ahead unless the user explicitly asks.

## Documentation Entry Points

- [Resource Map](docs/00-resource-map.md): official docs, API references, videos, and package snapshot.
- [Curriculum](docs/01-curriculum.md): the complete lesson plan from first principles to production patterns.
- [Next Lesson Protocol](docs/02-next-lesson-protocol.md): exact procedure for selecting and implementing future lessons.
- [Glossary](docs/03-glossary.md): Effect vocabulary and mental models.
- [Mastery Playbook](docs/04-mastery-playbook.md): coding standards, review checklist, and project milestones.

## Current Commands

```sh
npm run typecheck
npm run test
npm run check
npm run versions
```

The `test` script intentionally passes with no tests so the scaffold is green before lesson code exists.
