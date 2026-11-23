# FarmFresh — credentials (development)

Use the same **admin / admin123** everywhere below (matches `backend/.env`).

## MySQL Workbench

| Purpose | Host | Port | Username | Password | Default schema |
|---------|------|------|----------|----------|----------------|
| **First-time setup (root)** | `127.0.0.1` | `3306` | `root` | *Your machine’s root password* (see reset below) | *(empty)* |
| **Daily use (app DB)** | `127.0.0.1` | `3306` | `admin` | `admin123` | `farmer_cart` |

### First-time database setup in Workbench

1. Connect as **root** (after root password is known or reset to `admin123`).
2. **File → Open SQL Script** → `database/complete-setup.sql`
3. **Execute** (⚡).

## Backend (`backend/.env`)

```env
DATABASE_URL=mysql+pymysql://admin:admin123@127.0.0.1:3306/farmer_cart
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@farmfresh.local
```

## Admin website

- URL: http://localhost:5173/admin/login
- **Username:** `admin`
- **Password:** `admin123`

## Why Workbench shows `admin` access denied

On this Mac, **port 3306** is served by **Oracle MySQL 8.0** (`/usr/local/mysql`), not Homebrew. The app user **`admin` does not exist** until you run `database/complete-setup.sql` as **root**. `admin123` in `backend/.env` is correct for the app; it is not created automatically.

If you also installed **Homebrew MySQL**, stop it so only one server uses `/tmp/mysql.sock`:

```bash
brew services stop mysql
```

## One-command setup (Oracle MySQL on macOS — recommended)

In **Terminal** (sudo = your Mac login password):

```bash
chmod +x scripts/reset-mysql-oracle-macos.sh
./scripts/reset-mysql-oracle-macos.sh
```

That resets **root** to `admin123`, runs `complete-setup.sql`, and creates **`admin` / `admin123`** + `farmer_cart`.

## Manual: root known, only need `admin`

1. Workbench → connect as **root** @ `127.0.0.1:3306`
2. **File → Open SQL Script** → `database/complete-setup.sql` → Execute (⚡)
3. New connection: **admin** / **admin123**, default schema **farmer_cart**

## Reset MySQL root (Homebrew only)

If `mysql --version` shows Homebrew **9.x** and nothing listens from `/usr/local/mysql`:

```bash
brew services stop mysql
killall mysqld 2>/dev/null || true
sleep 3
sudo /usr/local/opt/mysql/bin/mysqld_safe --skip-grant-tables --skip-networking &
sleep 6
/usr/local/bin/mysql -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123'; FLUSH PRIVILEGES;"
killall mysqld
sleep 2
brew services start mysql
export MYSQL_ROOT_PASSWORD=admin123
cd backend && python scripts/bootstrap_mysql.py
```