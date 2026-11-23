#!/usr/bin/env bash
# One-time fix: reset Oracle MySQL root, create admin + farmer_cart (matches backend/.env).
# Requires sudo (Oracle MySQL runs as LaunchDaemon com.oracle.oss.mysql.mysqld).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MYSQL="${MYSQL_BIN:-/usr/local/mysql/bin/mysql}"
MYSQLD_SAFE="/usr/local/mysql/bin/mysqld_safe"
PLIST="/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist"
NEW_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-admin123}"

if [[ ! -x "$MYSQL" ]]; then
  echo "Oracle MySQL client not found at $MYSQL"
  echo "If you use Homebrew only, see CREDENTIALS.md (Homebrew reset) instead."
  exit 1
fi

echo "Stopping Homebrew MySQL (avoids socket conflicts)..."
brew services stop mysql 2>/dev/null || true

echo "Stopping Oracle MySQL (sudo required)..."
if [[ -f "$PLIST" ]]; then
  sudo launchctl bootout system "$PLIST" 2>/dev/null || true
fi
sudo killall mysqld 2>/dev/null || true
sleep 3

if pgrep -x mysqld >/dev/null 2>&1; then
  echo "mysqld is still running. Stop it from System Settings or run: sudo killall mysqld"
  exit 1
fi

echo "Starting mysqld with --skip-grant-tables..."
sudo "$MYSQLD_SAFE" \
  --datadir=/usr/local/mysql/data \
  --skip-grant-tables \
  --skip-networking &
SAFE_PID=$!
sleep 6

echo "Setting root password to: $NEW_ROOT_PASSWORD"
sudo "$MYSQL" -u root <<SQL
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${NEW_ROOT_PASSWORD}';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '${NEW_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SQL

echo "Stopping skip-grant mysqld..."
sudo kill "$SAFE_PID" 2>/dev/null || sudo killall mysqld 2>/dev/null || true
sleep 3

echo "Starting Oracle MySQL normally..."
sudo launchctl bootstrap system "$PLIST" 2>/dev/null || sudo /usr/local/mysql/support-files/mysql.server start
sleep 4

export MYSQL_ROOT_PASSWORD="$NEW_ROOT_PASSWORD"
export MYSQL_BIN="$MYSQL"
python3 "$ROOT_DIR/backend/scripts/bootstrap_mysql.py"

echo ""
echo "=== Done ==="
echo "Workbench (app):  host=127.0.0.1  user=admin  password=admin123  schema=farmer_cart"
echo "Workbench (root): user=root  password=$NEW_ROOT_PASSWORD"