from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.cart import Cart, CartItem
from app.models.product import Product, ProductStatus
from app.schemas.cart import CartItemResponse, CartResponse
from app.services.cart_session import get_or_create_cart


def build_cart_response(session_token: str, db: Session) -> CartResponse:
    cart = get_or_create_cart(db, session_token)
    db.refresh(cart)
    items = (
        db.query(CartItem)
        .join(Product)
        .filter(CartItem.cart_id == cart.id)
        .order_by(CartItem.id.asc())
        .all()
    )
    cart_items: list[CartItemResponse] = []
    grand_total = Decimal("0.00")
    for row in items:
        product = row.product
        if product is None:
            continue
        line_total = (product.price * row.quantity).quantize(Decimal("0.01"))
        grand_total += line_total
        cart_items.append(
            CartItemResponse(
                id=row.id,
                product_id=product.id,
                product_name=product.name,
                category=product.category,
                farmer_name=product.farmer_name,
                unit_price=product.price,
                quantity=row.quantity,
                line_total=line_total,
                available_quantity=product.available_quantity,
                image_url=product.image_url,
            )
        )
    return CartResponse(
        session_id=session_token,
        items=cart_items,
        grand_total=grand_total.quantize(Decimal("0.01")),
        item_count=sum(i.quantity for i in cart_items),
    )


def get_active_product(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product or product.status != ProductStatus.ACTIVE:
        raise HTTPException(status_code=404, detail="Product not available")
    return product


def validate_quantity(product: Product, quantity: int) -> None:
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")
    if quantity > product.available_quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Only {product.available_quantity} units available for {product.name}",
        )


def get_cart_for_session(db: Session, session_token: str) -> Cart:
    return get_or_create_cart(db, session_token)