# Lesson 02: Reading `Effect<A, E, R>`

## Goal

Become comfortable reading an Effect type before looking at the implementation. The three type parameters tell you what the program can produce, what expected failures it can report, and what services it needs from its environment.

## Concepts

- `A` as the success value type.
- `E` as the expected error type.
- `R` as required services from the context.
- `never` as "no possible value" in each channel.
- Providing a service removes that service from `R`.

## Before Coding

Read these first:

- https://effect.website/docs/getting-started/the-effect-type/
- https://effect.website/docs/getting-started/importing-effect/

Focus on this shape:

```ts
Effect.Effect<A, E, R>
```

Read it as:

- The program can succeed with `A`.
- The program can fail with an expected error `E`.
- The program requires services `R` before it can run.

## Worked Example

Open [src/lesson.ts](src/lesson.ts). It has three small examples:

```ts
Effect.Effect<number, never, never>
Effect.Effect<number, InvalidSeatCount, never>
Effect.Effect<string, never, PricingConfig>
```

The first succeeds with a number and has no expected failure or service requirement.

The second can either succeed with a number or fail with `InvalidSeatCount`.

The third succeeds with a string, cannot fail in the expected error channel, and needs `PricingConfig` before it can run.

## Exercise

Open [src/exercise.ts](src/exercise.ts). Your job is to implement `quoteOrder`.

The target type is:

```ts
Effect.Effect<OrderQuote, InvalidQuantity | QuantityTooLarge, DiscountPolicy>
```

That means:

- Success: return an `OrderQuote`.
- Expected failures: fail with `InvalidQuantity` or `QuantityTooLarge`.
- Requirement: read `DiscountPolicy` from the Effect context.

Requirements:

1. Trim and parse the input as a positive integer quantity.
2. Fail with `InvalidQuantity` if the input is empty, not a finite number, not an integer, or less than `1`.
3. Read `DiscountPolicy` from the context.
4. Fail with `QuantityTooLarge` if the requested quantity is greater than `maxQuantity`.
5. On success, return an `OrderQuote` with `quantity`, `subtotalCents`, `discountCents`, and `totalCents`.

Use `Effect.succeed`, `Effect.fail`, `Effect.gen`, and `yield* DiscountPolicy`. Do not call `Effect.runSync` inside `src/exercise.ts`; running belongs in tests or application boundaries.

## Tests

The worked example tests are in [test/lesson.test.ts](test/lesson.test.ts).

Your learner tests are in [test/exercise.test.ts](test/exercise.test.ts). Replace the `it.todo(...)` entries with real tests after you implement `quoteOrder`.

Useful commands:

```sh
npm run check
npx vitest run lessons/02-effect-type-parameters/test/exercise.test.ts
```

## What The Tests Should Prove

Your exercise tests should prove:

1. A valid quantity returns the expected quote.
2. Invalid input fails with `InvalidQuantity`.
3. A quantity above `maxQuantity` fails with `QuantityTooLarge`.
4. Providing `DiscountPolicy` removes the `R` requirement so the program can run.

## Review Questions

1. Before reading the implementation, what does `Effect.Effect<OrderQuote, InvalidQuantity | QuantityTooLarge, DiscountPolicy>` tell you?
2. Which type parameter changes after `provideDiscountPolicy(...)`, and what should it become?
3. Why should invalid user input appear in `E` instead of being thrown?
4. Why should `quoteOrder` return an Effect instead of calling `Effect.runSync` itself?
5. What does `never` mean in the success channel, error channel, and requirement channel?

## Completion Checklist

- [x] Worked example code compiles.
- [x] Worked example tests pass.
- [x] Exercise implementation is completed.
- [x] Learner tests replace the todos and pass.
- [x] You can explain `A`, `E`, and `R` from the type alone.
