# Lesson 03 Notes

## Main Point

The constructor should match the kind of work being described.

- `Effect.succeed` is for pure values that are already available.
- `Effect.fail` is for expected failures the caller should see in `E`.
- `Effect.sync` delays synchronous work until the Effect is run.
- `Effect.promise` is for Promise work that should not reject.
- `Effect.try` turns thrown synchronous exceptions into expected failures.
- `Effect.tryPromise` turns rejected Promises into expected failures.

## Defects Versus Expected Failures

`parseInvoiceLine` uses `Effect.try`, so malformed JSON becomes `InvalidInvoiceLine` in the error channel.

`parseInvoiceLineAsDefect` uses `Effect.sync` around the same kind of throwing work. That compiles as an Effect with no expected error, but a thrown exception becomes a defect when the Effect is run.

Use that contrast to decide whether a problem is part of the normal domain contract or an unexpected bug.

## Exercise Guidance

The learner exercise should not add new concepts. It should reuse the same constructor choices in a shipping-label workflow:

- pure validation with `succeed` / `fail`
- timestamp capture with `sync`
- non-rejecting async packaging lookup with `promise`
- JSON parsing with `try`
- possibly rejecting rate lookup with `tryPromise`

The exercise implementation and tests are intentionally left as learner work.

## Current Status

Ready for learner review with:

- Worked example implementation.
- Worked example tests covering success, expected failure, async success, rejected Promise failure, and sync defects.
- Learner exercise scaffold.
- Learner test scaffold with todos.
