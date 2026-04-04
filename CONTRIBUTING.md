# Contributing

## Development Workflow

```bash
pnpm install
pnpm test:watch   # tests in watch mode
pnpm build        # build to dist/
```

## Branch Strategy

- `main` — stable, tagged releases only
- `develop` — active development
- `feat/*` — new features, branch off `develop`
- `fix/*` — bug fixes, branch off `develop`
- `chore/*` — tooling/infra, branch off `develop`

All PRs target `develop`. Releases merge `develop → main`.

## Commit Convention

```
feat: add processQuery support
fix: correct RETURN_CODE mapping for error 34
chore: update tsup to v8
docs: add JSDoc for EsnekPosClient
test: add coverage for AuthenticationError
refactor: extract response normalizer
feat!: rename pay3D params (breaking)
```

The `!` suffix triggers a major version bump via changesets.

## Adding a Changeset

Every PR that changes user-facing behavior needs a changeset:

```bash
pnpm changeset
```

Select the change type (`patch` / `minor` / `major`) and write a one-line summary.
Changesets are committed alongside the PR. CHANGELOG is generated automatically on release.

## Pull Request

1. Open an issue first (or pick an existing one)
2. Branch off `develop`: `git checkout -b feat/issue-N-short-description`
3. Write code + tests (100% coverage target)
4. `pnpm typecheck && pnpm lint && pnpm test`
5. Add a changeset if user-facing
6. Open PR to `develop`, fill in the template, link the issue

## Code Standards

- TypeScript strict mode — no `any`
- JSDoc on every public class, method, and interface (`@param`, `@returns`, `@throws`, `@example`)
- No `console.log` in library code
- PCI-DSS: card numbers and CVV must never appear in logs or error messages
