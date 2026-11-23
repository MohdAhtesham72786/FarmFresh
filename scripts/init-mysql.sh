#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MYSQL_BIN="${MYSQL_BIN:-mysql}"

if [[ -z "${MYSQL_ROOT_PASSWORD:-}" ]]; then
  echo "Set your local MySQL root password, then run again:"
  echo "  export MYSQL_ROOT_PASSWORD='your-root-password'"
  echo "  ./scripts/init-mysql.sh"
  exit 1
fi

echo "Creating databases and farmer user..."
"$MYSQL_BIN" -u root -p"$MYSQL_ROOT_PASSWORD" < "$ROOT_DIR/database/setup-local.sql"

echo "Applying table schema..."
"$MYSQL_BIN" -u root -p"$MYSQL_ROOT_PASSWORD" < "$ROOT_DIR/database/schema.sql"

echo "Done. Backend .env should use:"
echo "  DATABASE_URL=mysql+pymysql://farmer:farmer@127.0.0.1:3306/farmer_cart"