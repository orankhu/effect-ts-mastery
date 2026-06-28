import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import { buildShippingLabel, readCreatedAt } from "../src/exercise.js"

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

  it.effect("fails with InvalidAddressJson when JSON parsing or address validation fails", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        buildShippingLabel(
          "ABC123",
          JSON.stringify({ street: "Street", country: "Thailand" }),
          () => new Date("2026-06-26T10:30:00.000Z"),
          () => Promise.resolve(""),
          () => Promise.resolve(1)
        )
      )
      assert.strictEqual(error._tag, "InvalidAddressJson")
    })
  )
  it.effect("fails with ShippingRateUnavailable when the rate lookup rejects", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        buildShippingLabel(
          "ABC123",
          JSON.stringify({ name: "Home", street: "Street", country: "Thailand" }),
          () => new Date("2026-06-26T10:30:00.000Z"),
          () => Promise.resolve(""),
          () => Promise.reject(1)
        )
      )
      assert.strictEqual(error._tag, "ShippingRateUnavailable")
    })
  )
  it.effect("proves readCreatedAt is lazy until the Effect is run", () =>
    Effect.gen(function* () {
      let calls = 0
      const fakeNow = () => {
        calls += 1
        return new Date(1)
      }
      const program = readCreatedAt(fakeNow)
      assert.strictEqual(calls, 0)
      const createdAt = yield* program
      assert.strictEqual(calls, 1)
      assert.strictEqual(createdAt, "1970-01-01T00:00:00.001Z")
    })
  )
  it.effect("proves buildShippingLabel is lazy until the effect is run", () =>
    Effect.gen(function* () {
      let fakeNowCalls = 0
      let fakePackageCodeCalls = 0
      let fakeRateCentCalls = 0
      const fakeNow = () => {
        fakeNowCalls += 1
        return new Date(1)
      }
      const fakePackageCode = () => {
        fakePackageCodeCalls += 1
        return Promise.resolve("CODE")
      }
      const fakeRateCent = () => {
        fakeRateCentCalls += 1
        return Promise.resolve(1)
      }
      const program = buildShippingLabel(
        " ABC123 ",
        JSON.stringify({ name: "Home", street: "Street", country: "Thailand" }),
        fakeNow,
        fakePackageCode,
        fakeRateCent
      )
      assert.strictEqual(fakeNowCalls, 0)
      assert.strictEqual(fakePackageCodeCalls, 0)
      assert.strictEqual(fakeRateCentCalls, 0)

      const label = yield* program
      assert.deepStrictEqual(label, {
        orderId: "ABC123",
        createdAtIso: "1970-01-01T00:00:00.001Z",
        packagingCode: "CODE",
        address: { name: "Home", street: "Street", country: "Thailand" },
        rateCents: 1
      })

      assert.strictEqual(fakeNowCalls, 1)
      assert.strictEqual(fakePackageCodeCalls, 1)
      assert.strictEqual(fakeRateCentCalls, 1)
    })
  )
})
