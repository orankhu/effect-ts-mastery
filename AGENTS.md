# Agent Instructions

This repo is an Effect TypeScript learning project. Future lesson work should follow the existing lesson protocol in `docs/02-next-lesson-protocol.md`, plus the learner-focused structure below.

## Lesson Goals

Each lesson should teach one clear Effect concept and include:

- A concise explanation of the concept.
- A small worked example.
- A separate learner exercise that is more challenging than the worked example.
- A separate learner test file where the learner writes tests.
- Review questions that require explanation, not just recall.

The lesson should feel like guided practice, not a complete solution dump.

## Lesson Folder Shape

For Lesson `NN` with slug `some-topic`, prefer:

```text
lessons/NN-some-topic/
  README.md
  notes.md
  src/
    lesson.ts
    exercise.ts
  test/
    lesson.test.ts
    exercise.test.ts
```

Use `src/lesson.ts` and `test/lesson.test.ts` for the worked example and agent-provided verification.

Use `src/exercise.ts` and `test/exercise.test.ts` for learner-owned practice.

## Worked Example

The worked example should:

- Be small enough to read in one sitting.
- Demonstrate the lesson concept directly.
- Include passing tests that prove the example behavior.
- Avoid solving the learner exercise by accident.

The example may be simpler than the exercise, but it should provide enough vocabulary and patterns for the learner to attempt the exercise independently.

## Learner Exercise

The learner exercise should:

- Require the same concept as the worked example.
- Add one or two extra decisions so the learner has to think.
- Include clear requirements in the README.
- Leave implementation work in `src/exercise.ts`.
- Avoid hidden tricks unrelated to the lesson concept.

Prefer scaffolding with exported function names, types, and comments describing expected behavior. Do not provide the full exercise solution unless the user asks.

## Learner Tests

The learner test file should:

- Be separate from the worked example tests.
- Contain test names or lightweight scaffolding that the learner can complete.
- Avoid failing `npm run check` before the learner starts.

Use `it.todo(...)` or skipped tests when needed so the repo remains green before the learner attempts the exercise. The README should tell the learner to replace the todos with real tests as part of the lesson.

## Review Questions

Review questions should be slightly challenging. They should ask the learner to explain tradeoffs, predict behavior, or read an Effect type.

Prefer questions like:

- "What happens if this Effect is constructed but never run?"
- "Which part of `Effect<A, E, R>` changes after providing this dependency?"
- "Why is this failure represented in the error channel instead of thrown?"
- "If this program is run twice, which values are reused and which work is repeated?"

Avoid questions that can be answered by copying one sentence from the README.

## Completion Expectations

A lesson is ready for learner review when:

- `npm run check` passes.
- The worked example is implemented and tested.
- The exercise scaffold exists.
- The learner test scaffold exists.
- The README clearly separates the example, exercise, tests, and review questions.

A lesson should not be treated as fully learned until the learner has:

- Attempted the exercise implementation.
- Written or completed the learner tests.
- Answered the review questions.
- Received feedback on any misunderstandings.

## Feedback Style

When reviewing learner answers:

- Confirm what is correct.
- Correct imprecise wording.
- Tie feedback back to the lesson code and Effect types.
- Prefer small improvements over jumping ahead to advanced concepts.

Keep the next lesson blocked until the current lesson's core idea is understood.
