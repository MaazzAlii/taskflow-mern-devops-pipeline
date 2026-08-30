# Deployment & Recovery Guide — TaskFlow

> **Handoff Reference:** Detailed, reproducible instructions for deploying, updating, and disaster-recovering the TaskFlow production infrastructure on AWS EC2.

---

## 🚀 1. Initial Infrastructure Setup

1. **Provision EC2 Host:** Launch an Ubuntu 22.04 LTS instance with 20GB GP3 storage and allocate an Elastic IP per [`docs/ec2-provisioning-guide.md`](file:///docs/ec2-provisioning-guide.md).
2. **Execute Host Hardening:** SSH into instance and run the setup script:
   ```bash
   chmod +x scripts/setup-ec2.sh && ./scripts/setup-ec2.sh
   ```
3. **Configure Environment Secrets:** Create `/home/ubuntu/taskflow/.env` with production credentials per [`docs/environment-variables.md`](file:///docs/environment-variables.md).
4. **GHCR Authentication:** Log host Docker into GHCR using a fine-scoped PAT (`read:packages`):
   ```bash
   echo "<PAT_TOKEN>" | docker login ghcr.io -u MaazzAlii --password-stdin
   ```

---

## 🔄 2. Automated CD Pipeline Deployment

Every commit pushed to the `main` branch triggers:
1. GitHub Actions CI validation (Lint, Test, Build).
2. Docker build & publish to GHCR (`ghcr.io/maazzalii/taskflow-backend:latest` & `ghcr.io/maazzalii/taskflow-frontend:latest`).
3. SSH deployment action executing:
   ```bash
   cd ~/taskflow
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d --remove-orphans
   docker system prune -f
   ```

---

## 🆘 3. Manual Handoff & Disaster Recovery

If the EC2 host needs to be completely rebuilt:
1. Re-run `scripts/setup-ec2.sh` on a fresh EC2 instance.
2. Restore `/home/ubuntu/taskflow/.env` secrets from GitHub Actions Secrets.
3. Pull production compose file and launch containers:
   ```bash
   cd ~/taskflow
   curl -O https://raw.githubusercontent.com/MaazzAlii/taskflow-mern-devops-pipeline/main/docker-compose.prod.yml
   docker compose -f docker-compose.prod.yml up -d
   ```
