# Environment Variables & Configuration Guide — TaskFlow

> **Security Mandate:** Never commit real production secrets, connection strings, or private keys to source control. `.env` files are gitignored across all project services.

---

## 📋 Comprehensive Variable Reference Matrix

| Variable | Used By | Required In | Example Value | Production Setting Location |
|----------|---------|-------------|---------------|-----------------------------|
| `PORT` | Backend (`server.js`) | Local, Prod | `5000` | Docker Compose / EC2 `.env` |
| `NODE_ENV` | Backend (`app.js`, `db.js`) | Local, CI, Prod | `production` | Dockerfile / Docker Compose |
| `MONGO_URI` | Backend (`db.js`) | Local, Prod | `mongodb+srv://user:pass@cluster.mongodb.net/taskflow` | AWS EC2 `.env` / GitHub Actions Secret |
| `JWT_SECRET` | Backend (`token.js`, `authController.js`) | Local, Prod | `complex_random_secret_string_32_chars` | AWS EC2 `.env` / GitHub Actions Secret |
| `JWT_EXPIRES_IN` | Backend (`token.js`) | Local, Prod | `7d` | Docker Compose / EC2 `.env` |
| `CORS_ORIGIN` | Backend (`app.js`) | Local, Prod | `http://ec2-xx-xx-xx-xx.compute.amazonaws.com` | Docker Compose / EC2 `.env` |
| `VITE_API_BASE_URL` | Frontend (`client.js`) | Local, Build | `/api` (or `http://localhost:5000/api`) | Dockerfile.frontend build arg / `.env` |

---

## 🔒 Secret Auditing Verification
Git history was verified via `git log --all --full-history -- .env` to guarantee no `.env` file containing secrets was ever committed.
