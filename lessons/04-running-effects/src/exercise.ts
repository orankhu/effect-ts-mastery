import { Data, Effect, type Exit } from "effect"

export class MissingRefundId extends Data.TaggedError("MissingRefundId")<{
  readonly input: string
}> {}

export interface RefundPreview {
  readonly refundId: string
  readonly reviewedAtIso: string
  readonly message: string
}

export type RefundPreviewError = MissingRefundId

export const normalizeRefundId = (input: string): Effect.Effect<string, MissingRefundId, never> => {
  const trimmed = input.trim()

  if (trimmed === "") {
    return Effect.fail(new MissingRefundId({ input }))
  }

  return Effect.succeed(trimmed)
}

export const readReviewedAt = (now: () => Date): Effect.Effect<string, never, never> =>
  Effect.sync(() => now().toISOString())

export const prepareRefundPreview = (
  refundIdInput: string,
  now: () => Date
): Effect.Effect<RefundPreview, RefundPreviewError, never> =>
  Effect.gen(function* () {
    const refundId = yield* normalizeRefundId(refundIdInput)
    const reviewedAtIso = yield* readReviewedAt(now)

    return {
      refundId,
      reviewedAtIso,
      message: `Refund ${refundId} reviewed at ${reviewedAtIso}`
    }
  })

export const runSupportConsoleBoundary = <A, E>(_program: Effect.Effect<A, E, never>): A => {
  throw new Error("TODO: run the program synchronously at the console boundary")
}

export const inspectSupportConsoleBoundary = <A, E>(
  _program: Effect.Effect<A, E, never>
): Exit.Exit<A, E> => {
  throw new Error("TODO: run the program synchronously and return Exit data")
}

export const runSupportApiBoundary = <A, E>(_program: Effect.Effect<A, E, never>): Promise<A> => {
  throw new Error("TODO: run the program as a Promise at the API boundary")
}

export const inspectSupportApiBoundary = <A, E>(
  _program: Effect.Effect<A, E, never>
): Promise<Exit.Exit<A, E>> => {
  throw new Error("TODO: run the program as a Promise and return Exit data")
}
