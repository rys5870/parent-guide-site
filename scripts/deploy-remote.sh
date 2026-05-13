#!/usr/bin/env bash
# רץ על השרת (דרך SSH מ־GitHub Actions או ידנית).
# מתקין Docker ו־Compose בפעם הראשונה, מבצע login ל-GHCR (אופציונלי), משך תמונה ומרים שירותים.
#
# כתיבת הפעלה: מהתיקייה שבה יושבים הקבצים (לא חובת נתיב קבוע):
#   cd /path/with/compose && bash scripts/deploy-remote.sh

set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

INSTALL_DIR="${INSTALL_DIR:-}"
if [[ -z "$INSTALL_DIR" ]]; then
  INSTALL_DIR="$(pwd -P)"
fi

if [[ "$(id -u)" -eq 0 ]]; then
  echo "הרץ כמשתמש רגיל עם sudo לפי הצורך, לא כ-root ישיר."
  exit 1
fi

cd "$INSTALL_DIR"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "חסר $COMPOSE_FILE בתיקייה $INSTALL_DIR (הפעילו מתוך אותה תיקייה או הגדירו INSTALL_DIR)."
  exit 1
fi

set -a
if [[ -f .env ]]; then
  # shellcheck disable=SC1091
  source ".env"
fi
set +a

if ! command -v docker >/dev/null 2>&1; then
  echo "🐋 מתקין Docker (פעם ראשונה)…"
  curl -fsSL https://get.docker.com | sudo sh
  sudo systemctl enable docker || true
  sudo systemctl start docker || true
  sudo usermod -aG docker "$(whoami)" || true
  echo "⚠️  לאחר ההתקנה הראשונה, מומלץ להתחבר ל־SSH מחדש אם הפקודה docker לא עובדת בלי sudo."
fi

compose_ok() {
  docker compose version >/dev/null 2>&1 ||
    sudo docker compose version >/dev/null 2>&1
}

if ! compose_ok; then
  echo "📦 מתקין docker-compose-plugin…"
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y docker-compose-plugin
  else
    echo "לא נמצאה apt-get — התקינו בעצמכם את Docker Compose plugin v2."
    exit 1
  fi
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_PREFIX=(docker compose)
elif sudo docker compose version >/dev/null 2>&1; then
  COMPOSE_PREFIX=(sudo docker compose)
else
  echo "Docker Compose לא זמין"
  exit 1
fi

if [[ -n "${GHCR_TOKEN:-}" && -n "${GHCR_USERNAME:-}" ]]; then
  echo "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin 2>/dev/null ||
    echo "${GHCR_TOKEN}" | sudo docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin
fi

if [[ -z "${APP_IMAGE:-}" ]]; then
  echo "חסר APP_IMAGE: קובץ .env בשורש הפריסה צריך לכלול APP_IMAGE=ghcr.io/..."
  exit 1
fi

if [[ ! -f .env.prod ]]; then
  echo "חסר .env.prod (סודות אפליקציה)."
  exit 1
fi

"${COMPOSE_PREFIX[@]}" --env-file .env.prod -f "$COMPOSE_FILE" pull
"${COMPOSE_PREFIX[@]}" --env-file .env.prod -f "$COMPOSE_FILE" up -d --remove-orphans

"${COMPOSE_PREFIX[@]}" --env-file .env.prod -f "$COMPOSE_FILE" ps
echo "✅ סיום. Nginx מתווך HTTP על פורט 80 אל האפליקציה."
