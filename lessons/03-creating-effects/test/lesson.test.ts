import { assert, describe, it } from "@effect/vitest"
import { Cause, Effect, Exit } from "effect"

import {
  type AuditEvent,
  loadStandardPaymentTerms,
  loadTaxRate,
  makeDraftInvoice,
  parseInvoiceLine,
  parseInvoiceLineAsDefect,
  prepareInvoice,
  readTimestamp,
  recordAuditEvent
} from "../src/lesson.js"

describe("Lesson 03: creating effects", () => {
  it.effect("uses succeed and fail for pure success and expected validation failure", () =>
    Effect.gen(function* () {
      const draft = yield* makeDraftInvoice("  Ada Lovelace  ")

      assert.deepStrictEqual(draft, {
        customerName: "Ada Lovelace",
        status: "draft"
      })

      const error = yield* Effect.flip(makeDraftInvoice("   "))

      assert.strictEqual(error._tag, "EmptyCustomerName")
      assert.strictEqual(error.input, "   ")
    })
  )

  it.effect("uses sync for synchronous work that should be lazy", () =>
    Effect.gen(function* () {
      const events: Array<AuditEvent> = []
      const event: AuditEvent = {
        type: "invoice-started",
        customerName: "Grace Hopper",
        at: "2026-06-26T00:00:00.000Z"
      }
      const program = recordAuditEvent(event, (recorded) => {
        events.push(recorded)
      })

      assert.deepStrictEqual(events, [])

      yield* program

      assert.deepStrictEqual(events, [event])
    })
  )

  it.effect("uses sync for synchronous values that must be captured at run time", () =>
    Effect.gen(function* () {
      const createdAtIso = yield* readTimestamp(() => new Date("2026-06-26T10:30:00.000Z"))

      assert.strictEqual(createdAtIso, "2026-06-26T10:30:00.000Z")
    })
  )

  it.effect("uses promise for async work that is expected to resolve", () =>
    Effect.gen(function* () {
      const dueDays = yield* loadStandardPaymentTerms(() => Promise.resolve(30))

      assert.strictEqual(dueDays, 30)
    })
  )

  it.effect("uses try to map thrown synchronous errors into the error channel", () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(parseInvoiceLine("{not json"))

      assert.strictEqual(error._tag, "InvalidInvoiceLine")
      assert.strictEqual(error.input, "{not json")
    })
  )

  it.effect("shows that thrown work inside sync becomes a defect instead of E", () =>
    Effect.gen(function* () {
      const exit = yield* Effect.exit(parseInvoiceLineAsDefect("{not json"))

      assert.isTrue(Exit.isFailure(exit))

      if (Exit.isFailure(exit)) {
        assert.isTrue(Cause.isDie(exit.cause))
      }
    })
  )

  it.effect("uses tryPromise to map rejected promises into the error channel", () =>
    Effect.gen(function* () {
      const program = loadTaxRate(() => Promise.reject(new Error("tax service offline")))
      const error = yield* Effect.flip(program)

      assert.strictEqual(error._tag, "TaxRateUnavailable")
    })
  )

  it.effect("composes constructor choices into a small invoice workflow", () =>
    Effect.gen(function* () {
      const events: Array<AuditEvent> = []
      const summary = yield* prepareInvoice(
        "  Katherine Johnson  ",
        JSON.stringify({
          description: "Notebook",
          quantity: 2,
          unitPriceCents: 1250
        }),
        () => new Date("2026-06-26T12:00:00.000Z"),
        (event) => {
          events.push(event)
        },
        () => Promise.resolve(14),
        () => Promise.resolve(0.08)
      )

      assert.deepStrictEqual(summary, {
        customerName: "Katherine Johnson",
        createdAtIso: "2026-06-26T12:00:00.000Z",
        dueDays: 14,
        line: {
          description: "Notebook",
          quantity: 2,
          unitPriceCents: 1250
        },
        subtotalCents: 2500,
        taxCents: 200,
        totalCents: 2700
      })
      assert.deepStrictEqual(events, [
        {
          type: "invoice-started",
          customerName: "Katherine Johnson",
          at: "2026-06-26T12:00:00.000Z"
        }
      ])
    })
  )
})
