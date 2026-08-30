# TaskFlow — MERN + Docker + CI/CD + AWS EC2

> A full-stack MERN (MongoDB, Express, React, Node.js) task and board management application, containerized with Docker, featuring an automated GitHub Actions CI/CD pipeline deployed to AWS EC2 with Nginx reverse proxying and SSL security.

---

## 📌 Project Overview
**TaskFlow** is designed to satisfy the core DevOps Essentials workflow:
- 🐳 **Dockerization:** Multi-stage Docker builds for backend and frontend React apps.
- ⚙️ **CI/CD Pipeline:** Automated GitHub Actions workflows for linting, testing, image building, and automated deployment via GHCR to AWS EC2.
- 🔒 **Security & Production Hardening:** httpOnly JWT auth, Nginx reverse proxying, CORS policy, non-root Docker execution.

---

## 🛠️ Architecture & Tech Stack
- **Frontend:** React + Vite, TailwindCSS / Custom Glassmorphism CSS, Nginx (production)
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB (Atlas production / containerized local)
- **Authentication:** JWT, httpOnly cookies
- **Container Registry:** GitHub Container Registry (GHCR)
- **CI/CD:** GitHub Actions
- **Cloud Infrastructure:** AWS EC2 (Ubuntu 22.04 LTS)

---

## 🚀 Getting Started
*Detailed setup instructions, environment variables, local Docker Compose setup, and deployment guides will be documented as each milestone completes.*
