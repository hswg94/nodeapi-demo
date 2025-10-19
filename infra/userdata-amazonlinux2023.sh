#!/bin/bash
# cloud-init user-data for Amazon Linux 2023 to deploy nodeapi-demo via Docker
# - Installs Docker with dnf
# - Logs into your container registry
# - Pulls the image and runs it as a systemd service
# - Maps host port 80 -> container port 3000

set -euo pipefail

# ---------------------------
# REQUIRED: fill these values
# ---------------------------
# Example for GitLab Container Registry
# REGISTRY_HOST="registry.gitlab.com"
# IMAGE_NAME="registry.gitlab.com/<group>/<project>/nodeapi-demo"
# IMAGE_TAG="latest"  # consider an immutable tag (commit SHA) for prod
# REGISTRY_USER="<deploy-username-or-token>"
# REGISTRY_PASSWORD="<deploy-password-or-token>"

REGISTRY_HOST="registry.gitlab.com"            # change if using another registry
IMAGE_NAME="registry.gitlab.com/REPLACE_GROUP/REPLACE_PROJECT/nodeapi-demo"  # <-- change this
IMAGE_TAG="latest"                             # use immutable SHA for prod if desired
REGISTRY_USER="REPLACE_USERNAME_OR_TOKEN"      # <-- change this (use deploy token/user)
REGISTRY_PASSWORD="REPLACE_PASSWORD_OR_TOKEN"  # <-- change this (store in Secrets Manager ideally)

# ---------------------------
# Install Docker (Amazon Linux 2023)
# ---------------------------
dnf -y update
dnf -y install docker
systemctl enable --now docker

# Optional: allow ec2-user to run docker without sudo
if id ec2-user &>/dev/null; then
  usermod -aG docker ec2-user || true
fi

# ---------------------------
# Log in to registry (avoid putting secrets in user-data for production)
# ---------------------------
echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_HOST" -u "$REGISTRY_USER" --password-stdin

# ---------------------------
# Create systemd service for the app
# ---------------------------
cat > /etc/systemd/system/nodeapi-demo.service <<'EOF'
[Unit]
Description=Node API Demo container
After=docker.service
Requires=docker.service

[Service]
Environment=IMAGE_NAME=__IMAGE_NAME__
Environment=IMAGE_TAG=__IMAGE_TAG__
Environment=PORT=3000
ExecStartPre=/usr/bin/docker pull ${IMAGE_NAME}:${IMAGE_TAG}
ExecStartPre=/usr/bin/docker rm -f nodeapi-demo || true
ExecStart=/usr/bin/docker run --name nodeapi-demo -p 80:3000 -e NODE_ENV=production -e PORT=${PORT} ${IMAGE_NAME}:${IMAGE_TAG}
ExecStop=/usr/bin/docker stop -t 10 nodeapi-demo
ExecStopPost=/usr/bin/docker rm -f nodeapi-demo
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sed -i "s#__IMAGE_NAME__#${IMAGE_NAME}#g" /etc/systemd/system/nodeapi-demo.service
sed -i "s#__IMAGE_TAG__#${IMAGE_TAG}#g" /etc/systemd/system/nodeapi-demo.service

systemctl daemon-reload
systemctl enable --now nodeapi-demo

echo "Deployment complete. App should be reachable on http://<EC2_PUBLIC_IP>/ (port 80 -> container 3000)."
echo "Ensure your EC2 security group allows inbound TCP 80."
