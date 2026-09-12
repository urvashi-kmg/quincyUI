---
name: api-service-server
description: Keep Quincy-UI's Axios/services network boundary consistent, typed, and secure.
---

# API / Service-Server Skill

## Purpose

Keep network boundaries consistent and secure across `src/services/**`.

## Rules

- All endpoint definitions/calls belong in `src/services/**`, built on the shared Axios instance
  (`apiClient`) in `src/lib/axiosClient.ts`. This is the only place `axios` may be imported.
- Components, hooks, and Redux slices call a service function or a `createAsyncThunk` that wraps
  one — never raw `fetch`/`axios`.
- Reuse existing service functions, the shared Axios instance, and its interceptors (auth header
  injection, error normalization) rather than creating parallel HTTP setups.
- Define explicit request/response TypeScript types in `src/types` (if shared) or colocated with
  the service (if feature-specific).
- Handle loading, success, empty, partial, and error states in every consumer.
- Never expose server-only secrets in the browser bundle — nothing behind `VITE_*` may be
  sensitive.
- Do not log request bodies, auth headers, or sensitive response payloads.
- Do not create a new service function when an existing one already covers the endpoint; extend
  its parameters instead.
- When an API contract changes, update every consumer — service, slice, component, MSW mock, and
  tests — in the same change.
