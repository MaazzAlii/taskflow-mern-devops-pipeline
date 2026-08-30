#!/bin/bash
# ==============================================================================
# TaskFlow Production EC2 Setup & Server Hardening Script
# ==============================================================================
# Run on fresh Ubuntu 22.04 LTS instance as 'ubuntu' user:
# chmod +x setup-ec2.sh && ./setup-ec2.sh

set -e

echo "=== [1/6] Updating System Packages ==="
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw

echo "=== [2/6] Installing Docker & Docker Compose ==="
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== [3/6] Configuring Non-Root Docker Access ==="
sudo usermod -aG docker ubuntu

echo "=== [4/6] Configuring UFW Firewall ==="
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

echo "=== [5/6] Creating Deployment Directory ==="
mkdir -p /home/ubuntu/taskflow

echo "=== [6/6] EC2 Environment Ready ==="
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker compose version)"
echo "UFW Firewall Status:"
sudo ufw status verbose
