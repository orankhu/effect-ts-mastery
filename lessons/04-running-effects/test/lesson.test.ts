import { assert, describe, it } from "@effect/vitest"
import { Cause, Effect, Exit, Option } from "effect"

import {
  inspectCliBoundary,
  inspectHttpBoundary,
  prepareDispatchSummary,
  preparePrintableDispatch,
  runCliBoundary,
  runHttpBoundary
} from "../src/lesson.js"

describe("Lesson 04: running effects and runtime boundaries", () => {
  it.effect("keeps reusable workflow code lazy until a boundary runs it", () =>
    Effect.gen(function* () {
      let clockReads = 0
      const now = () => {
        clockReads += 1
        return new Date("2026-06-27T09:15:00.000Z")
      }

      const program = prepareDispatchSummary("  ORD-100  ", now)

      assert.strictEqual(clockReads, 0)

      const summary = runCliBoundary(program)

      assert.strictEqual(clockReads, 1)
      assert.deepStrictEqual(summary, {
        orderId: "ORD-100",
        printedAtIso: "2026-06-27T09:15:00.000Z",
        line: "Dispatch ORD-100 printed at 2026-06-27T09:15:00.000Z"
      })

      yield* Effect.void
    })
  )

  it.effect("runs a synchronous boundary when the caller needs a plain value", () =>
    Effect.gen(function* () {
      const output = runCliBoundary(
        preparePrintableDispatch("ORD-101", () => new Date("2026-06-27T10:00:00.000Z"))
      )

      assert.strictEqual(
        output,
        "Dispatch ORD-101 printed at 2026-06-27T10:00:00.000Z\nReady for warehouse handoff."
      )

      yield* Effect.void
    })
  )

  it.effect("uses runSyncExit when the boundary wants failure as data", () =>
    Effect.gen(function* () {
      const exit = inspectCliBoundary(
        preparePrintableDispatch("   ", () => new Date("2026-06-27T10:00:00.000Z"))
      )

      assert.isTrue(Exit.isFailure(exit))

      if (Exit.isFailure(exit)) {
        const failure = Cause.failureOption(exit.cause)

        assert.isTrue(Option.isSome(failure))

        if (Option.isSome(failure)) {
          assert.strictEqual(failure.value._tag, "MissingOrderId")
          assert.strictEqual(failure.value.input, "   ")
        }
      }
    })
  )

  it.effect("runs an async boundary when the caller needs a Promise", () =>
    Effect.gen(function* () {
      const output = yield* Effect.promise(() =>
        runHttpBoundary(
          preparePrintableDispatch("ORD-102", () => new Date("2026-06-27T11:30:00.000Z"))
        )
      )

      assert.strictEqual(
        output,
        "Dispatch ORD-102 printed at 2026-06-27T11:30:00.000Z\nReady for warehouse handoff."
      )
    })
  )

  it.effect("uses runPromiseExit when an async boundary wants Exit data", () =>
    Effect.gen(function* () {
      const exit = yield* Effect.promise(() =>
        inspectHttpBoundary(
          preparePrintableDispatch("", () => new Date("2026-06-27T12:00:00.000Z"))
        )
      )

      assert.isTrue(Exit.isFailure(exit))

      if (Exit.isFailure(exit)) {
        const failure = Cause.failureOption(exit.cause)

        assert.isTrue(Option.isSome(failure))

        if (Option.isSome(failure)) {
          assert.strictEqual(failure.value._tag, "MissingOrderId")
          assert.strictEqual(failure.value.input, "")
        }
      }
    })
  )
})
