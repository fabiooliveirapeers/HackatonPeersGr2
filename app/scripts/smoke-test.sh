#!/usr/bin/env bash
set -euo pipefail

IMAGE_REF="${1:-logitrack:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-logitrack-smoke}"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER_NAME" -p 3000:3000 "$IMAGE_REF"

for attempt in {1..20}; do
  if curl --fail --silent http://127.0.0.1:3000/health | grep -q '"status":"ok"'; then
    echo "Smoke test passed"
    exit 0
  fi
  sleep 2
done

echo "Smoke test failed" >&2
exit 1
