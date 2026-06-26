# Lesson 03: Creating Effects

## Goal

Learn how to choose the right constructor when real application work crosses into Effect:
pure values, expected validation failures, synchronous side effects, throwing code, and
Promise-based work.

By the end of this lesson, you should be able to look at a product workflow and say,
"this part is pure", "this part can fail in an expected way", "this part should be lazy",
and "this rejected Promise belongs in the error channel".

## Concepts

- `Effect.succeed` for pure success values.
- `Effect.fail` for expected typed failures.
- `Effect.sync` for synchronous work that should run only when the Effect runs.
- `Effect.promise` for Promise work that is expected not to reject.
- `Effect.try` for synchronous code that may throw.
- `Effect.tryPromise` for Promise work that may reject.
- Expected failures in `E` versus unexpected defects.

## Before Coding

Read these first:

- https://effect.website/docs/getting-started/creating-effects/
- `.agents/skills/effect-ts/references/guide-effect.md`

Pay attention to the constructor decision:

```ts
pure value -> Effect.succeed
expected rejection -> Effect.fail
synchronous side effect -> Effect.sync
throwing synchronous boundary -> Effect.try
non-rejecting Promise -> Effect.promise
rejecting Promise boundary -> Effect.tryPromise
```

## Worked Example

Open [src/lesson.ts](src/lesson.ts). The worked example is a small invoice-preparation
workflow.

Imagine an operations user starts a new invoice from a form. The app needs to normalize
the customer name, remember when the invoice was started, write an audit event, load the
standard payment terms, parse one invoice line from JSON, and ask another system for the
tax rate.

Those steps are not all the same kind of work:

- `makeDraftInvoice` trims a pure value and uses `Effect.succeed` or `Effect.fail`.
- `recordAuditEvent` uses `Effect.sync` so the event is recorded only when the Effect runs.
- `loadStandardPaymentTerms` uses `Effect.promise` for async work that should only resolve.
- `parseInvoiceLine` uses `Effect.try` to turn thrown JSON or shape errors into `InvalidInvoiceLine`.
- `loadTaxRate` uses `Effect.tryPromise` to turn rejected Promises into `TaxRateUnavailable`.
- `parseInvoiceLineAsDefect` shows what happens when throwing work is put in `Effect.sync`: the error is a defect, not an expected failure in `E`.

## Exercise

Open [src/exercise.ts](src/exercise.ts).

### Story

You are building the "Create shipping label" action for a small warehouse tool.

A support teammate has reviewed an order and clicks **Create label**. At that moment the
system must turn a few messy inputs into a label the warehouse can print:

- the order id was typed or pasted by a human, so it may contain extra spaces or be blank
- the address arrives as JSON from another system, so parsing and validation can fail
- the label needs the current timestamp, but the clock should not be read until the label
  workflow actually runs
- a packaging service chooses the default packaging code and is expected to resolve
- a carrier-rate service may reject when the carrier API is unavailable

The goal is not just to "wrap a Promise". The goal is to describe this business workflow
honestly: expected user/data problems should be typed failures, ordinary synchronous work
should stay lazy, and external async failures should be mapped into domain errors the
caller can handle.

### User Story

As a warehouse operator, I want the app to create a shipping label only when the order id,
shipping address, packaging choice, timestamp, and carrier rate are all available, so that
I can print a label or see a clear reason the label cannot be created yet.

### Implementation Requirements

Translate the story into these Effect boundaries:

| Workflow step | Why it exists | Constructor to practice |
| --- | --- | --- |
| Normalize the order id | A blank id is an expected form problem | `Effect.succeed` / `Effect.fail` |
| Read the timestamp | The clock is synchronous work that must stay lazy | `Effect.sync` |
| Load the packaging code | This Promise is expected to resolve | `Effect.promise` |
| Parse the address JSON | JSON parsing and shape checks may throw | `Effect.try` |
| Load the shipping rate | The carrier lookup Promise may reject | `Effect.tryPromise` |
| Build the final label | The whole label needs several effectful steps in order | `Effect.gen` |

Implement:

1. `normalizeOrderId`: trim the order id and fail with `EmptyOrderId` when it is empty.
2. `readCreatedAt`: call the provided `now` function inside `Effect.sync`.
3. `loadPackagingCode`: wrap a Promise that is expected to resolve.
4. `parseShippingAddress`: parse and validate JSON with `Effect.try`.
5. `loadShippingRateCents`: wrap a Promise that may reject with `Effect.tryPromise`.
6. `buildShippingLabel`: compose the helpers with `Effect.gen`.

Do not call `Effect.runSync` or `Effect.runPromise` inside `src/exercise.ts`; running belongs in tests or application boundaries.

## Tests

The worked example tests are in [test/lesson.test.ts](test/lesson.test.ts).

Your learner tests are in [test/exercise.test.ts](test/exercise.test.ts). Replace the `it.todo(...)` entries with real tests as you implement the exercise.

Useful commands:

```sh
npm run check
npx vitest run lessons/03-creating-effects/test/exercise.test.ts
```

## What The Tests Should Prove

Your exercise tests should prove:

1. Valid inputs produce a complete `ShippingLabel`.
2. Empty order ids fail with `EmptyOrderId`.
3. Invalid address JSON fails with `InvalidAddressJson`.
4. A rejected rate lookup fails with `ShippingRateUnavailable`.
5. The timestamp, packaging lookup, and rate lookup are lazy until the Effect runs.

## Review Questions

1. Why is `Effect.succeed(value)` different from `Effect.sync(() => value)` even when both produce the same value?
2. If a Promise can reject, why should this lesson use `Effect.tryPromise` instead of `Effect.promise`?
3. What happens to a thrown exception inside `Effect.sync`, and why is that different from `Effect.try`?
4. Which constructor should you choose for invalid user input that you expect and want in the `E` channel?
5. In the shipping-label story, which problems should become typed failures and which problems would be defects?
6. If the shipping-label Effect is constructed but never run, which business actions have actually happened?

## Completion Checklist

- [x] Worked example code compiles.
- [x] Worked example tests pass.
- [x] Exercise scaffold exists.
- [x] Learner test scaffold exists.
- [ ] Exercise implementation is completed.
- [ ] Learner tests replace the todos and pass.
- [ ] You can explain why each constructor was chosen.
