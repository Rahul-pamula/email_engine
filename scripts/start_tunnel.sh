#!/usr/bin/env bash
# ============================================================
# scripts/start_tunnel.sh
# Persistent SSH reverse tunnel: VPS:8000 → local:8000
#
# Usage:
#   chmod +x scripts/start_tunnel.sh
#   ./scripts/start_tunnel.sh user@yourdomain.com
#
# Or set VPS_USER and VPS_HOST as env vars and call with no args:
#   VPS_USER=ubuntu VPS_HOST=yourdomain.com ./scripts/start_tunnel.sh
# ============================================================

set -euo pipefail

VPS="${1:-${VPS_USER:-ubuntu}@${VPS_HOST:-yourdomain.com}}"
LOCAL_PORT=8000
REMOTE_PORT=8000
RECONNECT_DELAY=5

echo "==================================================="
echo "  SSH Reverse Tunnel"
echo "  Local  → 127.0.0.1:${LOCAL_PORT}"
echo "  Remote → ${VPS}:${REMOTE_PORT}"
echo "  Auto-reconnects every ${RECONNECT_DELAY}s on failure"
echo "  Press Ctrl-C to stop"
echo "==================================================="

trap 'echo ""; echo "[Tunnel] Stopped."; exit 0' INT TERM

while true; do
    echo "[Tunnel] Connecting to ${VPS}..."
    ssh \
        -N \
        -o ExitOnForwardFailure=yes \
        -o ServerAliveInterval=30 \
        -o ServerAliveCountMax=3 \
        -o ConnectTimeout=10 \
        -o StrictHostKeyChecking=accept-new \
        -R "127.0.0.1:${REMOTE_PORT}:127.0.0.1:${LOCAL_PORT}" \
        "${VPS}" \
    || true  # don't exit on SSH failure — we want to reconnect

    echo "[Tunnel] Disconnected. Reconnecting in ${RECONNECT_DELAY}s..."
    sleep "${RECONNECT_DELAY}"
done
