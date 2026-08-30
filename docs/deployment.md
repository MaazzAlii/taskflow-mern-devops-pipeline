# Deployment & Recovery Guide — TaskFlow

> **Handoff Reference:** Detailed, reproducible instructions for deploying, updating, and disaster-recovering the TaskFlow production infrastructure on Google Cloud Platform (GCP) or AWS EC2.

---

## 1. Cloud Host Setup (GCP Compute Engine / AWS EC2)

### Option A: GCP Compute Engine (Always Free Tier — Recommended)
1. **Provision `e2-micro` Instance:** Create an `e2-micro` VM in `us-central1-a` with 30GB `pd-standard` disk and static IP per [`docs/gcp-provisioning-guide.md`](file:///docs/gcp-provisioning-guide.md).
2. **Execute Host Hardening & Swap Setup:**
   ```bash
   chmod +x scripts/setup-gcp-vm.sh && ./scripts/setup-gcp-vm.sh
   ```
3. **Configure Environment Secrets:** Create `~/taskflow/.env` with production credentials per [`docs/environment-variables.md`](file:///docs/environment-variables.md).

### Option B: AWS EC2 Instance
1. **Provision EC2 Instance:** Launch an Ubuntu 22.04 LTS instance with 20GB GP3 storage and Elastic IP per [`docs/ec2-provisioning-guide.md`](file:///docs/ec2-provisioning-guide.md).
2. **Execute Host Hardening:**
   ```bash
   chmod +x scripts/setup-ec2.sh && ./scripts/setup-ec2.sh
   ```

---

## 2. Automated CD Pipeline Deployment

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

## 3. Manual Handoff & Disaster Recovery

If the VM host needs to be completely rebuilt:
1. Re-run `scripts/setup-gcp-vm.sh` (or `setup-ec2.sh`) on a fresh cloud instance.
2. Restore `~/taskflow/.env` secrets.
3. Pull production compose file and launch containers:
   ```bash
   cd ~/taskflow
   curl -O https://raw.githubusercontent.com/MaazzAlii/taskflow-mern-devops-pipeline/main/docker-compose.prod.yml
   docker compose -f docker-compose.prod.yml up -d
   ```
