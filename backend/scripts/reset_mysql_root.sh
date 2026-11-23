#!/usr/bin/env bash
# Resets local MySQL root password to admin123 (dev only), then bootstraps FarmFresh schema.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
MYSQL="${MYSQL_BIN:-/usr/local/bin/mysql}"
MYSQLD_SAFE="$(command -v mysqld_safe || echo /usr/local/opt/mysql/bin/mysqld_safe)"
NEW_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-admin123}"

echo "Stopping MySQL..."
brew services stop mysql 2>/dev/null || true
killall mysqld 2>/dev/null || true
sleep 2

echo "Starting MySQL in skip-grant mode..."
"$MYSQLD_SAFE" --skip-grant-tables --skip-networking &
SAFE_PID=$!
sleep 5

echo "Setting root password to: $NEW_ROOT_PASSWORD"
"$MYSQL" -u root <<SQL
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${NEW_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
SQL

kill "$SAFE_PID" 2>/dev/null || killall mysqld 2>/dev/null || true
sleep 2

echo "Starting MySQL normally..."
brew services start mysql
sleep 4

export MYSQL_ROOT_PASSWORD="$NEW_ROOT_PASSWORD"
python3 "$ROOT_DIR/backend/scripts/bootstrap_mysql.py"

echo ""
echo "=== FarmFresh MySQL credentials (save these) ==="
echo "MySQL Workbench (root):     user=root           password=$NEW_ROOT_PASSWORD"
echo "MySQL Workbench (app):    user=admin          password=admin123"
echo "Database:                   farmer_cart"
echo "Admin website login:      user=admin          password=admin123"
echo "Backend .env DATABASE_URL: mysql+pymysql://admin:admin123@127.0.0.1:3306/farmer_cart"