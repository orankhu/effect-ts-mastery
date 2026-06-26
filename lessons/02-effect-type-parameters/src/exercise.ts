import { Context, Effect } from "effect"

export interface InvalidQuantity {
  readonly _tag: "InvalidQuantity"
  readonly input: string
  readonly reason: "empty" | "not-a-number" | "not-positive-integer"
}

export interface QuantityTooLarge {
  readonly _tag: "QuantityTooLarge"
  readonly requested: number
  readonly maxQuantity: number
}

export interface DiscountPolicyService {
  readonly unitPriceCents: number
  readonly maxQuantity: number
  readonly discountPercent: number
}

export class DiscountPolicy extends Context.Tag("Lesson02/DiscountPolicy")<
  DiscountPolicy,
  DiscountPolicyService
>() {}

export interface OrderQuote {
  readonly quantity: number
  readonly subtotalCents: number
  readonly discountCents: number
  readonly totalCents: number
}

export type QuoteOrderProgram = Effect.Effect<
  OrderQuote,
  InvalidQuantity | QuantityTooLarge,
  DiscountPolicy
>

export const quoteOrder = (_input: string): QuoteOrderProgram => {
  return Effect.gen(function* () {
    const trimmed = _input.trim()
    const parsed = Number(trimmed)

    if (trimmed === "" || !Number.isFinite(parsed)) {
      yield* Effect.fail<InvalidQuantity>({
        _tag: "InvalidQuantity",
        input: _input,
        reason: trimmed === "" ? "empty" : "not-a-number"
      })
    }

    if (parsed < 1 || !Number.isInteger(parsed)) {
      yield* Effect.fail<InvalidQuantity>({
        _tag: "InvalidQuantity",
        input: _input,
        reason: "not-positive-integer"
      })
    }

    const discountPolicy = yield* DiscountPolicy

    if (parsed > discountPolicy.maxQuantity) {
      yield* Effect.fail<QuantityTooLarge>({
        _tag: "QuantityTooLarge",
        requested: parsed,
        maxQuantity: discountPolicy.maxQuantity
      })
    }

    const subtotalCents = parsed * discountPolicy.unitPriceCents
    const discount = discountPolicy.discountPercent / 100
    const discountCents = Math.round(subtotalCents * discount)

    return {
      quantity: parsed,
      subtotalCents,
      discountCents,
      totalCents: subtotalCents - discountCents
    }
  })
}

export const provideDiscountPolicy = <A, E>(
  program: Effect.Effect<A, E, DiscountPolicy>,
  policy: DiscountPolicyService
): Effect.Effect<A, E, never> => Effect.provideService(program, DiscountPolicy, policy)
