# Contributing

## Commit messages

This repository uses [Conventional Commits](https://www.conventionalcommits.org/). Commit
messages are linted by `commitlint` via a Husky `commit-msg` hook — a non-conforming message is
rejected at commit time.

Format:

```text
type(scope): short description
```

Allowed types:

| Type       | Use for                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | A new backward-compatible feature                   |
| `fix`      | A bug fix                                           |
| `refactor` | Internal code restructuring without behavior change |
| `perf`     | Performance improvement                             |
| `test`     | Test-only changes                                   |
| `docs`     | Documentation-only changes                          |
| `style`    | Formatting or non-functional style changes          |
| `build`    | Build-system or dependency changes                  |
| `ci`       | CI/CD changes                                       |
| `chore`    | Maintenance tasks                                   |
| `revert`   | Reverting an earlier commit                         |

Examples:

```text
feat(policies): add cross-LOB policy filtering
fix(auth): preserve session after token refresh
refactor(layout): separate MCA wrapper from dashboard layout
test(policies): cover policy detail navigation
chore(deps): update frontend dependencies
```

### Breaking changes

Mark a breaking change with `!` after the type/scope, or a `BREAKING CHANGE:` footer (or both):

```text
feat(api)!: change policy response contract
```

```text
fix(auth): remove legacy session cookie fallback

BREAKING CHANGE: clients relying on the legacy session cookie must migrate to the token-based flow.
```

## How commit type maps to a version bump

See [RELEASING.md](./RELEASING.md) for the full release process. In short:

- Any `feat` since the last release → at least a **MINOR** bump.
- Any `!`/`BREAKING CHANGE` since the last release → a **MAJOR** bump.
- Otherwise (`fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`)
  → a **PATCH** bump.

## Workflow

1. Create a feature branch off `main`.
2. Make changes using Conventional Commit messages.
3. Run local validation (`npm run validate`) before opening a PR.
4. Open a pull request; CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit/component/e2e
   tests, and a production build.
5. Merge into `main` once approved — see `.claude/rules/code-review.md` for review requirements
   (PRs touching auth, entitlements, PII handling, payments, or shared design-system code require
   a second human reviewer).

This repository also follows the AI-development contract in [CLAUDE.md](./CLAUDE.md) and the
rules under `.claude/rules/` — read those before making a change.
