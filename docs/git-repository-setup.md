# Git Repository Architecture & Branching Strategy — TaskFlow

> **Repository Governance:** Standards for branch protection, commit conventions, and repository structure.

---

## Commit Message Conventions

All commits follow the Conventional Commits specification:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat:` | New feature implementation | `feat: implement JWT-based authentication` |
| `fix:` | Bug fix | `fix: resolve CORS credentials header misconfiguration` |
| `docs:` | Documentation update | `docs: document environment variable matrix` |
| `test:` | Adding or modifying tests | `test: complete backend test suite with in-memory MongoDB` |
| `chore:` | Maintenance tasks | `chore: initialize project structure and planning docs` |
| `build:` | Build system or container edits | `build: add production Dockerfile for backend service` |
| `ci:` | CI/CD pipeline changes | `ci: add GitHub Actions workflow for lint, test, and build` |

---

## Branching & Protection Policy

- **Main Branch (`main`):** Production-ready code only. All commits deployed via CD workflow.
- **Pull Request Rules:** Requires CI checks to pass prior to merge.
