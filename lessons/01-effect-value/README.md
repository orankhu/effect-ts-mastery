# Lesson 01: Orientation And The Effect Value

## Goal

Understand the first mental model of Effect: an `Effect` is a value that describes work. Creating the value does not run the work. Running happens later, through the Effect runtime, usually at the edge of an application or in a test.

## Why This Matters

In plain TypeScript, a function call usually does the work immediately:

```ts
const message = greet("Ada")
```

With Effect, you often build a value first:

```ts
const program = makeGreetingEffect("Ada", recordEvent)
```

At this point, `program` is a description. The side effect has not happened. The work happens only when the program is interpreted:

```ts
Effect.runSync(program)
```

That separation is the root of most Effect benefits. Once work is represented as a value, it can be composed, tested, retried, interrupted, provided with dependencies, and inspected by the type system before it runs.

## Concepts

- Effect as a value.
- Laziness.
- Runtime execution.
- `Effect.Effect<A, E, R>`.
- `A` as success value.
- `E` as expected error.
- `R` as required services.

## Before Coding

Read these first:

- https://effect.website/docs/getting-started/introduction/
- https://effect.website/docs/getting-started/why-effect/
- https://effect.website/docs/getting-started/the-effect-type/

Useful supporting pages:

- https://effect.website/docs/getting-started/creating-effects/
- https://effect.website/docs/getting-started/running-effects/

Focus on this type:

```ts
Effect.Effect<string, never, never>
```

Read it as:

- It succeeds with a `string`.
- It has no modeled expected error.
- It needs no services from the environment.

## Files

```text
lessons/01-effect-value/
  README.md
  notes.md
  src/
    lesson.ts
  test/
    lesson.test.ts
```

This layout keeps each lesson self-contained as the lesson count grows.

## Exercise

Open [src/lesson.ts](src/lesson.ts). The function `makeGreetingEffect` accepts a name and a recorder function. It returns an Effect that will:

1. Build a greeting message.
2. Record an event.
3. Return the greeting message.

The important part is when those steps happen. Calling `makeGreetingEffect` should not record anything. Running the returned Effect should record exactly one event.

## Run It

From the project root:

```sh
npm run check
```

To run only this lesson's test:

```sh
npx vitest run lessons/01-effect-value/test/lesson.test.ts
```

## What The Tests Prove

The tests in [test/lesson.test.ts](test/lesson.test.ts) prove two things:

1. Constructing an Effect does not execute the described side effect.
2. Running the same Effect value twice executes the described workflow twice.

That second point matters: an Effect value is not the already-computed result. It is a reusable description of work.

## Key Takeaways

- `Effect.sync(() => ...)` captures synchronous work lazily.
- Nothing inside the thunk runs when the Effect is created.
- `Effect.runSync(program)` executes this synchronous program immediately.
- Runtime calls are for boundaries and tests. Most reusable code should return Effects.

## Review Questions

1. What is the difference between `const program = makeGreetingEffect(...)` and `Effect.runSync(program)`?
2. Why does the recorder array stay empty immediately after constructing the Effect?
3. What does `Effect.Effect<string, never, never>` tell you before reading the implementation?
4. If you run the same Effect value twice, should it reuse the old result or repeat the described work?

## Completion Checklist

- [x] Code compiles.
- [x] Tests pass.
- [x] The lesson demonstrates that Effect construction is lazy.
- [x] The learner can explain the difference between describing work and running work.
