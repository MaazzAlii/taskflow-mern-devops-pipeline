# GCP Compute Engine Provisioning Guide (Always Free e2-micro) — TaskFlow

> **Infrastructure Spec:** Automated deployment host configuration for TaskFlow production environment using Google Cloud Platform's Always Free tier allowance.

---

## Always Free Tier Constraints

To ensure $0 perpetual hosting costs, the VM must adhere to the following limits:

| Requirement | Always Free Limit Spec | Implementation Value |
|-------------|-----------------------|----------------------|
| **Machine Type** | 1 `e2-micro` instance per billing account | `e2-micro` (2 vCPU, 1 GB RAM) |
| **Region / Zone** | `us-west1`, `us-central1`, or `us-east1` | `us-central1-a` |
| **Boot Disk** | 30 GB `pd-standard` (Standard persistent disk) | 30 GB `pd-standard` Ubuntu 22.04 LTS |
| **Network Tier** | Standard Network Tier | `--network-tier=STANDARD` |
| **Static IP** | Regional Static External IP | `taskflow-ip` reserved in `us-central1` |

---

## gcloud CLI Provisioning Steps

```bash
# 1. Enable Compute Engine API
gcloud services enable compute.googleapis.com

# 2. Create Firewall Rule for SSH (Restricted to your Admin IP)
gcloud compute firewall-rules create allow-ssh-myip \
  --network=default --direction=INGRESS --action=ALLOW \
  --rules=tcp:22 --source-ranges=<YOUR_ADMIN_IP>/32 \
  --target-tags=taskflow-server

# 3. Create Firewall Rule for HTTP & HTTPS
gcloud compute firewall-rules create allow-http-https \
  --network=default --direction=INGRESS --action=ALLOW \
  --rules=tcp:80,tcp:443 --source-ranges=0.0.0.0/0 \
  --target-tags=taskflow-server

# 4. Reserve Static External IP Address
gcloud compute addresses create taskflow-ip --region=us-central1

# 5. Provision e2-micro VM Instance
gcloud compute instances create taskflow-prod \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB --boot-disk-type=pd-standard \
  --network-tier=STANDARD \
  --address=taskflow-ip \
  --tags=taskflow-server

# 6. Test SSH Connectivity
gcloud compute ssh taskflow-prod --zone=us-central1-a
```

---

## GitHub Actions SSH Key Metadata Injection

To allow GitHub Actions CD workflow to SSH into the GCP VM safely without manual interactive login:

```bash
# 1. Generate dedicated ED25519 deployment SSH key pair
ssh-keygen -t ed25519 -f gh-actions-key -C "github-actions-deploy" -N ""

# 2. Register public key with instance metadata for 'deploy' user
gcloud compute instances add-metadata taskflow-prod --zone=us-central1-a \
  --metadata-from-file ssh-keys=<(echo "deploy:$(cat gh-actions-key.pub)")
```
