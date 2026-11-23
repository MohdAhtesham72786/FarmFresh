from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.schemas.wishlist import WishlistItemResponse, WishlistResponse
from app.services.cart import get_active_product


def build_wishlist_response(session_token: str, db: Session) -> WishlistResponse:
    rows = (
        db.query(WishlistItem)
        .join(Product, WishlistItem.product_id == Product.id)
        .filter(WishlistItem.session_token == session_token)
        .order_by(WishlistItem.id.desc())
        .all()
    )
    items: list[WishlistItemResponse] = []
    for row in rows:
        product = row.product
        if product is None:
            continue
        items.append(
            WishlistItemResponse(
                id=row.id,
                product_id=product.id,
                product_name=product.name,
                category=product.category,
                farmer_name=product.farmer_name,
                unit_price=product.price,
                available_quantity=product.available_quantity,
                image_url=product.image_url,
                status=product.status.value,
            )
        )
    return WishlistResponse(session_id=session_token, items=items, item_count=len(items))


def add_wishlist_item(db: Session, session_token: str, product_id: int) -> tuple[WishlistResponse, bool]:
    product = get_active_product(db, product_id)
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.session_token == session_token, WishlistItem.product_id == product.id)
        .first()
    )
    created = False
    if not existing:
        db.add(WishlistItem(session_token=session_token, product_id=product.id))
        db.commit()
        created = True
    return build_wishlist_response(session_token, db), created


def remove_wishlist_item(db: Session, session_token: str, product_id: int) -> WishlistResponse | None:
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.session_token == session_token, WishlistItem.product_id == product_id)
        .first()
    )
    if not item:
        return None
    db.delete(item)
    db.commit()
    return build_wishlist_response(session_token, db)
