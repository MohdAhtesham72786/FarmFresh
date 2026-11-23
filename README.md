# FarmFresh — Farmer Products Shopping Cart

Full-stack marketplace for farm produce: a **React** customer store and admin portal, a **Python FastAPI** REST API, and **MySQL 8**. This repository is a self-contained assessment project. A new developer should be able to clone it, start MySQL, run the API and UI, log in as admin, and complete a customer checkout.

**Stack:** React 18 · Vite · Tailwind CSS · FastAPI · SQLAlchemy 2 · JWT · MySQL 8 (InnoDB)

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Folder structure](#4-folder-structure)
5. [Environment configuration](#5-environment-configuration)
6. [Database setup](#6-database-setup)
   - [Seed commands](#seed-commands)
7. [Admin login credentials](#7-admin-login-credentials)
8. [Backend setup](#8-backend-setup)
9. [Frontend setup](#9-frontend-setup)
10. [Docker setup](#10-docker-setup)
11. [Application URLs](#11-application-urls)
12. [API documentation](#12-api-documentation)
13. [Application workflow](#13-application-workflow)
14. [Testing](#14-testing)
15. [Troubleshooting](#15-troubleshooting)
16. [Production deployment](#16-production-deployment)
17. [Assumptions](#17-assumptions)

---

## 1. Project overview

FarmFresh is a two-portal shopping system:

| Portal | Who | What they can do |
|--------|-----|------------------|
| **Admin** | Store operator | JWT login, product CRUD, image URL or file upload, activate/deactivate, stock updates, dashboard stats, view orders |
| **Customer** | Shopper (no login) | Browse active products, search, category filter, price range (client-side), product detail, wishlist, cart, checkout, order history for this browser session |

### Features implemented

- Secure admin login (bcrypt password + JWT)
- Product fields: name, category, farmer name, description, price, available quantity, image (URL or upload), status (active / inactive)
- Public catalog returns **active** products only
- Cart add / update / remove with stock ceilings
- Checkout with name, email, phone, shipping address
- Server-calculated grand total
- Stock decremented in a transaction (`SELECT … FOR UPDATE`) so quantity cannot go negative
- Session cart/orders keyed by `X-Session-Id` (UUID in `localStorage`)
- Optional 200-item demo catalog on API startup (`AUTO_SEED_CATALOG`)

### Technology stack

| Layer | Libraries / tools |
|-------|-------------------|
| Frontend | React 18.3, Vite 5, React Router 6, Axios, Tailwind CSS 3, Lucide icons |
| Backend | Python 3.11+ (tested on 3.12), FastAPI 0.115, Uvicorn, SQLAlchemy 2.0, Pydantic 2, python-jose, bcrypt |
| Database | MySQL 8, InnoDB, utf8mb4 |
| Migrations | Alembic revision `0001_initial` (optional; the API also creates missing tables on startup) |
| Tests | pytest (`backend/tests`) against `farmer_cart_test` |
| Containers | Docker Compose **MySQL only** — there is no application `Dockerfile` in this repo |

---

## 2. Architecture

```
Browser (localhost:5173)
        │  Vite proxies /api and /uploads
        ▼
FastAPI (uvicorn, default port 8000)
        │  SQLAlchemy + PyMySQL
        ▼
MySQL 8  farmer_cart   (app)
         farmer_cart_test (pytest)
```

- **Frontend** is a SPA. In development, Axios uses `VITE_API_BASE_URL=/api` and Vite forwards `/api` and `/uploads` to `VITE_PROXY_TARGET` (default `http://127.0.0.1:8000`).
- **Backend** is a single FastAPI app (`app.main:app`). CORS is restricted to `CORS_ORIGINS`. Admin routes require `Authorization: Bearer <jwt>`. Cart, wishlist, and checkout require `X-Session-Id`.
- **Database** holds admins, categories, products, carts, cart items, wishlist items, orders, and order items.
- **Docker** (this repo) runs **MySQL 8.0** with a named volume `mysqldata`. FastAPI and React are started locally with uvicorn and `npm run dev`.

---

## 3. Prerequisites

| Software | Notes |
|----------|--------|
| Python **3.11+** | 3.12 used in local tests |
| Node.js **18+** | Vite 5; npm is enough |
| MySQL **8.0** | Local install **or** Docker |
| Git | Clone the repository |
| Docker Desktop (optional) | Only required for Compose MySQL |

Confirm:

```bash
python3 --version
node --version
npm --version
docker --version   # optional
```

---

## 4. Folder structure

```
FarmFresh/
├── README.md
├── CREDENTIALS.md              Local MySQL/Workbench notes (machine-specific)
├── docker-compose.yml          MySQL 8 service only
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── main.py             FastAPI app, CORS, routers, /uploads
│   │   ├── config.py           Settings from .env
│   │   ├── database.py         Engine + sessions
│   │   ├── seed.py             create_all, admin seed, optional catalog
│   │   ├── catalog_data.py     Demo catalog (when AUTO_SEED_CATALOG=true)
│   │   ├── auth/               JWT + bcrypt
│   │   ├── models/             SQLAlchemy models
│   │   ├── schemas/            Pydantic request/response
│   │   ├── routers/            auth, products, catalog, cart, wishlist, orders
│   │   └── services/           Cart, session, categories, wishlist
│   ├── migrations/             Alembic (0001_initial)
│   ├── tests/                  pytest
│   ├── uploads/                Admin image uploads (gitignored except .gitkeep)
│   ├── scripts/                bootstrap_mysql.py, seed_db.sh
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                Axios client + API modules
│   │   ├── pages/              Admin + customer screens
│   │   ├── layouts/            CustomerLayout, AdminLayout
│   │   ├── context/            Cart, wishlist
│   │   └── components/
│   ├── vite.config.js          Dev proxy for /api and /uploads
│   ├── package.json
│   └── .env.example
├── database/
│   ├── complete-setup.sql      DBs + MySQL user + tables (run as root)
│   ├── schema.sql              Tables only
│   ├── seed.sql                Small SQL sample (optional)
│   └── setup-local.sql         DBs + MySQL user (no tables)
├── docs/
│   ├── API.md
│   └── screenshots/
└── scripts/
    └── init-mysql.sh           Applies setup-local.sql + schema.sql as root
```

---

## 5. Environment configuration

Copy examples. **Do not commit** real `.env` files (they are gitignored).

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend (`backend/.env`)

Values below are the **development defaults** from `backend/.env.example`. Treat them as demo-only. Production must use a unique JWT secret, a strong admin password, and `AUTO_SEED_CATALOG=false`.

| Variable | Development default (example file) | Description |
|----------|--------------------------------------|-------------|
| `DATABASE_URL` | `mysql+pymysql://admin:admin123@127.0.0.1:3306/farmer_cart` | SQLAlchemy URL: user `admin`, password `admin123`, host `127.0.0.1`, port `3306`, database `farmer_cart` |
| `SECRET_KEY` | `change-me-to-a-long-random-string-in-production` | JWT signing secret. Replace before any shared or production deploy |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Access token lifetime (8 hours) |
| `ADMIN_USERNAME` | `admin` | Username seeded on **first** API start if that user does not exist |
| `ADMIN_PASSWORD` | `admin123` | Password hashed into `admins` on first seed only |
| `ADMIN_EMAIL` | `admin@farmfresh.local` | Email stored on the seeded admin row |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed browser origins |
| `AUTO_SEED_CATALOG` | `true` | Local demo: insert/sync the ~200-item catalog on startup. Use `false` in production |

Code fallbacks (if a variable is omitted) live in `backend/app/config.py` (`database_url`, `secret_key`, `admin_*`, `cors_origins`). `auto_seed_catalog` defaults to `false` in code; the example `.env` sets it `true` for local demos.

### Frontend (`frontend/.env`)

| Variable | Development default | Description |
|----------|---------------------|-------------|
| `VITE_API_BASE_URL` | `/api` | Axios base URL. Keep `/api` in local Vite so the proxy is used |
| `VITE_PROXY_TARGET` | `http://127.0.0.1:8000` | Where Vite forwards `/api` and `/uploads`. Use `http://127.0.0.1:8001` if port 8000 is already taken |

Restart `npm run dev` after changing frontend env vars.

### MySQL (Docker Compose)

From `docker-compose.yml` (local container only):

| Setting | Value |
|---------|--------|
| Image | `mysql:8.0` |
| Root password | `root` |
| Database | `farmer_cart` |
| App user | `admin` |
| App password | `admin123` |
| Host / port (from the host) | `127.0.0.1:3306` |
| Volume | `mysqldata` → `/var/lib/mysql` |

These Compose values match `DATABASE_URL` in `backend/.env.example`.

---

## 6. Database setup

### Schema (tables and relationships)

| Table | Role |
|-------|------|
| `admins` | Operator accounts (username, email, bcrypt hash) |
| `categories` | Unique category names |
| `products` | Catalog; FK → `categories`; `CHECK (price > 0)`, `CHECK (available_quantity >= 0)`; unique `sku` |
| `carts` | One cart per `session_token` |
| `cart_items` | FK → `carts`, `products`; unique `(cart_id, product_id)` |
| `wishlist_items` | Unique `(session_token, product_id)` |
| `orders` | Checkout snapshot (customer fields, `grand_total`) |
| `order_items` | Line items; product FK `ON DELETE SET NULL` |

Scripts:

- `database/complete-setup.sql` — creates `farmer_cart` + `farmer_cart_test`, MySQL user `admin`, and tables
- `database/schema.sql` — tables only (`USE farmer_cart`)
- `backend/migrations/versions/0001_initial_schema.py` — Alembic equivalent of the initial schema (**does not** include `wishlist_items`; SQLAlchemy `create_all` on API start creates missing tables)

### Option A — Docker MySQL (recommended)

```bash
docker compose up -d mysql
```

First start runs `database/schema.sql` and `database/seed.sql` via `/docker-entrypoint-initdb.d` **only if the volume is empty**. Init scripts do not re-run after the volume exists.

### Option B — existing local MySQL (as root)

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p < database/complete-setup.sql
```

Or MySQL Workbench: connect as **root** → open `database/complete-setup.sql` → execute.

Helper (needs `MYSQL_ROOT_PASSWORD`):

```bash
export MYSQL_ROOT_PASSWORD='your-mysql-root-password'
cd backend && python scripts/bootstrap_mysql.py
```

`scripts/init-mysql.sh` applies `database/setup-local.sql` then `database/schema.sql` as root. Use the same `DATABASE_URL` as `.env.example` (`admin` / `admin123`). Ignore any leftover printed URL that does not match that file.

### Migrations (optional)

Startup already calls `Base.metadata.create_all`. Alembic is available if you want a versioned upgrade:

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

Alembic reads `DATABASE_URL` from `backend/.env` via `backend/migrations/env.py`.

### Seed commands

MySQL must be running and `backend/.env` must have a working `DATABASE_URL`. Seeding creates missing tables, inserts the admin user **if** that username is not already present, and (when catalog seed is on) syncs the ~200-item demo catalog.

**Recommended — Python (reads `ADMIN_*` and `AUTO_SEED_CATALOG` from `backend/.env`):**

```bash
cd backend
source .venv/bin/activate
python -m app.seed
```

Helper script (same command):

```bash
cd backend
chmod +x scripts/seed_db.sh
./scripts/seed_db.sh
```

Force the demo catalog even if `AUTO_SEED_CATALOG` is `false` in `.env`:

```bash
cd backend
source .venv/bin/activate
AUTO_SEED_CATALOG=true python -m app.seed
```

On every API start, `init_db()` runs the same steps automatically. Keep `AUTO_SEED_CATALOG=true` in local `.env` so `uvicorn` seeds the catalog on boot.

**Optional — small SQL sample** (a handful of products only; prefer `python -m app.seed` for the full demo catalog):

```bash
mysql -h 127.0.0.1 -u admin -padmin123 farmer_cart < database/seed.sql
```

Expected console output from the Python seed: `Database initialized.` Then log in as admin with `admin` / `admin123` (see [Admin login credentials](#7-admin-login-credentials)).

---

## 7. Admin login credentials

Admin login uses **username + password**, not email. The form is at `/admin/login`.

### Development defaults (from `backend/.env.example`)

| Field | Value |
|-------|--------|
| Login **username** | `admin` |
| Login **password** | `admin123` |
| Seeded **email** (stored, not used to log in) | `admin@farmfresh.local` |
| Admin URL | http://localhost:5173/admin/login |

These values are **local demo credentials only**. They match the seeded user created on first API start and the bcrypt hash in `database/seed.sql`. Do not reuse them in production.

`init_db()` **does not update** the password if the username already exists. Changing `ADMIN_PASSWORD` in `.env` later will not change login until you reset the row (below).

### Create the admin (first run)

1. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_EMAIL` in `backend/.env`.
2. Start the API (`uvicorn …`). `init_db()` inserts the user if missing.

### Reset a forgotten development admin password

The API does not include a password-reset endpoint. For **local** reset:

```sql
-- MySQL, as the app user
USE farmer_cart;
DELETE FROM admins WHERE username = 'admin';
```

Then set `ADMIN_PASSWORD` in `backend/.env` and restart uvicorn (or run `python -m app.seed`) so the user is re-created with a new bcrypt hash.

Production: set a strong unique `ADMIN_PASSWORD` **before** the first start, or insert a bcrypt hash yourself. Never ship the development password.

---

## 8. Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # already done if you copied earlier
```

Seed admin + demo catalog (MySQL must already be reachable):

```bash
python -m app.seed
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If port 8000 is in use:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Then set `VITE_PROXY_TARGET=http://127.0.0.1:8001` in `frontend/.env` and restart Vite.

- Health: http://127.0.0.1:8000/api/health → `{"status":"ok"}`
- Swagger: http://127.0.0.1:8000/docs
- OpenAPI JSON: http://127.0.0.1:8000/openapi.json
- Uploaded files: http://127.0.0.1:8000/uploads/...

This is **not** Django. There is no `manage.py`. Always use **uvicorn**.

---

## 9. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env               # already done if you copied earlier
npm run dev
```

Open http://localhost:5173

Other scripts from `frontend/package.json`:

```bash
npm run build      # production bundle → frontend/dist
npm run preview    # serve the production build (port 4173 by default)
```

There is **no** frontend unit-test script in `package.json`.

---

## 10. Docker setup

This repository’s Compose file defines **one service: MySQL**. There is **no** `Dockerfile` for FastAPI or React. Application processes still run on the host as in sections 8–9.

### Environment (Compose)

Defined in `docker-compose.yml` (not a separate Compose `.env` file):

- `MYSQL_ROOT_PASSWORD=root`
- `MYSQL_DATABASE=farmer_cart`
- `MYSQL_USER=admin`
- `MYSQL_PASSWORD=admin123`
- Port mapping `3306:3306`
- Init: `database/schema.sql`, `database/seed.sql` (first volume only)
- Healthcheck: `mysqladmin ping` as `admin`

### Commands

```bash
# Start MySQL in the background
docker compose up -d mysql

# Status
docker compose ps

# Logs
docker compose logs -f mysql

# Stop (container stopped, volume kept)
docker compose stop

# Start existing container
docker compose start

# Recreate container (volume kept unless you pass -v)
docker compose restart mysql

# Stop and remove containers (keeps volume mysqldata)
docker compose down

# Stop, remove containers, AND delete database data
docker compose down -v
```

### Persistence

Data lives in the Docker volume **`mysqldata`**. `docker compose down` without `-v` keeps products, orders, and admins. Use `down -v` only when you want a clean database (init SQL will run again on the next `up`).

After MySQL is healthy, start uvicorn and `npm run dev` as in sections 8–9.

---

## 11. Application URLs

| Surface | URL |
|---------|-----|
| Customer shop | http://localhost:5173 |
| Product detail | http://localhost:5173/products/:id |
| Wishlist | http://localhost:5173/wishlist |
| Cart | http://localhost:5173/cart |
| Checkout | http://localhost:5173/checkout |
| Customer orders | http://localhost:5173/orders |
| Admin login | http://localhost:5173/admin/login |
| Admin dashboard | http://localhost:5173/admin/dashboard |
| Admin products | http://localhost:5173/admin/products |
| Add product | http://localhost:5173/admin/products/new |
| Edit product | http://localhost:5173/admin/products/:id/edit |
| Stock | http://localhost:5173/admin/stock |
| Admin orders | http://localhost:5173/admin/orders |
| API health | http://127.0.0.1:8000/api/health |
| Swagger UI | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |

Use port **8001** in those API URLs if you started uvicorn on 8001.

---

## 12. API documentation

Base path: `/api`. Interactive docs: `/docs`.

**Auth**

- Admin: header `Authorization: Bearer <access_token>` from `POST /api/auth/login`
- Customer cart / wishlist / orders: header `X-Session-Id` (UUID). The SPA stores it in `localStorage` key `farmer_cart_session_id`

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Body `{ "username", "password" }` → `{ "access_token", "token_type": "bearer" }` |
| GET | `/api/auth/me` | JWT | Current admin `{ id, username, email }` |

### Products (admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | JWT | Paginated list (`page`, `limit`, optional `search`, `status`, `category`) |
| GET | `/api/products/filters/categories` | JWT | Category names used by products |
| POST | `/api/products/upload-image` | JWT | Multipart field `file` (JPEG/PNG/WebP/GIF, max 5 MB) → `{ "image_url": "/uploads/..." }` |
| POST | `/api/products` | JWT | Create product |
| GET | `/api/products/{id}` | JWT | Admin product detail (includes inactive) |
| PUT | `/api/products/{id}` | JWT | Update (unset fields ignored) |
| DELETE | `/api/products/{id}` | JWT | Delete (204) |
| PATCH | `/api/products/{id}/status` | JWT | `{ "status": "active" \| "inactive" }` |
| PATCH | `/api/products/{id}/stock` | JWT | `{ "available_quantity": n }` with `n >= 0` |

Product JSON fields: `name`, `category`, `farmer_name`, `description`, `price`, `available_quantity`, `image_url`, `status` (optional `sku` on create).

### Catalog (customer)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/catalog` | — | Active products; query `search`, `category` |
| GET | `/api/catalog/categories` | — | Categories that have active products |
| GET | `/api/catalog/{id}` | — | Active product detail; inactive → 404 |

### Cart

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cart` | Session | Cart + line totals + `grand_total` |
| POST | `/api/cart/items` | Session | `{ "product_id", "quantity" }` — cannot exceed stock |
| PUT | `/api/cart/items/{id}` | Session | `{ "quantity" }` |
| DELETE | `/api/cart/items/{id}` | Session | Remove line |

### Wishlist

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/wishlist` | Session | Saved products (independent of cart) |
| POST | `/api/wishlist/items` | Session | `{ "product_id" }` (idempotent) |
| DELETE | `/api/wishlist/items/{product_id}` | Session | Remove |

### Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/orders/checkout` | Session | Place order; decrements stock; clears cart |
| GET | `/api/orders` | Session | Orders for this session |
| GET | `/api/orders/{id}` | Session | Order detail (same session only) |
| GET | `/api/admin/orders` | JWT | All orders |

Checkout body:

```json
{
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "5551234567",
  "shipping_address": "123 Farm Road"
}
```

### Admin dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/dashboard/stats` | JWT | Product counts, inventory, revenue, orders today |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | `{ "status": "ok" }` |

More notes: [docs/API.md](docs/API.md).

---

## 13. Application workflow

End-to-end path a reviewer can follow after both servers are running.

1. **Start MySQL** — `docker compose up -d mysql` (or local MySQL + `complete-setup.sql`).
2. **Seed** — from `backend/` with venv active: `python -m app.seed` (or `./scripts/seed_db.sh`). Creates tables, the admin user if missing, and the demo catalog when `AUTO_SEED_CATALOG=true`.
3. **Start API** — `uvicorn app.main:app --reload --port 8000` from `backend/` with venv active. Confirm `/api/health`.
4. **Start UI** — `npm run dev` in `frontend/`. Open http://localhost:5173.
5. **Admin login** — http://localhost:5173/admin/login → username `admin` / password `admin123` (development). JWT is stored in `localStorage`.
6. **Product management** — Dashboard → Products → Add (`/admin/products/new`): fill required fields, optional image URL or file upload. Edit, delete, or toggle Active/Inactive. Stock page patches quantity (`n >= 0`).
7. **Customer browse** — Shop (`/`). The default landing grid is a **featured subset** (~20 named products). Choose **All** (or a category) and/or search to load matching **active** catalog items from the API. Inactive products never appear here.
8. **Search / filter** — Header search (`q` query param) and category chips. Optional **Price** control filters the loaded list client-side.
9. **Detail** — Open a product. Add to cart (quantity cannot exceed stock). Heart toggles wishlist.
10. **Cart** — `/cart`: stepper updates quantity via `PUT`; remove via `DELETE`. Totals come from the API.
11. **Checkout** — `/checkout`: name, email, phone, address (client + Pydantic validation). Submit calls `POST /api/orders/checkout`.
12. **Order** — Redirect to `/order-success/:id`. Cart is emptied. Session orders list is `/orders`.
13. **Stock** — Admin product/stock screens show `available_quantity` reduced by the purchased quantity.

---

## 14. Testing

### Backend (pytest)

Uses database **`farmer_cart_test`** (created by `complete-setup.sql`). It does **not** wipe `farmer_cart`.

```bash
cd backend
source .venv/bin/activate
pytest -v
```

Requires MySQL reachable with `admin` / `admin123` at `127.0.0.1:3306`. If MySQL is down, tests skip with a message to start Compose.

Covered today: health, failed login, JWT `/me`, unauthorized product list, catalog active-only + search/filter, admin pagination/CRUD/status, cart stock limits, checkout stock decrement, session order list, invalid price (422), wishlist vs cart.

### Frontend

No automated frontend test runner is configured. Verify manually:

- Admin login, add/edit/delete, status toggle, stock, image upload
- Customer search, category, add to cart, qty, remove, checkout, order success
- Desktop and a narrow viewport (Tailwind `sm` / `md` / `lg` layouts)

### Quick API smoke (optional)

```bash
curl -s http://127.0.0.1:8000/api/health
curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 15. Troubleshooting

| Symptom | Cause | What to do |
|---------|--------|------------|
| `python manage.py runserver` — no such file | This is FastAPI, not Django | `uvicorn app.main:app --reload --port 8000` |
| `Cannot reach the API` in the shop | Backend down, or Vite proxy target ≠ uvicorn port | Start uvicorn; match `VITE_PROXY_TARGET` to that port; restart `npm run dev` |
| Health 404 on port 8000 | Another process (often a different framework) owns 8000 | Use `--port 8001` and update `VITE_PROXY_TARGET` |
| `Access denied` for MySQL user `admin` | User not created on this server | Run `database/complete-setup.sql` as **root**, or use Compose |
| Tables missing | Schema never applied | `complete-setup.sql` / Compose first start / start API (`create_all`) |
| Admin login always fails after changing `.env` password | Seed does not update existing rows | Delete `admins` row for that username and restart API |
| CORS errors in the browser | Origin not in `CORS_ORIGINS` | Add the exact UI origin (`http://localhost:5173` or `http://127.0.0.1:5173`) |
| Cart empty after refresh / new browser | New `X-Session-Id` | Same browser + `localStorage` key `farmer_cart_session_id` |
| Checkout 400 “Cart is empty” | Session header missing or wrong cart | Keep the same session; add items first |
| Checkout 400 insufficient stock | Qty > `available_quantity` | Lower qty or update stock in admin |
| Image upload 401 | Missing JWT | Log in again |
| `docker compose up` but empty DB after wipe | Volume still present | `docker compose down -v` then `up -d` to re-run init SQL |
| pytest cannot connect | Test DB or user missing | Apply `complete-setup.sql` (creates `farmer_cart_test`) |
| Shop shows few products | Featured landing subset | Search, pick a category, or use **All** after leaving the default landing filters |

---

## 16. Production deployment

This repo is a development/assessment layout. There is **no** production Compose stack or app Dockerfile. The following is how you would run **this codebase** more safely — it is not a hosted pipeline.

### Environment

- Generate a long random `SECRET_KEY`. Never use the example string.
- Set a strong unique `ADMIN_PASSWORD` **before** first start (or reset the admin row as in section 7).
- `AUTO_SEED_CATALOG=false`
- `CORS_ORIGINS` = real HTTPS origins only
- `DATABASE_URL` pointing at a managed MySQL instance (TLS, least-privilege user, not the Compose root password)
- Frontend production build: set `VITE_API_BASE_URL` to the public API origin **or** keep `/api` and reverse-proxy `/api` and `/uploads` to uvicorn

```bash
cd frontend && npm run build
# Serve frontend/dist behind nginx/Caddy, or `npm run preview` for a local check
```

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Put TLS termination and process supervision (systemd, a platform host, etc.) in front of uvicorn. Bind MySQL to a private network.

### Security

- Change every development credential (`admin` / `admin123`, Compose `MYSQL_ROOT_PASSWORD=root`, example JWT secret).
- Do not commit `.env`.
- JWT is HS256 with `ACCESS_TOKEN_EXPIRE_MINUTES` (default 480). Shorten in production if needed.
- Uploads are stored as files under `backend/uploads/` and served statically — constrain size/types already exist (5 MB, image MIME types); still put a CDN or object store in front for a real product.
- Customers are anonymous (session header). Do not treat orders as strongly authenticated identities.

---

## 17. Assumptions

1. **MySQL only** — no PostgreSQL/SQLite runtime in this project.
2. **Customers do not register or log in.** Carts, wishlist, and orders are scoped to `X-Session-Id`.
3. **Images** may be a public URL or `POST /api/products/upload-image`; files live in `backend/uploads/`.
4. **Admin** is created from `ADMIN_*` env vars **once**. Login field is **username**.
5. **Inactive** products are hidden from `/api/catalog` and customer UI; they remain in admin lists.
6. **Home shop** shows featured products until the shopper searches or filters; the API still lists all active products.
7. **Docker Compose** provides MySQL, not the Node or Python processes.
8. **Wishlist**, admin dashboard, and customer order history go beyond the original page list; they are implemented and documented above.

---

## License

Assessment / portfolio project. Use and modify as needed for evaluation.
