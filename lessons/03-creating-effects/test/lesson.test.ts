import { Cause, Effect, Exit } from "effect"
import { describe, expect, it } from "vitest"

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
  it("uses succeed and fail for pure success and expected validation failure", () => {
    expect(Effect.runSync(makeDraftInvoice("  Ada Lovelace  "))).toEqual({
      customerName: "Ada Lovelace",
      status: "draft"
    })

    const error = Effect.runSync(Effect.flip(makeDraftInvoice("   ")))

    expect(error).toMatchObject({
      _tag: "EmptyCustomerName",
      input: "   "
    })
  })

  it("uses sync for synchronous work that should be lazy", () => {
    const events: Array<AuditEvent> = []
    const event: AuditEvent = {
      type: "invoice-started",
      customerName: "Grace Hopper",
      at: "2026-06-26T00:00:00.000Z"
    }
    const program = recordAuditEvent(event, (recorded) => {
      events.push(recorded)
    })

    expect(events).toEqual([])

    Effect.runSync(program)

    expect(events).toEqual([event])
  })

  it("uses sync for synchronous values that must be captured at run time", () => {
    const program = readTimestamp(() => new Date("2026-06-26T10:30:00.000Z"))

    expect(Effect.runSync(program)).toBe("2026-06-26T10:30:00.000Z")
  })

  it("uses promise for async work that is expected to resolve", async () => {
    const program = loadStandardPaymentTerms(() => Promise.resolve(30))

    await expect(Effect.runPromise(program)).resolves.toBe(30)
  })

  it("uses try to map thrown synchronous errors into the error channel", () => {
    const error = Effect.runSync(Effect.flip(parseInvoiceLine("{not json")))

    expect(error).toMatchObject({
      _tag: "InvalidInvoiceLine",
      input: "{not json"
    })
  })

  it("shows that thrown work inside sync becomes a defect instead of E", () => {
    const exit = Effect.runSyncExit(parseInvoiceLineAsDefect("{not json"))

    expect(Exit.isFailure(exit)).toBe(true)

    if (Exit.isFailure(exit)) {
      expect(Cause.isDie(exit.cause)).toBe(true)
    }
  })

  it("uses tryPromise to map rejected promises into the error channel", async () => {
    const program = loadTaxRate(() => Promise.reject(new Error("tax service offline")))

    await expect(Effect.runPromise(Effect.flip(program))).resolves.toMatchObject({
      _tag: "TaxRateUnavailable"
    })
  })

  it("composes constructor choices into a small invoice workflow", async () => {
    const events: Array<AuditEvent> = []
    const program = prepareInvoice(
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

    await expect(Effect.runPromise(program)).resolves.toEqual({
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
    expect(events).toEqual([
      {
        type: "invoice-started",
        customerName: "Katherine Johnson",
        at: "2026-06-26T12:00:00.000Z"
      }
    ])
  })
})
