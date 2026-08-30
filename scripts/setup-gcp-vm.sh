#!/bin/bash
# ==============================================================================
# TaskFlow Production GCP Compute Engine (e2-micro) Setup & Hardening Script
# ==============================================================================
# Run on fresh Ubuntu 22.04 LTS GCP VM instance as default or deploy user:
# chmod +x setup-gcp-vm.sh && ./setup-gcp-vm.sh

set -e

echo "=== [1/7] Adding 1GB Swap File for Memory Safety (e2-micro RAM optimization) ==="
if [ ! -f /swapfile ]; then
  sudo fallocate -l 1G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "Swap file created successfully."
else
  echo "Swap file already exists."
fi

echo "=== [2/7] Updating System Packages ==="
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw

echo "=== [3/7] Installing Docker Engine & Compose Plugin ==="
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== [4/7] Configuring Non-Root Docker Access ==="
sudo usermod -aG docker $USER

echo "=== [5/7] Configuring Host UFW Firewall ==="
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

echo "=== [6/7] Creating Deployment Directory ==="
mkdir -p ~/taskflow

echo "=== [7/7] GCP VM Environment Ready ==="
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker compose version)"
echo "Free Memory Status:"
free -h
echo "UFW Firewall Status:"
sudo ufw status verbose
