import { Data, Effect } from "effect"

export class EmptyCustomerName extends Data.TaggedError("EmptyCustomerName")<{
  readonly input: string
}> {}

export class InvalidInvoiceLine extends Data.TaggedError("InvalidInvoiceLine")<{
  readonly input: string
  readonly cause: unknown
}> {}

export class TaxRateUnavailable extends Data.TaggedError("TaxRateUnavailable")<{
  readonly cause: unknown
}> {}

export interface InvoiceDraft {
  readonly customerName: string
  readonly status: "draft"
}

export interface InvoiceLine {
  readonly description: string
  readonly quantity: number
  readonly unitPriceCents: number
}

interface InvoiceLineShape {
  readonly description?: unknown
  readonly quantity?: unknown
  readonly unitPriceCents?: unknown
}

export interface AuditEvent {
  readonly type: "invoice-started"
  readonly customerName: string
  readonly at: string
}

export interface InvoiceSummary {
  readonly customerName: string
  readonly createdAtIso: string
  readonly dueDays: number
  readonly line: InvoiceLine
  readonly subtotalCents: number
  readonly taxCents: number
  readonly totalCents: number
}

export type PrepareInvoiceError = EmptyCustomerName | InvalidInvoiceLine | TaxRateUnavailable

export const makeDraftInvoice = (
  customerName: string
): Effect.Effect<InvoiceDraft, EmptyCustomerName, never> => {
  const normalized = customerName.trim()

  if (normalized === "") {
    return Effect.fail(new EmptyCustomerName({ input: customerName }))
  }

  return Effect.succeed({
    customerName: normalized,
    status: "draft"
  })
}

export const readTimestamp = (now: () => Date): Effect.Effect<string, never, never> =>
  Effect.sync(() => now().toISOString())

export const recordAuditEvent = (
  event: AuditEvent,
  record: (event: AuditEvent) => void
): Effect.Effect<void, never, never> =>
  Effect.sync(() => {
    record(event)
  })

export const loadStandardPaymentTerms = (
  loadDueDays: () => Promise<number>
): Effect.Effect<number, never, never> => Effect.promise(() => loadDueDays())

export const parseInvoiceLine = (
  input: string
): Effect.Effect<InvoiceLine, InvalidInvoiceLine, never> =>
  Effect.try({
    try: () => {
      const parsed: unknown = JSON.parse(input)

      return invoiceLineFromUnknown(parsed)
    },
    catch: (cause) => new InvalidInvoiceLine({ input, cause })
  })

export const parseInvoiceLineAsDefect = (input: string): Effect.Effect<unknown, never, never> =>
  Effect.sync((): unknown => JSON.parse(input))

export const loadTaxRate = (
  loadRate: () => Promise<number>
): Effect.Effect<number, TaxRateUnavailable, never> =>
  Effect.tryPromise({
    try: () => loadRate(),
    catch: (cause) => new TaxRateUnavailable({ cause })
  })

export const prepareInvoice = (
  customerName: string,
  lineJson: string,
  now: () => Date,
  record: (event: AuditEvent) => void,
  loadDueDays: () => Promise<number>,
  loadRate: () => Promise<number>
): Effect.Effect<InvoiceSummary, PrepareInvoiceError, never> =>
  Effect.gen(function* () {
    const draft = yield* makeDraftInvoice(customerName)
    const createdAtIso = yield* readTimestamp(now)

    yield* recordAuditEvent(
      {
        type: "invoice-started",
        customerName: draft.customerName,
        at: createdAtIso
      },
      record
    )

    const dueDays = yield* loadStandardPaymentTerms(loadDueDays)
    const line = yield* parseInvoiceLine(lineJson)
    const taxRate = yield* loadTaxRate(loadRate)
    const subtotalCents = line.quantity * line.unitPriceCents
    const taxCents = Math.round(subtotalCents * taxRate)

    return {
      customerName: draft.customerName,
      createdAtIso,
      dueDays,
      line,
      subtotalCents,
      taxCents,
      totalCents: subtotalCents + taxCents
    }
  })

const invoiceLineFromUnknown = (value: unknown): InvoiceLine => {
  if (!isInvoiceLineShape(value)) {
    throw new Error("invoice line must be an object")
  }

  const description = value.description
  const quantity = value.quantity
  const unitPriceCents = value.unitPriceCents

  if (typeof description !== "string" || description.trim() === "") {
    throw new Error("description must be a non-empty string")
  }

  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("quantity must be a positive integer")
  }

  if (
    typeof unitPriceCents !== "number" ||
    !Number.isInteger(unitPriceCents) ||
    unitPriceCents < 0
  ) {
    throw new Error("unitPriceCents must be a non-negative integer")
  }

  return {
    description: description.trim(),
    quantity,
    unitPriceCents
  }
}

const isInvoiceLineShape = (value: unknown): value is InvoiceLineShape =>
  typeof value === "object" && value !== null && !Array.isArray(value)
