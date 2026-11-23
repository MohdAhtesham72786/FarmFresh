from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.schemas.cart import CartAddRequest, CartResponse, CartUpdateRequest
from app.services.cart import build_cart_response, get_active_product, get_cart_for_session, validate_quantity
from app.services.cart_session import resolve_session_token

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
def view_cart(session_token: str = Depends(resolve_session_token), db: Session = Depends(get_db)) -> CartResponse:
    get_cart_for_session(db, session_token)
    db.commit()
    return build_cart_response(session_token, db)


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartAddRequest,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> CartResponse:
    product = get_active_product(db, payload.product_id)
    cart = get_cart_for_session(db, session_token)
    existing = (
        db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == payload.product_id).first()
    )
    new_qty = payload.quantity + (existing.quantity if existing else 0)
    validate_quantity(product, new_qty)
    if existing:
        existing.quantity = new_qty
    else:
        db.add(CartItem(cart_id=cart.id, product_id=product.id, quantity=payload.quantity))
    db.commit()
    return build_cart_response(session_token, db)


@router.put("/items/{cart_item_id}", response_model=CartResponse)
def update_cart_item(
    cart_item_id: int,
    payload: CartUpdateRequest,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> CartResponse:
    cart = get_cart_for_session(db, session_token)
    item = db.get(CartItem, cart_item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Cart item not found")
    product = get_active_product(db, item.product_id)
    validate_quantity(product, payload.quantity)
    item.quantity = payload.quantity
    db.commit()
    return build_cart_response(session_token, db)


@router.delete("/items/{cart_item_id}", response_model=CartResponse)
def remove_cart_item(
    cart_item_id: int,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> CartResponse:
    cart = get_cart_for_session(db, session_token)
    item = db.get(CartItem, cart_item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return build_cart_response(session_token, db)