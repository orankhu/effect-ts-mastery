import { Context, Effect } from "effect"

export interface InvalidSeatCount {
  readonly _tag: "InvalidSeatCount"
  readonly input: string
  readonly reason: "not-a-number" | "not-positive-integer"
}

export interface PricingConfigService {
  readonly currency: "USD" | "EUR"
  readonly taxRate: number
}

export class PricingConfig extends Context.Tag("Lesson02/PricingConfig")<
  PricingConfig,
  PricingConfigService
>() {}

export type LabelLengthProgram = Effect.Effect<number, never, never>

export const countLabelCharacters = (label: string): LabelLengthProgram =>
  Effect.succeed(label.length)

export type SeatCountProgram = Effect.Effect<number, InvalidSeatCount, never>

export const parseSeatCount = (input: string): SeatCountProgram => {
  const normalized = input.trim()
  const parsed = Number(normalized)

  if (normalized === "" || !Number.isFinite(parsed)) {
    return Effect.fail({
      _tag: "InvalidSeatCount",
      input,
      reason: "not-a-number"
    })
  }

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return Effect.fail({
      _tag: "InvalidSeatCount",
      input,
      reason: "not-positive-integer"
    })
  }

  return Effect.succeed(parsed)
}

export type TaxedPriceProgram = Effect.Effect<string, never, PricingConfig>

export const formatTaxedPrice = (baseCents: number): TaxedPriceProgram =>
  Effect.gen(function* () {
    const config = yield* PricingConfig
    const taxedCents = Math.round(baseCents * (1 + config.taxRate))

    return `${config.currency} ${(taxedCents / 100).toFixed(2)}`
  })

export const providePricingConfig = <A, E>(
  program: Effect.Effect<A, E, PricingConfig>,
  config: PricingConfigService
): Effect.Effect<A, E, never> =>
  Effect.provideService(program, PricingConfig, config)

export type RunnableTaxedPriceProgram = Effect.Effect<string, never, never>

export const makeRunnableTaxedPrice = (
  baseCents: number,
  config: PricingConfigService
): RunnableTaxedPriceProgram =>
  providePricingConfig(formatTaxedPrice(baseCents), config)
