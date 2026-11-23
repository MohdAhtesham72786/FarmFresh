# FarmFresh API

Base URL (dev): `http://127.0.0.1:8000`  
Interactive docs: http://127.0.0.1:8000/docs

Vite proxies `/api` and `/uploads` to the backend during `npm run dev`.

## Auth

Admin JWT (`Authorization: Bearer <token>`).

| Method | Path | Body | Notes |
|--------|------|------|--------|
| POST | `/api/auth/login` | `{ "username", "password" }` | Returns `access_token` |
| GET | `/api/auth/me` | — | JWT required |

## Products (admin, JWT)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/products` | All products including inactive |
| POST | `/api/products` | Create |
| GET | `/api/products/{id}` | Details |
| PUT | `/api/products/{id}` | Partial-friendly update |
| DELETE | `/api/products/{id}` | 204 |
| PATCH | `/api/products/{id}/status` | `{ "status": "active" \| "inactive" }` |
| PATCH | `/api/products/{id}/stock` | `{ "available_quantity": n }` `n >= 0` |
| POST | `/api/products/upload-image` | `multipart/form-data` field `file` |

Product JSON fields: `name`, `category`, `farmer_name`, `description`, `price`, `available_quantity`, `image_url`, `status`.

## Catalog (customer, active only)

Header `X-Session-Id` is optional on catalog (required for cart/orders).

| Method | Path |
|--------|------|
| GET | `/api/catalog?search=&category=` |
| GET | `/api/catalog/categories` |
| GET | `/api/catalog/{id}` |

Inactive products return 404 on public detail.

## Cart (`X-Session-Id` required)

| Method | Path | Body |
|--------|------|------|
| GET | `/api/cart` | — |
| POST | `/api/cart/items` | `{ "product_id", "quantity" }` |
| PUT | `/api/cart/items/{id}` | `{ "quantity" }` |
| DELETE | `/api/cart/items/{id}` | — |

Quantity cannot exceed `available_quantity`. Grand total is computed on the server.

## Wishlist (`X-Session-Id` required)

Keyed by the same browser session as the cart. Independent of cart items.

| Method | Path | Body |
|--------|------|------|
| GET | `/api/wishlist` | — |
| POST | `/api/wishlist/items` | `{ "product_id" }` (idempotent) |
| DELETE | `/api/wishlist/items/{product_id}` | — |

## Orders

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/orders/checkout` | session |
| GET | `/api/orders` | session |
| GET | `/api/orders/{id}` | session |
| GET | `/api/admin/orders` | JWT |

Checkout body:

```json
{
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "5551234567",
  "shipping_address": "123 Farm Road"
}
```

Checkout runs in a transaction with `SELECT … FOR UPDATE`, revalidates stock, decrements inventory, snapshots line prices, and clears the cart.

## Health

`GET /api/health` → `{ "status": "ok" }`
