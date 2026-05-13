#!/usr/bin/env bash
set -euo pipefail

PORT="${DEPLOY_PORT:-22}"
DST="${DEPLOY_USER}@${DEPLOY_HOST}"
SSH=(ssh -i ~/.ssh/deploy_key -p "$PORT" -o StrictHostKeyChecking=yes "$DST")

REMOTE_DIR="${REMOTE_DEPLOY_DIR:?REMOTE_DEPLOY_DIR חסר (אמור להיווצר בשלב ההעלאה הקודם)}"

"${SSH[@]}" bash -s <<REMOTE
set -euo pipefail
export GHCR_USERNAME=$(printf '%q' "${GHCR_USERNAME:-}")
export GHCR_TOKEN=$(printf '%q' "${GHCR_TOKEN:-}")
cd $(printf '%q' "$REMOTE_DIR")
bash scripts/deploy-remote.sh
REMOTE
