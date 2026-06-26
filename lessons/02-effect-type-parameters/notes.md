# Lesson 02 Notes

## Main Point

`Effect<A, E, R>` gives useful information before runtime:

1. `A` is the value produced on success.
2. `E` is the expected failure type.
3. `R` is the environment requirement.

The key new idea after Lesson 01 is that the type does not only describe the final value. It also describes failures and missing services.

## What To Watch For

Do not hide expected failures by throwing:

```ts
// Wrong for this lesson's goal:
throw new Error("Invalid quantity")
```

Use `Effect.fail(...)` for expected domain failures so the error appears in the `E` type parameter.

## Why The Service Example Exists

`PricingConfig` and `DiscountPolicy` are intentionally small. Their job is only to make `R` visible. Later lessons will cover services and layers in more depth.

For now, read:

```ts
Effect.Effect<string, never, PricingConfig>
```

as:

- It succeeds with a `string`.
- It has no modeled expected error.
- It needs `PricingConfig` before it can run.

## Current Status

Completed with:

- Worked example implementation.
- Worked example tests.
- Learner exercise implementation.
- Learner tests for success, invalid quantity, quantity limit, and provided requirements.

The learner answered the review questions with the core distinction between success, expected failure, and requirements intact.
