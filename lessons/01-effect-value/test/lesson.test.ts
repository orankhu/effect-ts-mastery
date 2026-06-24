import { Effect } from "effect"
import { describe, expect, it } from "vitest"

import { type GreetingEvent, makeGreetingEffect } from "../src/lesson.js"

describe("Lesson 01: the Effect value", () => {
  it("does not run the described side effect during construction", () => {
    const events: Array<GreetingEvent> = []

    const program = makeGreetingEffect("Ada", (event) => {
      events.push(event)
    })

    expect(events).toEqual([])

    const result = Effect.runSync(program)

    expect(result).toBe("Hello, Ada!")
    expect(events).toEqual([
      {
        type: "greeting-run",
        message: "Hello, Ada!"
      }
    ])
  })

  it("runs the described workflow each time the Effect is executed", () => {
    const events: Array<GreetingEvent> = []
    const program = makeGreetingEffect("Grace", (event) => {
      events.push(event)
    })

    expect(Effect.runSync(program)).toBe("Hello, Grace!")
    expect(Effect.runSync(program)).toBe("Hello, Grace!")

    expect(events).toEqual([
      {
        type: "greeting-run",
        message: "Hello, Grace!"
      },
      {
        type: "greeting-run",
        message: "Hello, Grace!"
      }
    ])
  })
})
