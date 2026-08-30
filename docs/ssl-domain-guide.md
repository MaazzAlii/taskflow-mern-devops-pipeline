# Domain Name & Let's Encrypt SSL/TLS Configuration Guide — TaskFlow

> **Overview:** Instructions for configuring custom domain DNS, terminating HTTPS via Let's Encrypt (Certbot), and enforcing HTTP-to-HTTPS 301 redirection in production.

---

## 1. DNS A-Record Configuration

Point your custom domain's `A` record at the AWS EC2 Elastic IP address:

| Host / Subdomain | Type | Target Value | TTL |
|------------------|------|--------------|-----|
| `@` (or `taskflow`) | `A` | `<AWS_EC2_ELASTIC_IP>` | 300 |

---

## 2. Certbot SSL Certificate Provisioning

Run Certbot on the EC2 host:

```bash
# Install Certbot & Nginx plugin
sudo apt-get update -y
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain and install SSL Certificate automatically
sudo certbot --nginx -d taskflow.yourdomain.com --non-interactive --agree-tos -m admin@yourdomain.com
```

---

## 3. Nginx HTTPS & SSL Hardening Config (`/etc/nginx/sites-available/default`)

```nginx
server {
    listen 80;
    server_name taskflow.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taskflow.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/taskflow.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taskflow.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 4. Auto-Renewal Verification

Verify Let's Encrypt automatic certificate renewal:

```bash
sudo certbot renew --dry-run
```
