# AWS EC2 Server Hardening & Environment Setup Guide — TaskFlow

> **Security & Execution Reference:** Complete steps to harden the production Ubuntu 22.04 LTS host and prepare it for automated CD deployments.

---

## Hardening & Security Checklist

1. **System Updates:**
   - Run `sudo apt update && sudo apt upgrade -y` to patch kernel and system libraries.

2. **UFW Firewall Rule Enforcements:**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Docker Group Scoping:**
   - Execute `sudo usermod -aG docker ubuntu` so deployment tasks run without requiring `sudo`.

4. **GHCR Host Authentication:**
   ```bash
   echo "<PAT_WITH_READ_PACKAGES_SCOPE>" | docker login ghcr.io -u MaazzAlii --password-stdin
   ```

5. **Production `.env` Configuration (`/home/ubuntu/taskflow/.env`):**
   ```ini
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://taskflow_prod_user:<PASSWORD>@taskflow-cluster.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=super_secret_production_jwt_key_998877665544332211
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://<ELASTIC_IP>
   ```

---

## MongoDB Atlas Configuration

- **Database User:** Dedicated read/write user for `taskflow` database.
- **Network Access Rule:** Set to allowed EC2 Elastic IP address (or `0.0.0.0/0` with strong password authentication).
