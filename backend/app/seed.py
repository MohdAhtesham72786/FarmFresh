import re

from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.auth.security import get_password_hash
from app.catalog_data import build_catalog
from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models.admin import Admin
from app.models.order import OrderItem
from app.models.product import Product, ProductStatus
from app.models.wishlist import WishlistItem  # noqa: F401 — register table for create_all
from app.services.categories import get_or_create_category

SAMPLE_PRODUCTS = build_catalog()


def ensure_sku_column() -> None:
    """Add sku column on existing MySQL installs without dropping data."""
    inspector = inspect(engine)
    if "products" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("products")}
    if "sku" in columns:
        return
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE products ADD COLUMN sku VARCHAR(32) NULL AFTER category_id"))
        try:
            conn.execute(text("CREATE UNIQUE INDEX uq_products_sku ON products (sku)"))
        except Exception:
            pass


def ensure_sku_not_null() -> None:
    inspector = inspect(engine)
    if "products" not in inspector.get_table_names():
        return
    sku_col = next((c for c in inspector.get_columns("products") if c["name"] == "sku"), None)
    if sku_col and sku_col.get("nullable"):
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE products MODIFY sku VARCHAR(32) NOT NULL"))


def _backfill_skus(db: Session) -> None:
    catalog_by_name = {item["name"]: item for item in SAMPLE_PRODUCTS}
    for product in db.query(Product).filter(Product.sku.is_(None) | (Product.sku == "")).all():
        if product.name in catalog_by_name:
            product.sku = catalog_by_name[product.name]["sku"]
        else:
            product.sku = f"FF-M{product.id:05d}"
    db.flush()


def sync_catalog(db: Session) -> None:
    """Insert missing catalog rows and refresh images; never delete or overwrite merchant data."""
    _backfill_skus(db)
    by_sku = {p.sku: p for p in db.query(Product).all()}
    by_name = {p.name: p for p in db.query(Product).all()}

    for item in SAMPLE_PRODUCTS:
        sku = item["sku"]
        existing = by_sku.get(sku) or by_name.get(item["name"])
        if existing:
            if not existing.sku:
                existing.sku = sku
            # Always refresh demo catalog images (e.g. unique image rollout).
            if existing.sku and _CATALOG_SKU.match(existing.sku):
                existing.image_url = item["image_url"]
            elif existing.image_url != item["image_url"]:
                existing.image_url = item["image_url"]
            continue
        category = get_or_create_category(db, item["category"])
        status = item.get("status", ProductStatus.ACTIVE)
        db.add(
            Product(
                sku=sku,
                category_id=category.id,
                name=item["name"],
                farmer_name=item["farmer_name"],
                description=item["description"],
                price=item["price"],
                available_quantity=item["available_quantity"],
                image_url=item["image_url"],
                status=status,
            )
        )
    db.commit()


_CATALOG_SKU = re.compile(r"^FF-\d{4}$")


def _prune_orphan_catalog_skus(db: Session) -> None:
    """Remove stale demo rows (FF-####) that are no longer in the catalog and have no order history."""
    valid_skus = {item["sku"] for item in SAMPLE_PRODUCTS}
    orphans = [
        p
        for p in db.query(Product).all()
        if p.sku and _CATALOG_SKU.match(p.sku) and p.sku not in valid_skus
    ]
    if not orphans:
        return
    orphan_ids = [p.id for p in orphans]
    referenced = {
        row[0]
        for row in db.query(OrderItem.product_id)
        .filter(OrderItem.product_id.in_(orphan_ids))
        .distinct()
        .all()
        if row[0] is not None
    }
    for product in orphans:
        if product.id in referenced:
            continue
        db.delete(product)
    db.commit()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_sku_column()
    settings = get_settings()
    db: Session = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == settings.admin_username).first()
        if not admin:
            db.add(
                Admin(
                    username=settings.admin_username,
                    email=settings.admin_email,
                    hashed_password=get_password_hash(settings.admin_password),
                )
            )
            db.commit()

        if settings.auto_seed_catalog:
            sync_catalog(db)
            _prune_orphan_catalog_skus(db)
        else:
            _backfill_skus(db)
            db.commit()
        ensure_sku_not_null()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized.")