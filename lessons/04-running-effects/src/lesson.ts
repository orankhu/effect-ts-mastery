import { Data, Effect, type Exit } from "effect"

export class MissingOrderId extends Data.TaggedError("MissingOrderId")<{
  readonly input: string
}> {}

export interface DispatchSummary {
  readonly orderId: string
  readonly printedAtIso: string
  readonly line: string
}

export type DispatchSummaryError = MissingOrderId

export const normalizeOrderId = (input: string): Effect.Effect<string, MissingOrderId, never> => {
  const trimmed = input.trim()

  if (trimmed === "") {
    return Effect.fail(new MissingOrderId({ input }))
  }

  return Effect.succeed(trimmed)
}

export const readPrintedAt = (now: () => Date): Effect.Effect<string, never, never> =>
  Effect.sync(() => now().toISOString())

export const prepareDispatchSummary = (
  orderIdInput: string,
  now: () => Date
): Effect.Effect<DispatchSummary, DispatchSummaryError, never> =>
  Effect.gen(function* () {
    const orderId = yield* normalizeOrderId(orderIdInput)
    const printedAtIso = yield* readPrintedAt(now)

    return {
      orderId,
      printedAtIso,
      line: `Dispatch ${orderId} printed at ${printedAtIso}`
    }
  })

export const attachBoundaryFooter = (
  summary: DispatchSummary
): Effect.Effect<string, never, never> =>
  Effect.succeed(`${summary.line}\nReady for warehouse handoff.`)

export const preparePrintableDispatch = (
  orderIdInput: string,
  now: () => Date
): Effect.Effect<string, DispatchSummaryError, never> =>
  Effect.gen(function* () {
    const summary = yield* prepareDispatchSummary(orderIdInput, now)
    return yield* attachBoundaryFooter(summary)
  })

export const runCliBoundary = <A, E>(program: Effect.Effect<A, E, never>): A =>
  Effect.runSync(program)

export const inspectCliBoundary = <A, E>(program: Effect.Effect<A, E, never>): Exit.Exit<A, E> =>
  Effect.runSyncExit(program)

export const runHttpBoundary = <A, E>(program: Effect.Effect<A, E, never>): Promise<A> =>
  Effect.runPromise(program)

export const inspectHttpBoundary = <A, E>(
  program: Effect.Effect<A, E, never>
): Promise<Exit.Exit<A, E>> => Effect.runPromiseExit(program)
