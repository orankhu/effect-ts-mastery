import { Data, Effect } from "effect"

export class EmptyOrderId extends Data.TaggedError("EmptyOrderId")<{
  readonly input: string
}> {}

export class InvalidAddressJson extends Data.TaggedError("InvalidAddressJson")<{
  readonly input: string
  readonly cause: unknown
}> {}

export class ShippingRateUnavailable extends Data.TaggedError("ShippingRateUnavailable")<{
  readonly cause: unknown
}> {}

export interface ShippingAddress {
  readonly name: string
  readonly street: string
  readonly country: string
}

export interface ShippingLabel {
  readonly orderId: string
  readonly createdAtIso: string
  readonly packagingCode: string
  readonly address: ShippingAddress
  readonly rateCents: number
}

export type BuildShippingLabelError = EmptyOrderId | InvalidAddressJson | ShippingRateUnavailable

export const normalizeOrderId = (_input: string): Effect.Effect<string, EmptyOrderId, never> => {
  const trimmed = _input.trim()
  if (trimmed === "") {
    return Effect.fail(
      new EmptyOrderId({
        input: _input
      })
    )
  }
  return Effect.succeed(trimmed)
}

export const readCreatedAt = (_now: () => Date): Effect.Effect<string, never, never> => {
  return Effect.sync(() => _now().toISOString())
}

export const loadPackagingCode = (
  _loadPackagingCode: () => Promise<string>
): Effect.Effect<string, never, never> => Effect.promise(() => _loadPackagingCode())

export const parseShippingAddress = (
  _input: string
): Effect.Effect<ShippingAddress, InvalidAddressJson, never> =>
  Effect.try({
    try: () => JSON.parse(_input),
    catch: (error) => {
      return new InvalidAddressJson({ input: _input, cause: error })
    }
  })

export const loadShippingRateCents = (
  _loadRateCents: () => Promise<number>
): Effect.Effect<number, ShippingRateUnavailable, never> =>
  Effect.tryPromise({
    try: () => _loadRateCents(),
    catch: (error) => new ShippingRateUnavailable({ cause: error })
  })

export const buildShippingLabel = (
  _orderId: string,
  _addressJson: string,
  _now: () => Date,
  _loadPackagingCode: () => Promise<string>,
  _loadRateCents: () => Promise<number>
): Effect.Effect<ShippingLabel, BuildShippingLabelError, never> => {
  return Effect.gen(function* () {
    const orderId = yield* normalizeOrderId(_orderId)
    const address = yield* parseShippingAddress(_addressJson)
    const createdAtIso = yield* readCreatedAt(_now)
    const packagingCode = yield* loadPackagingCode(_loadPackagingCode)
    const rateCents = yield* loadShippingRateCents(_loadRateCents)

    return {
      orderId,
      createdAtIso,
      packagingCode,
      address,
      rateCents
    }
  })
}
