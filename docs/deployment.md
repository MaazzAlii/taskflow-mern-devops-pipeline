# Container Registry & Deployment Architecture — TaskFlow

> **Overview:** Production deployment utilizes GitHub Container Registry (GHCR) to store and manage immutable container images, orchestrated on AWS EC2 via automated GitHub Actions CD.

---

## 📦 Container Registry Configuration (GHCR)

- **Registry Domain:** `ghcr.io`
- **Owner Account:** `MaazzAlii`
- **Authentication:** `GITHUB_TOKEN` in GitHub Actions (`packages: write`)
- **Host Authentication (EC2):** Fine-scoped Personal Access Token (PAT) with `read:packages` permission.

### Image Naming Convention

| Component | GHCR Image Reference | Tag Strategy |
|-----------|----------------------|--------------|
| **Backend Service** | `ghcr.io/maazzalii/taskflow-backend` | `:latest`, `:${{ github.sha }}` |
| **Frontend Service** | `ghcr.io/maazzalii/taskflow-frontend` | `:latest`, `:${{ github.sha }}` |

---

## 🔒 Security & Visibility

1. **Package Visibility:** Managed as Private packages under `MaazzAlii` GitHub account.
2. **Access Control:** Production EC2 host pulls container images using `read:packages` PAT stored securely in host environment (`~/.docker/config.json`).
