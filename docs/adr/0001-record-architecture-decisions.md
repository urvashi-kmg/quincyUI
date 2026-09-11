# ADR 0001: Record architecture decisions

## Status
Accepted

## Context
Quincy-UI's `CLAUDE.md` defines a set of approval gates (new shared constant/token, new
dependency, public contract changes, routing/auth changes, new global state, disabling a
lint/security/a11y rule). Each of these decisions needs a durable record beyond the PR that made
it, since PR history is hard to search by decision later.

## Decision
Every time an approval gate in `CLAUDE.md` is exercised, add a numbered ADR to `docs/adr/`
following this template: Status, Context, Decision, Consequences. Link the ADR from the PR
description that implements it.

## Consequences
Onboarding and audit both get a single, chronological place to see why a shared contract exists,
at the cost of one extra short file per approved exception.
