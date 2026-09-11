# Quote cancellation

**Not yet implemented.** Cancellation touches customer-facing contractual state
and is an approval-gated area (`.claude/rules/code-review.md`: changes touching
customer data handling need two reviewers).

Before implementing, confirm:

- which roles may cancel (see `src/auth/utils/permissions.ts` — a new permission
  is likely needed, which is itself an approval gate)
- whether cancellation is reversible, and for how long
- required reason codes, and whether a free-text reason is captured
- what the customer is shown and whether any notification is sent
- the exact API contract, including the error cases

`isCancellable()` in `../utils/quoteStatus.ts` already encodes which statuses
are eligible; extend that rather than re-deriving the condition here.
