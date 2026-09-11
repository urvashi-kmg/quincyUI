# Quote wizard steps

Each step of the quote wizard gets its own folder here (`01-applicant/`,
`02-coverage/`, …), containing the step component, its Yup schema, and its
tests.

**Not yet implemented.** The step sequence, per-step field sets, and validation
rules are business requirements that were not specified. Per Rule Zero
(`.claude/rules/clarification-protocol.md`), these were not guessed. Use
`docs/prompts/01-feature-implementation.md` and supply:

- the ordered list of steps and their titles
- the fields on each step, with types and required/optional status
- validation rules per field (Yup)
- whether steps can be revisited, and whether partial progress persists
- what happens on abandon

Conventions to follow when implementing:

- One Formik form per step, with a Yup schema colocated in the step folder.
- Wizard position and collected values live in `../stores/quotesSlice.ts`, not
  in component state, so a refresh can restore progress.
- Shared form controls come from `src/components/controls/form`, not new
  one-offs.
