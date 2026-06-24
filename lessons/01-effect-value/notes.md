# Lesson 01 Notes

## Main Point

An `Effect` is a value that describes work. It is not the result of the work.

The strongest signal in this lesson is the recorder array:

1. Create the Effect.
2. Check the array.
3. The array is still empty.
4. Run the Effect.
5. The array now has one event.

## What To Watch For

Do not accidentally move side effects outside the `Effect.sync` thunk:

```ts
// Wrong for this lesson's goal:
record(event)
return Effect.succeed(message)
```

That records the event during construction, before the Effect runtime executes anything.

## Why `Effect.sync`

`Effect.sync` captures synchronous side-effectful work and delays it until runtime. This is the simplest way to make laziness visible in Lesson 01.

Lesson 03 will compare `Effect.sync` with constructors such as `Effect.succeed`, `Effect.fail`, `Effect.promise`, `Effect.try`, and `Effect.tryPromise`.

## Current Status

Completed with tests proving:

- Construction is lazy.
- Running executes the described workflow.
- Running the same Effect value twice repeats the workflow.
