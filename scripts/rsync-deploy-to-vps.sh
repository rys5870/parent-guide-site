#!/usr/bin/env bash
# העתקת מניפסטים לשרת.
# ברירת מחדל: ~/parent-guide-site אצל משתמש ה־SSH (לא נדרש /opt ולא תיקיית קומיט בריפו).
# אופציונלי: משתנה ריפו ב-GitHub — DEPLOY_REMOTE_DIR (מתעד בסוף ההודעה).

set -euo pipefail

PORT="${DEPLOY_PORT:-22}"
DST="${DEPLOY_USER}@${DEPLOY_HOST}"
SSH=(ssh -i ~/.ssh/deploy_key -p "$PORT" -o StrictHostKeyChecking=yes "$DST")
SCP=(scp -i ~/.ssh/deploy_key -P "$PORT" -o StrictHostKeyChecking=yes)

RDIR="${DEPLOY_REMOTE_DIR:-}"
if [[ -z "$RDIR" ]]; then
  RDIR=$("${SSH[@]}" bash -lc 'printf "%s/parent-guide-site" "$HOME"')
fi

"${SSH[@]}" bash -lc "mkdir -p \"${RDIR}/nginx\" \"${RDIR}/scripts\""

"${SCP[@]}" docker-compose.prod.yml "$DST:${RDIR}/docker-compose.prod.yml"
"${SCP[@]}" nginx/default.conf "$DST:${RDIR}/nginx/default.conf"
"${SCP[@]}" scripts/deploy-remote.sh "$DST:${RDIR}/scripts/deploy-remote.sh"
"${SCP[@]}" /tmp/stack.env "$DST:${RDIR}/.env"
"${SCP[@]}" /tmp/.env.prod "$DST:${RDIR}/.env.prod"

"${SSH[@]}" chmod +x "${RDIR}/scripts/deploy-remote.sh"
"${SSH[@]}" bash -lc "cd \"${RDIR}\" && ln -sf scripts/deploy-remote.sh deploy-remote.sh"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  echo "REMOTE_DEPLOY_DIR=${RDIR}" >> "$GITHUB_ENV"
fi
