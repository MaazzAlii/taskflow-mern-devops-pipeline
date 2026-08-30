# AWS EC2 Provisioning & Security Group Specification — TaskFlow

> **Infrastructure Spec:** Automated deployment host configuration for TaskFlow production environment.

---

## EC2 Instance Specifications

| Setting | Production Value | Description |
|---------|------------------|-------------|
| **Instance Name** | `taskflow-prod` | EC2 Resource Tag |
| **AMI** | Ubuntu Server 22.04 LTS (64-bit x86) | Standard LTS Linux image |
| **Instance Type** | `t3.micro` / `t2.micro` | AWS Free Tier eligible |
| **Storage** | 20 GiB GP3 Root Volume | Ensures capacity for Docker build/pull layers |
| **IP Allocation** | AWS Elastic IP (EIP) | Static public IP address |
| **Key Pair** | `taskflow-deploy-key.pem` | Stored securely outside Git repository |

---

## Security Group Rules (`taskflow-sg`)

| Type | Protocol | Port Range | Source / Destination | Purpose |
|------|----------|------------|----------------------|---------|
| **SSH** | TCP | `22` | `<YOUR_ADMIN_IP>/32` | Remote SSH access (Hardened) |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Public web app access |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | SSL/TLS encrypted traffic |

---

## AWS CLI Provisioning Script Template

```bash
# 1. Create Security Group
aws ec2 create-security-group \
  --group-name taskflow-sg \
  --description "Security group for TaskFlow production container host"

# 2. Add Inbound Rules
aws ec2 authorize-security-group-ingress --group-name taskflow-sg --protocol tcp --port 22 --cidr <YOUR_ADMIN_IP>/32
aws ec2 authorize-security-group-ingress --group-name taskflow-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name taskflow-sg --protocol tcp --port 443 --cidr 0.0.0.0/0

# 3. Launch EC2 Instance
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t3.micro \
  --key-name taskflow-deploy-key \
  --security-groups taskflow-sg \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=taskflow-prod}]'
```
