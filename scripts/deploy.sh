#!/usr/bin/env bash
set -euo pipefail

IMAGE_REF="${1:-logitrack:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-logitrack-production}"
PORT="${PORT:-3000}"

docker pull "$IMAGE_REF" 2>/dev/null || true
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER_NAME" -p "${PORT}:3000" "$IMAGE_REF"

echo "Started $CONTAINER_NAME with $IMAGE_REF"
