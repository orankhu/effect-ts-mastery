import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"

import { buildShippingLabel } from "../src/exercise.js"

describe("Lesson 03 exercise: creating effects", () => {
  it.effect("builds a ShippingLabel for valid inputs", () =>
    Effect.gen(function* () {
      const label = yield* buildShippingLabel(
        " ABC123 ",
        JSON.stringify({ name: "Home", street: "Street", country: "Thailand" }),
        () => new Date("2026-06-26T10:30:00.000Z"),
        () => Promise.resolve("CODE"),
        () => Promise.resolve(1)
      )

      assert.deepStrictEqual(label, {
        orderId: "ABC123",
        createdAtIso: "2026-06-26T10:30:00.000Z",
        packagingCode: "CODE",
        address: { name: "Home", street: "Street", country: "Thailand" },
        rateCents: 1
      })
    })
  )

  it.effect("fails with EmptyOrderId when the order id is blank", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        buildShippingLabel(
          " ",
          JSON.stringify({ name: "Home", street: "Street", country: "Thailand" }),
          () => new Date("2026-06-26T10:30:00.000Z"),
          () => Promise.resolve(""),
          () => Promise.resolve(1)
        )
      )

      if (error._tag === "EmptyOrderId") {
        assert.strictEqual(error.input, " ")
      } else {
        assert.fail(`expected EmptyOrderId, got ${error._tag}`)
      }
    })
  )

  it.todo("fails with InvalidAddressJson when JSON parsing or address validation fails")
  it.todo("fails with ShippingRateUnavailable when the rate lookup rejects")
  it.todo("proves readCreatedAt is lazy until the Effect is run")
})
