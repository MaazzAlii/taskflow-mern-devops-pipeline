# Vercel Deployment Guide — TaskFlow

This document describes how TaskFlow is configured for serverless deployment on **Vercel** (Hobby/Free plan), running the React SPA frontend alongside the Express backend adapted as a serverless function via `serverless-http`.

---

## 🏗️ Architecture Overview

- **Frontend:** React + Vite, built as a static site (`frontend/dist`) and served over Vercel's global CDN.
- **Backend:** Express API wrapped with `serverless-http` at `/api/index.js`, running as a Vercel Serverless Function on Node.js.
- **Database:** MongoDB Atlas (free tier) with connection pooling and cached connections across function warm starts.
- **Routing:** Orchestrated via `vercel.json` at the repository root:
  - `/api/(.*)` -> `/api/index.js` (Serverless API)
  - `/(.*)` -> `frontend/dist/$1` (Frontend SPA with client-side fallback)

---

## ⚙️ Vercel Environment Variables

Set the following environment variables in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable Name | Environment Scope | Example Value / Description |
| :--- | :--- | :--- |
| `MONGO_URI` | Production, Preview | `mongodb+srv://user:pass@cluster.mongodb.net/taskflow?retryWrites=true&w=majority` |
| `JWT_SECRET` | Production, Preview | `your-secure-production-jwt-secret-string` |
| `JWT_EXPIRES_IN` | Production, Preview | `7d` |
| `VITE_API_BASE_URL` | Production, Preview | `/api` |
| `NODE_ENV` | Production | `production` |

---

## 🔒 MongoDB Atlas Network Access Configuration

Because Vercel serverless function IPs dynamically change, set your MongoDB Atlas Network Access whitelist to:
- IP Access List Entry: `0.0.0.0/0` (Allow access from anywhere)

*Security Note:* Access is secured by strong database user credentials and TLS-encrypted connection strings stored securely in Vercel secrets.

---

## 🚀 Deployment Steps

1. **Connect Repository:** Import `https://github.com/MaazzAlii/taskflow-mern-devops-pipeline` into Vercel.
2. **Framework Preset:** Select **Other** (Vercel will detect `vercel.json`).
3. **Add Environment Variables:** Input `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `VITE_API_BASE_URL`.
4. **Deploy:** Click **Deploy**. Vercel will run the monorepo build and deploy both static assets and serverless routes.

---

## 🔄 CI/CD Automation

- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs linting, unit tests, and build smoke-tests on every push and pull request.
- **CD:** Vercel automatically deploys every push to `main` for Production and pull requests for Preview environments.
