import { describe, expect, it } from "vitest"
import { provideDiscountPolicy, quoteOrder, type InvalidQuantity, type OrderQuote, type QuantityTooLarge } from "../src/exercise.js"
import { Effect } from "effect"

describe("Lesson 02 exercise: reading Effect<A, E, R>", () => {
  it("returns an OrderQuote for a valid positive integer quantity", () => {
    const program = quoteOrder("50")
    const runnable = provideDiscountPolicy(program, {
      unitPriceCents: 100,
      maxQuantity: 100,
      discountPercent: 10
    })
    expect(Effect.runSync(runnable)).toStrictEqual({
      quantity: 50,
      subtotalCents: 5000,
      discountCents: 500,
      totalCents: 4500
    })
  })
  it("fails with InvalidQuantity for invalid input", () => {
    const program = quoteOrder("1.5")
    const runnable = provideDiscountPolicy(program, {
      unitPriceCents: 100,
      maxQuantity: 100,
      discountPercent: 10
    })
    expect(Effect.runSync(Effect.flip(runnable))).toStrictEqual<InvalidQuantity>({
      _tag: 'InvalidQuantity',
      input: "1.5",
      reason: "not-positive-integer"
    })
  })
  it("fails with QuantityTooLarge when the quantity is above maxQuantity", () => {
    const program = quoteOrder("11")
    const runnable = provideDiscountPolicy(program, {
      unitPriceCents: 100,
      maxQuantity: 10,
      discountPercent: 10
    })
    expect(Effect.runSync(Effect.flip(runnable))).toStrictEqual<QuantityTooLarge>({
      _tag: 'QuantityTooLarge',
      requested: 11,
      maxQuantity: 10,
    })
  })
  it("provides DiscountPolicy so the runnable program has no R requirement", () => {
    const program = quoteOrder("5")
    const runnable: Effect.Effect<OrderQuote, InvalidQuantity | QuantityTooLarge, never> = provideDiscountPolicy(program, {
      unitPriceCents: 100,
      maxQuantity: 10,
      discountPercent: 10
    })
  })
})
