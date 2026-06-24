import { Effect } from "effect"

export interface GreetingEvent {
  readonly type: "greeting-run"
  readonly message: string
}

export type GreetingProgram = Effect.Effect<string, never, never>

export const makeGreetingEffect = (
  name: string,
  record: (event: GreetingEvent) => void
): GreetingProgram =>
  Effect.sync(() => {
    const message = `Hello, ${name}!`

    record({
      type: "greeting-run",
      message
    })

    return message
  })
