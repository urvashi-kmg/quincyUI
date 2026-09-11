---
name: security
description: Prevent common client-side security failures in Quincy-UI — secrets, XSS, PII handling, and dependency risk.
---

# Frontend Security Skill

## Purpose
Prevent common client-side security failures given Quincy-UI handles policyholder data.

## Rules
- Never commit or expose secrets; never put anything sensitive behind a `VITE_*` variable.
- Treat all external input (API responses, route params, user input) as untrusted.
- Avoid unsafe HTML injection; `dangerouslySetInnerHTML` requires a reviewed sanitizer.
- Do not store sensitive credentials/tokens in `localStorage`/`sessionStorage` unless explicitly
  approved by the security architecture.
- Do not trust client-side authorization checks (`src/auth`) as the security boundary — they are
  UX only.
- Minimize sensitive data sent to the client, to Sentry, and to any third-party tool; scrub PII in
  `src/lib/sentry.ts` `beforeSend`.
- Review new dependencies for supply-chain and maintenance risk before installing; verify the
  package name, publisher, and maintenance status.
- Preserve CSP/security-header expectations defined in `deployment/`.
- Use safe, generic user-facing error messages; keep stack traces and internal URLs out of
  production UI.
