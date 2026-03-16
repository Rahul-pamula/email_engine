#!/usr/bin/env bash
# ============================================================
# scripts/install_vps.sh
# One-shot VPS setup: installs nginx + certbot, deploys the
# email-engine nginx site config, then obtains a TLS cert.
#
# Run ON YOUR VPS (after copying the repo or just this script):
#   chmod +x install_vps.sh
#   sudo bash install_vps.sh yourdomain.com your@email.com
#
# Prerequisites:
#   • Ubuntu/Debian VPS with a public IP
#   • DNS A record for yourdomain.com → VPS IP (already propagated)
#   • Port 80 + 443 open in firewall / security group
# ============================================================

set -euo pipefail

DOMAIN="${1:?Usage: sudo bash install_vps.sh <domain> <email>}"
EMAIL="${2:?Usage: sudo bash install_vps.sh <domain> <email>}"
NGINX_CONF="/etc/nginx/sites-available/email-engine"
NGINX_LINK="/etc/nginx/sites-enabled/email-engine"

echo "==================================================="
echo "  Sh_R Mail — VPS Setup"
echo "  Domain : ${DOMAIN}"
echo "  Email  : ${EMAIL}"
echo "==================================================="

# ── 1. Packages ───────────────────────────────────────────
echo "[1/5] Installing nginx & certbot..."
apt-get update -q
apt-get install -y -q nginx certbot python3-certbot-nginx

# ── 2. Enable GatewayPorts for reverse tunnel ─────────────
echo "[2/5] Configuring sshd GatewayPorts=clientspecified..."
SSHD_CONF="/etc/ssh/sshd_config"
if ! grep -q "^GatewayPorts" "${SSHD_CONF}"; then
    echo "GatewayPorts clientspecified" >> "${SSHD_CONF}"
else
    sed -i 's/^GatewayPorts.*/GatewayPorts clientspecified/' "${SSHD_CONF}"
fi
systemctl reload sshd

# ── 3. Write nginx site ───────────────────────────────────
echo "[3/5] Writing nginx site config..."
cat > "${NGINX_CONF}" <<NGINX_EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location /track/ {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_buffering    off;
        proxy_connect_timeout 5s;
        proxy_read_timeout    10s;
    }

    location /health {
        proxy_pass         http://127.0.0.1:8000/health;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    location / {
        return 404;
    }
}
NGINX_EOF

# Enable site
if [ ! -L "${NGINX_LINK}" ]; then
    ln -s "${NGINX_CONF}" "${NGINX_LINK}"
fi

# Remove default site if it exists
[ -L /etc/nginx/sites-enabled/default ] && rm /etc/nginx/sites-enabled/default || true

nginx -t
systemctl reload nginx
echo "    ✅ Nginx running on port 80"

# ── 4. TLS via Let's Encrypt ──────────────────────────────
echo "[4/5] Obtaining TLS certificate for ${DOMAIN}..."
certbot --nginx -d "${DOMAIN}" --email "${EMAIL}" --agree-tos --non-interactive --redirect
echo "    ✅ HTTPS enabled"

# ── 5. Summary ────────────────────────────────────────────
echo ""
echo "==================================================="
echo "  ✅ VPS setup complete!"
echo ""
echo "  Next: On your LOCAL machine, run:"
echo "    ./scripts/start_tunnel.sh <user>@${DOMAIN}"
echo ""
echo "  Then update your local .env:"
echo "    API_URL=https://${DOMAIN}"
echo ""
echo "  And restart uvicorn + email_sender.py"
echo ""
echo "  Verify with:"
echo "    curl -I https://${DOMAIN}/health"
echo "==================================================="
