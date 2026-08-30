# TaskFlow — Containerized MERN Task Management Platform & DevOps Pipeline

[![CI Pipeline](https://github.com/MaazzAlii/taskflow-mern-devops-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/MaazzAlii/taskflow-mern-devops-pipeline/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-blue.svg)](https://www.docker.com/)

> **TaskFlow** is an enterprise-ready full-stack MERN (MongoDB, Express, React, Node.js) board and task management application backed by a complete production DevOps pipeline including multi-stage Dockerization, GitHub Actions CI/CD, GHCR container registry publishing, host security hardening, and Cloud VM deployment (GCP Compute Engine Always Free / AWS EC2).

---

## Key Application Features

- **Secure JWT Authentication:** Cookie-based session handling with `httpOnly`, `sameSite`, and password hashing via bcryptjs.
- **Workspace Board Management:** Create, view, and delete project workspaces with cascaded task cleanup.
- **Interactive Task Tracker:** Dynamic task creation, real-time status transitions (`To Do` -> `In Progress` -> `Done`), inline editing, and status filtering.
- **Glassmorphism UI:** Premium dark-mode user interface built with modern CSS tokens, responsive layout scale, and micro-animations.
- **Centralized Resilience:** Zod schema validation, global error handling middleware, AppError handling, and input sanitization.

---

## Technology Stack & Architecture

```text
  +-----------------------+        +-----------------------+        +-----------------------+
  |    React 18 + Vite    | -----> | Express + Node.js API | -----> |   MongoDB Atlas / DB  |
  | (Nginx Container SPA) |        | (Non-Root Node Image) |        |  (User/Board/Task)    |
  +-----------------------+        +-----------------------+        +-----------------------+
```

- **Frontend:** React 18, Vite, React Router v6, Axios, Vanilla CSS Glassmorphism
- **Backend:** Node.js v20, Express.js, Mongoose, JWT, bcryptjs, Helmet, Cors, Zod, Rate-Limit
- **DevOps & Infrastructure:** Docker (Multi-stage), Docker Compose, Nginx, GitHub Actions (CI/CD), GHCR, GCP Compute Engine (`e2-micro` Always Free) / AWS EC2, UFW Firewall

---

## Local Development Quickstart

### Prerequisites
- [Node.js v20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/MaazzAlii/taskflow-mern-devops-pipeline.git
cd taskflow-mern-devops-pipeline

# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Run via Docker Compose (Recommended)
```bash
docker compose up --build -d
```
- **Frontend App:** `http://localhost:8080`
- **Backend API:** `http://localhost:5000`
- **API Healthcheck:** `http://localhost:8080/api/health`

---

## Testing Suite Execution

### Backend Tests (Jest + In-Memory MongoDB)
```bash
cd backend
npm test
```
*Executes 35 integration & unit tests across schemas, auth, controllers, and error handling.*

### Frontend Tests (Vitest + React Testing Library)
```bash
cd frontend
npm test
```
*Executes component tests covering auth screens, form validation, and board management.*

---

## CI/CD & Deployment Pipeline Architecture

```text
 +---------------------+         +---------------------+         +---------------------+
 |   git push main     | ------> |  GitHub Actions CI  | ------> |   Publish to GHCR   |
 | (Feature Commit)    |         | (Lint, Test, Build) |         | (Backend & Frontend)|
 +---------------------+         +---------------------+         +---------------------+
                                                                            |
                                                                            v
 +---------------------+         +---------------------+         +---------------------+
 | Cloud Production VM | <------ | Docker Compose Pull | <------ | SSH Deploy Trigger  |
 |  (GCP / AWS Host)   |         | & Container Restart |         |   (appleboy/ssh)    |
 +---------------------+         +---------------------+         +---------------------+
```

---

## Technical Documentation Index

- [`docs/architecture.md`](file:///docs/architecture.md) — System request flow & container orchestration diagram
- [`docs/environment-variables.md`](file:///docs/environment-variables.md) — Environment variable reference matrix
- [`docs/local-docker-verification.md`](file:///docs/local-docker-verification.md) — Local multi-container verification report
- [`docs/gcp-provisioning-guide.md`](file:///docs/gcp-provisioning-guide.md) — GCP Compute Engine `e2-micro` launch & firewall guide
- [`docs/gcp-vm-hardening-guide.md`](file:///docs/gcp-vm-hardening-guide.md) — GCP VM hardening & swap optimization script
- [`docs/ec2-provisioning-guide.md`](file:///docs/ec2-provisioning-guide.md) — AWS EC2 launch & security group specs
- [`docs/ec2-hardening-guide.md`](file:///docs/ec2-hardening-guide.md) — AWS EC2 server hardening & UFW setup script
- [`docs/deployment.md`](file:///docs/deployment.md) — GHCR container registry & CD deployment guide
- [`docs/security-checklist.md`](file:///docs/security-checklist.md) — Production security audit checklist
- [`docs/ssl-domain-guide.md`](file:///docs/ssl-domain-guide.md) — Custom domain & Let's Encrypt SSL guide

---

## License
Distributed under the MIT License. See `LICENSE` for details.
