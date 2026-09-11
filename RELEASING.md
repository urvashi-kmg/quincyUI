# Releasing

Quincy-UI is a single, private frontend application versioned manually with
[Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), Conventional Commits (see
[CONTRIBUTING.md](./CONTRIBUTING.md)), and annotated Git tags (`vMAJOR.MINOR.PATCH`).

## Version source of truth

The `"version"` field in [package.json](./package.json) is the single source of truth. The
application does not currently display or expose its version in the UI or via an API, so there is
nothing else to keep in sync. If that changes in the future, expose it from this same value at
build time (e.g. via `import.meta.env` injected from `package.json`) rather than hardcoding a
version string a second place.

## Semantic Versioning rules

- **MAJOR** — breaking changes or incompatible public behavior changes.
- **MINOR** — backward-compatible features.
- **PATCH** — backward-compatible bug fixes, refactoring, documentation, and maintenance changes.

Determine the bump from the Conventional Commit types merged since the last tag:

```bash
git log <last-tag>..HEAD --oneline
```

- Any commit with `!` or a `BREAKING CHANGE:` footer → **MAJOR**.
- Else, any `feat` commit → **MINOR**.
- Else → **PATCH**.

## Release checklist

Do not create a release tag until every step below is done and shown, not assumed:

1. **Confirm state.** Show current branch, `git status`, and confirm the working tree is clean (or
   explain what remains). Confirm the release branch (`main`) and the remote (`origin`).
2. **Identify the release commit.** Confirm the exact commit on `main` being released.
3. **Validate.**
   - `npm ci`
   - `npm run format:check`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:coverage`
   - `npm run test:ct` (requires `npx playwright install --with-deps chromium` once per machine)
   - `npm run test:e2e` (requires `npx playwright install --with-deps` once per machine)
   - `npm run build`
   - All must pass with real, shown output before continuing.
4. **Determine the next version** from the commit log per the rules above.
5. **Update `package.json`** `"version"` field (and let `package-lock.json` pick up the same
   version via `npm install --package-lock-only` or a normal install — do not hand-edit the
   lockfile).
6. **Update `CHANGELOG.md`**: move `[Unreleased]` entries into a new `## [X.Y.Z] - YYYY-MM-DD`
   section, grouped into `Added` / `Changed` / `Fixed` / `Removed` / `Deprecated` / `Security`.
   Only include entries backed by actual merged commits — no speculative entries.
7. **Commit** the version bump and changelog update, e.g. `chore(release): vX.Y.Z`.
8. **Tag.** Create an **annotated** tag once 1–7 are done:
   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   ```
9. **Push** the commit, then the tag — **only after explicit confirmation each time**. Never
   force-push, delete, or move a tag/branch.
   ```bash
   git push origin main
   git push origin vX.Y.Z
   ```
10. **Create/update the GitHub Release** from the pushed tag, using the corresponding
    `CHANGELOG.md` section as the release notes.
11. **Deploy** the verified `dist/` build produced from the tagged commit (see
    [deployment/README.md](./deployment/README.md)).
12. **Confirm the deployed version** matches the tag (e.g. via the deployed build's source map/
    Sentry release, which CI already tags from the commit SHA).

## Examples

| Change                          | Before   | After         |
| ------------------------------- | -------- | ------------- |
| Patch release (bug fix only)    | `v1.2.0` | `v1.2.1`      |
| Minor release (new feature)     | `v1.2.1` | `v1.3.0`      |
| Major release (breaking change) | `v1.3.0` | `v2.0.0`      |
| Pre-release                     | —        | `v2.0.0-rc.1` |

## Rollback

Because nothing here is automated, "rollback" means:

- **Before pushing the tag:** if validation fails, fix the issue and restart the checklist. Nothing
  external has changed yet.
- **After the tag is pushed:** never delete or force-move the tag. Ship a corrective release
  instead (e.g. `v1.2.2` fixing what `v1.2.1` broke), following this same checklist.
- **After deployment:** roll back at the hosting layer to the previously deployed tagged build;
  do not repurpose a tag to point at different code.

## Safety rules (always)

- Never force-push.
- Never delete or rewrite an existing branch or tag.
- Never rewrite commit history on `main`.
- Never push a commit or tag without explicit, per-operation confirmation from the developer.
