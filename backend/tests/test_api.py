import uuid

import pytest


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_admin_login_fail(client):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "wrong"})
    assert res.status_code == 401


def test_admin_me(client, admin_token):
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert res.json()["username"] == "admin"


def test_unauthorized_products(client):
    assert client.get("/api/products").status_code == 401


def test_catalog_images_wikimedia_or_unsplash(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/api/products", headers=headers, params={"page": 1, "limit": 5})
    for item in res.json()["items"]:
        url = item["image_url"]
        assert url.startswith("https://")
        assert "picsum.photos" not in url


def test_catalog_images_unique(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    images: set[str] = set()
    page = 1
    while True:
        res = client.get("/api/products", headers=headers, params={"page": page, "limit": 50})
        assert res.status_code == 200
        data = res.json()
        for item in data["items"]:
            assert item["image_url"]
            assert item["image_url"] not in images, item["name"]
            images.add(item["image_url"])
        if page >= data["total_pages"]:
            break
        page += 1
    assert len(images) == 200


def test_catalog_skus_unique(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    page = 1
    skus: set[str] = set()
    ids: set[int] = set()
    while True:
        res = client.get("/api/products", headers=headers, params={"page": page, "limit": 50})
        assert res.status_code == 200
        data = res.json()
        for item in data["items"]:
            assert item["sku"]
            assert item["sku"] not in skus, item["sku"]
            assert item["id"] not in ids
            skus.add(item["sku"])
            ids.add(item["id"])
        if page >= data["total_pages"]:
            break
        page += 1
    assert len(skus) == 200


def test_admin_products_pagination_no_overlap(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    pages = [1, 2, 3]
    seen: set[int] = set()
    for p in pages:
        res = client.get("/api/products", headers=headers, params={"page": p, "limit": 10})
        assert res.status_code == 200
        ids = [item["id"] for item in res.json()["items"]]
        assert len(ids) == len(set(ids))
        overlap = seen.intersection(ids)
        assert not overlap, overlap
        seen.update(ids)


def test_admin_products_pagination(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/api/products", headers=headers, params={"page": 1, "limit": 10})
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["limit"] == 10
    assert data["page"] == 1
    assert len(data["items"]) == 10
    assert data["total"] == 200
    assert data["total_pages"] == (data["total"] + 9) // 10

    page2 = client.get("/api/products", headers=headers, params={"page": 2, "limit": 10})
    assert page2.status_code == 200
    assert page2.json()["page"] == 2
    assert page2.json()["items"][0]["id"] != data["items"][0]["id"]

    filtered = client.get(
        "/api/products",
        headers=headers,
        params={"page": 1, "limit": 10, "search": "Tomato", "category": "Vegetables"},
    )
    assert filtered.status_code == 200
    assert len(filtered.json()["items"]) >= 1

    cats = client.get("/api/products/filters/categories", headers=headers)
    assert cats.status_code == 200
    assert "Vegetables" in cats.json()


def test_catalog_only_active(client):
    res = client.get("/api/catalog")
    assert res.status_code == 200
    products = res.json()
    assert all(p["status"] == "active" for p in products)
    assert not any(p["name"] == "Baby Spinach Bundle" for p in products)


def test_search_and_filter(client):
    res = client.get("/api/catalog", params={"search": "Tomato"})
    assert res.status_code == 200
    assert len(res.json()) >= 1
    res = client.get("/api/catalog", params={"category": "Fruits"})
    assert all(p["category"] == "Fruits" for p in res.json())


def test_admin_crud(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    create = client.post(
        "/api/products",
        headers=headers,
        json={
            "name": "Test Carrots",
            "category": "Vegetables",
            "farmer_name": "Test Farm",
            "description": "Crunchy carrots",
            "price": "2.50",
            "available_quantity": 10,
            "image_url": "https://example.com/carrot.jpg",
            "status": "active",
        },
    )
    assert create.status_code == 201
    body = create.json()
    pid = body["id"]
    assert body["sku"].startswith("FF-M")

    client.patch(f"/api/products/{pid}/status", headers=headers, json={"status": "inactive"})
    assert client.get(f"/api/catalog/{pid}").status_code == 404

    client.patch(f"/api/products/{pid}/status", headers=headers, json={"status": "active"})
    client.delete(f"/api/products/{pid}", headers=headers)


def test_wishlist_toggle_independent_of_cart(client):
    session_id = str(uuid.uuid4())
    headers = {"X-Session-Id": session_id}
    catalog = client.get("/api/catalog").json()
    product = next(p for p in catalog if p["name"] == "Organic Heirloom Tomatoes")
    pid = product["id"]

    listed = client.get("/api/wishlist", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["items"] == []

    added = client.post("/api/wishlist/items", headers=headers, json={"product_id": pid})
    assert added.status_code == 200
    assert any(i["product_id"] == pid for i in added.json()["items"])
    assert added.json()["item_count"] == 1

    again = client.post("/api/wishlist/items", headers=headers, json={"product_id": pid})
    assert again.status_code == 200
    assert again.json()["item_count"] == 1

    cart = client.post("/api/cart/items", headers=headers, json={"product_id": pid, "quantity": 1})
    assert cart.status_code == 201
    assert client.get("/api/wishlist", headers=headers).json()["item_count"] == 1
    assert client.get("/api/cart", headers=headers).json()["item_count"] == 1

    removed = client.delete(f"/api/wishlist/items/{pid}", headers=headers)
    assert removed.status_code == 200
    assert removed.json()["item_count"] == 0
    assert client.get("/api/cart", headers=headers).json()["item_count"] == 1
    assert client.delete(f"/api/wishlist/items/{pid}", headers=headers).status_code == 404


def test_cart_stock_limits(client):
    session_id = str(uuid.uuid4())
    headers = {"X-Session-Id": session_id}
    catalog = client.get("/api/catalog").json()
    product = next(p for p in catalog if p["name"] == "Organic Heirloom Tomatoes")
    pid = product["id"]
    stock = product["available_quantity"]

    assert client.post("/api/cart/items", headers=headers, json={"product_id": pid, "quantity": stock + 1}).status_code == 400
    add = client.post("/api/cart/items", headers=headers, json={"product_id": pid, "quantity": 2})
    assert add.status_code == 201
    item_id = add.json()["items"][0]["id"]
    assert client.put(f"/api/cart/items/{item_id}", headers=headers, json={"quantity": stock + 1}).status_code == 400


def test_checkout_updates_stock(client, admin_token):
    session_id = str(uuid.uuid4())
    headers = {"X-Session-Id": session_id}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    product = next(p for p in client.get("/api/catalog").json() if p["name"] == "Fresh Strawberries")
    pid, before_stock, qty = product["id"], product["available_quantity"], 3

    client.post("/api/cart/items", headers=headers, json={"product_id": pid, "quantity": qty})
    checkout = client.post(
        "/api/orders/checkout",
        headers=headers,
        json={
            "customer_name": "Jane Doe",
            "customer_email": "jane@example.com",
            "customer_phone": "5551234567",
            "shipping_address": "123 Farm Road, Springfield",
        },
    )
    assert checkout.status_code == 201
    assert len(client.get("/api/cart", headers=headers).json()["items"]) == 0
    admin_product = client.get(f"/api/products/{pid}", headers=admin_headers).json()
    assert admin_product["available_quantity"] == before_stock - qty


def test_dashboard_stats(client, admin_token):
    res = client.get("/api/admin/dashboard/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["total_products"] >= 4


def test_view_orders_after_checkout(client):
    session_id = str(uuid.uuid4())
    headers = {"X-Session-Id": session_id}
    product = next(p for p in client.get("/api/catalog").json() if p["name"] == "Farm Eggs (Dozen)")
    client.post("/api/cart/items", headers=headers, json={"product_id": product["id"], "quantity": 1})
    checkout = client.post(
        "/api/orders/checkout",
        headers=headers,
        json={
            "customer_name": "Alex Farmer",
            "customer_email": "alex@example.com",
            "customer_phone": "5550001111",
            "shipping_address": "9 Orchard Lane",
        },
    )
    assert checkout.status_code == 201
    listed = client.get("/api/orders", headers=headers)
    assert listed.status_code == 200
    assert any(o["id"] == checkout.json()["id"] for o in listed.json())
    detail = client.get(f"/api/orders/{checkout.json()['id']}", headers=headers)
    assert detail.status_code == 200
    assert detail.json()["grand_total"]


def test_invalid_price_rejected(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.post(
        "/api/products",
        headers=headers,
        json={
            "name": "Bad Price",
            "category": "Test",
            "farmer_name": "Farm",
            "description": "x",
            "price": "-1",
            "available_quantity": 1,
            "image_url": "",
            "status": "active",
        },
    )
    assert res.status_code == 422