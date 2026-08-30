# Environment Variable Configuration Matrix — TaskFlow

> **Security Note:** `.env` files are strictly excluded from version control via `.gitignore`. Always use `.env.example` templates to configure new environments.

---

## Environment Variable Matrix

| Variable Name | Required | Default / Format | Description | Used In |
|---------------|----------|------------------|-------------|---------|
| `PORT` | Yes | `5000` | Backend Express server port | Backend |
| `NODE_ENV` | Yes | `development` / `production` | Node execution environment | Backend |
| `MONGO_URI` | Yes | `mongodb://...` | MongoDB connection string (Local container or Atlas) | Backend |
| `JWT_SECRET` | Yes | String | Secret key used for signing JWT auth tokens | Backend |
| `JWT_EXPIRES_IN` | Yes | `7d` | JWT token validity lifespan | Backend |
| `CORS_ORIGIN` | Yes | `http://localhost:8080` | Allowed client origin for CORS requests | Backend |
| `VITE_API_BASE_URL` | Yes | `/api` | Base URL for frontend Axios HTTP client | Frontend |

---

## Security Audit & Verification

Verified via `git log --all --full-history -- .env` that zero `.env` files containing production secrets have ever been committed to the repository history.
