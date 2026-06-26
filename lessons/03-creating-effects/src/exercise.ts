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

export const normalizeOrderId = (_input: string): Effect.Effect<string, EmptyOrderId, never> =>
  todo("normalizeOrderId: trim the input and fail with EmptyOrderId when it is empty")

export const readCreatedAt = (_now: () => Date): Effect.Effect<string, never, never> =>
  todo("readCreatedAt: call now inside Effect.sync and return an ISO string")

export const loadPackagingCode = (
  _loadPackagingCode: () => Promise<string>
): Effect.Effect<string, never, never> =>
  todo("loadPackagingCode: use Effect.promise for a Promise that should only resolve")

export const parseShippingAddress = (
  _input: string
): Effect.Effect<ShippingAddress, InvalidAddressJson, never> =>
  todo("parseShippingAddress: use Effect.try to parse JSON and validate the address shape")

export const loadShippingRateCents = (
  _loadRateCents: () => Promise<number>
): Effect.Effect<number, ShippingRateUnavailable, never> =>
  todo("loadShippingRateCents: use Effect.tryPromise and map rejection to ShippingRateUnavailable")

export const buildShippingLabel = (
  _orderId: string,
  _addressJson: string,
  _now: () => Date,
  _loadPackagingCode: () => Promise<string>,
  _loadRateCents: () => Promise<number>
): Effect.Effect<ShippingLabel, BuildShippingLabelError, never> =>
  todo("buildShippingLabel: compose the helper effects with Effect.gen")

const todo = (message: string): Effect.Effect<never, never, never> =>
  Effect.dieMessage(`TODO Lesson 03 exercise: ${message}`)
