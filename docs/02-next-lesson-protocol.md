# Next Lesson Protocol

This document defines exactly how a future "next lesson" request should be handled.

## Single Source Of Truth

The ordered lesson state is `docs/lesson-index.json`.

Each lesson has:

- `id`: stable numeric lesson id.
- `slug`: folder name under `lessons/`.
- `title`: human-readable lesson title.
- `phase`: curriculum phase.
- `status`: `pending`, `in_progress`, `completed`, or `skipped`.
- `prerequisites`: lesson ids that must already be completed.
- `primaryDocs`: official docs to read before implementing.
- `implementationPlan`: files that may be created or edited for that lesson.
- `acceptanceCriteria`: concrete completion checks.

## Status Rules

| Status | Meaning |
| --- | --- |
| `pending` | The lesson has not started. |
| `in_progress` | The lesson is currently being implemented or explained. |
| `completed` | Code, tests, notes, and checks passed. |
| `skipped` | The user explicitly skipped it. Include the reason in `notes`. |

Never mark a lesson `completed` just because files exist. The acceptance criteria must pass.

## Procedure For "Next Lesson"

1. Open `docs/lesson-index.json`.
2. Find the first lesson where `status` is `pending` and all `prerequisites` are `completed` or empty.
3. Read that lesson's section in `docs/01-curriculum.md`.
4. Read all `primaryDocs` links listed in the lesson index. If a link is unstable or outdated, check the installed package typings.
5. Change the lesson status to `in_progress`.
6. Create only the files listed in `implementationPlan`.
7. Keep the lesson folder self-contained:
   - `README.md`: concept explanation, instructions, expected output, recap.
   - `src/lesson.ts`: lesson implementation.
   - `test/lesson.test.ts`: verification.
   - `notes.md`: optional mistakes, alternatives, and review notes.
8. Run:

```sh
npm run check
```

9. If tests or typecheck fail, fix the lesson before moving on.
10. When acceptance criteria pass, update status to `completed`.
11. Add a short completion note to `docs/lesson-index.json` in that lesson's `notes` field.

## File Rules

For Lesson `NN` with slug `some-topic`, use:

```text
lessons/NN-some-topic/
  README.md
  notes.md
  src/
    lesson.ts
  test/
    lesson.test.ts
```

Use zero-padded lesson numbers in folder names.

Keep lesson-local source inside that lesson's `src/` folder. Shared code is not allowed until at least three lessons need it. When shared code becomes justified, put it in the project-level `src/` folder and document why in the current lesson's `notes.md`.

## Lesson README Template

Every future lesson README should contain:

```md
# Lesson NN: Title

## Goal

One paragraph.

## Concepts

- Concept 1
- Concept 2

## Before Coding

- Reading links
- What to observe in type signatures

## Exercise

Specific implementation task.

## Tests

What the tests prove.

## Review Questions

1. Question
2. Question
3. Question

## Completion Checklist

- [ ] Code compiles
- [ ] Tests pass
- [ ] Learner can explain the core idea without reading the code
```

## Code Style Rules For Lessons

- Prefer `Effect.gen` once sequencing involves two or more effectful steps.
- Prefer named typed errors with `Data.TaggedError` for domain failures.
- Prefer services and layers over module-level mutable dependencies.
- Prefer `Effect.runPromise` or platform runtimes only at the application boundary.
- Keep `Effect.runSync`, `Effect.runPromise`, and `NodeRuntime.runMain` out of reusable business logic.
- Put `R` requirements in the type instead of hiding dependencies in closures.
- Use `Schema` for external input boundaries once parsing appears.
- Use `Scope` and `Effect.acquireRelease` for resources with lifecycle.
- Test time with `TestClock` instead of real sleeping.
- Test services by providing test layers.

## When To Stop A Lesson

Stop after the lesson's acceptance criteria are satisfied. Do not implement the next lesson in the same pass unless the user explicitly asks.

## Handling User Changes

If the user changes files manually between lessons:

1. Inspect current files before editing.
2. Preserve user changes unless they directly conflict with the current lesson.
3. If a conflict exists, explain the conflict and adapt where possible.
4. Never reset lesson state unless the user asks.

## Progress Audit Before Marking Completed

A lesson is complete only if:

- The implementation files exist.
- `npm run check` passes.
- The lesson README explains what was learned.
- The tests prove the stated behavior.
- The lesson index status is updated to `completed`.
- The next pending lesson remains untouched.
