# Current Task

## Preserve suggested venue table counts — READY FOR HUMAN UAT

When a user suggests a venue with three tables, persist three tables in the
Supabase submission payload and in either local-storage fallback. The form's
numeric `tableCount` field is the existing input contract.

### Acceptance

- One-table and three-table suggestions retain their counts in Supabase inserts.
- The existing missing-count default remains one for the Supabase payload.
- With no configured backend or a returned backend error, local storage retains
  the submitted count and previously saved suggestions.
- The focused regression fails on the existing mismatch before the repair and
  passes afterward; lint and the production build pass.
- No live backend is used for automated validation.

### Scope

Repair the submission-service field mapping and add focused regression coverage.
Keep the form, database schema, venue data, native wrappers and other user flows
unchanged. This is separate from the mobile safe-area work in issue #3.

### Validation

Use Node's built-in test runner for this small service regression, with an isolated
module context, an in-memory Supabase client and browser-storage stub. It requires
no new dependency or application-facing injection seam. The broader Vitest/React
Testing Library setup remains outside this repair.

- `npm test`
- `npm run lint`
- `npm run build`

Results on this repair:

- Before the field-name fix: five regressions passed and two failed because the
  three-table Supabase payload contained one table.
- After the fix: all seven regressions pass; lint and production build pass.
- Independent review reproduced both the baseline failure and repaired pass and
  found no actionable issue.
- The Node VM-module test harness emits Node's experimental-feature warning.
- The repository has no configured GitHub Actions workflows; local checks are
  not represented as remote CI acceptance.

Human UAT: in an approved test build with a stub or test backend, submit a clearly
labelled venue with three tables and inspect the stored count. Repeat with one
table and with the backend unavailable. Real phone acceptance remains pending.
