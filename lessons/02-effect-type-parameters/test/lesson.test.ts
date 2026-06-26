import { Effect } from "effect"
import { describe, expect, it } from "vitest"

import {
  countLabelCharacters,
  formatTaxedPrice,
  makeRunnableTaxedPrice,
  parseSeatCount,
  providePricingConfig,
  type PricingConfig,
  type RunnableTaxedPriceProgram,
  type TaxedPriceProgram
} from "../src/lesson.js"

type Expect<T extends true> = T
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false
type Requirement<T extends Effect.Effect<unknown, unknown, unknown>> =
  T extends Effect.Effect<unknown, unknown, infer R> ? R : never

describe("Lesson 02: reading Effect<A, E, R>", () => {
  it("uses A for the success value type", () => {
    const program = countLabelCharacters("Effect")

    expect(Effect.runSync(program)).toBe(6)
  })

  it("uses E for expected failures", () => {
    const error = Effect.runSync(Effect.flip(parseSeatCount("zero")))

    expect(error).toEqual({
      _tag: "InvalidSeatCount",
      input: "zero",
      reason: "not-a-number"
    })
  })

  it("uses R for required services", () => {
    const program = formatTaxedPrice(1000)
    const runnable = providePricingConfig(program, {
      currency: "USD",
      taxRate: 0.08
    })

    expect(Effect.runSync(runnable)).toBe("USD 10.80")
  })

  it("removes the R requirement after the service is provided", () => {
    const runnable: RunnableTaxedPriceProgram = makeRunnableTaxedPrice(2500, {
      currency: "EUR",
      taxRate: 0.2
    })

    expect(Effect.runSync(runnable)).toBe("EUR 30.00")
  })
})

type _TaxedPriceRequirement = Expect<
  Equal<Requirement<TaxedPriceProgram>, PricingConfig>
>

type _RunnableTaxedPriceRequirement = Expect<
  Equal<Requirement<RunnableTaxedPriceProgram>, never>
>
