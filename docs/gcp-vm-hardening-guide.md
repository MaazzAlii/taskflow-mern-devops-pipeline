# GCP VM Server Hardening & Docker Setup Guide — TaskFlow

> **Security & Execution Reference:** Complete steps to harden the production Ubuntu 22.04 LTS GCP `e2-micro` host and prepare it for automated CD deployments.

---

## GCP VM Hardening & RAM Safety Checklist

1. **Swap File Configuration (Crucial for 1GB RAM e2-micro):**
   ```bash
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **System Updates & Docker Group:**
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   sudo usermod -aG docker $USER
   ```

3. **UFW Host Firewall Rules:**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **GHCR Host Authentication:**
   ```bash
   echo "<PAT_WITH_READ_PACKAGES_SCOPE>" | docker login ghcr.io -u MaazzAlii --password-stdin
   ```

5. **Production Environment File (`~/taskflow/.env`):**
   ```ini
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://taskflow_prod_user:<PASSWORD>@taskflow-cluster.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=super_secret_production_jwt_key_998877665544332211
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://<GCP_STATIC_IP>
   ```
