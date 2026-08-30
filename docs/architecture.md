# TaskFlow Architecture & Data Flow — Documentation

> **Overview:** Comprehensive technical architecture, request lifecycles, and CI/CD pipeline workflows for the TaskFlow containerized MERN application.

---

## 🏗️ System Architecture & Request Lifecycle

```text
                                  +---------------------------------------+
                                  |            Client Browser             |
                                  +---------------------------------------+
                                                      |
                                       HTTPS (Port 443) / HTTP (Port 80)
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     Host Nginx / Reverse Proxy        |
                                  +---------------------------------------+
                                                      |
                                                      | Reverse Proxy (/api/*)
                                                      v
                                  +---------------------------------------+
                                  |   Frontend Container (Nginx SPA Host) |
                                  |       Serves React App Assets         |
                                  +---------------------------------------+
                                                      |
                                          Internal Bridge Network
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     Backend Container (Express.js)    |
                                  |    JWT Auth & REST API Controllers    |
                                  +---------------------------------------+
                                                      |
                                         Encrypted TLS Connection
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |      Database (MongoDB Atlas)         |
                                  |     User / Board / Task Schemas       |
                                  +---------------------------------------+
```

---

## 🔄 CI/CD Continuous Delivery Lifecycle Workflow

```text
 +---------------------+         +---------------------+         +---------------------+
 |   Developer Push    | ------> |  GitHub Actions CI  | ------> |   Build Docker Image|
 |     (git push)      |         | (Lint, Test, Build) |         |  & Publish to GHCR  |
 +---------------------+         +---------------------+         +---------------------+
                                                                            |
                                                                            v
 +---------------------+         +---------------------+         +---------------------+
 | Production Verified | <------ | Pull & Redeploy via | <------ |  SSH Deploy Trigger |
 |   App Serving Live  |         |   docker compose    |         |    (appleboy/ssh)   |
 +---------------------+         +---------------------+         +---------------------+
```

---

## ⚙️ Component Responsibilities

1. **Frontend Container (`taskflow-frontend`):** Serves built React SPA and handles client-side routing via Nginx fallback (`try_files $uri /index.html`).
2. **Backend Container (`taskflow-backend`):** Express REST API executing under `USER node`, providing authentication (JWT in `httpOnly` cookie), input validation (Zod), and business logic.
3. **Database (`MongoDB Atlas`):** Fully managed cloud database housing persistent user profiles, workspace boards, and task items.
4. **CI/CD Pipeline (`GitHub Actions`):** Automated validation (ESLint, Jest, Vitest) and image publishing to GitHub Container Registry (GHCR).
