from fastapi import Header, HTTPException
from sqlalchemy.orm import Session

from app.models.cart import Cart, new_session_token

SESSION_HEADER = "X-Session-Id"


def resolve_session_token(x_session_id: str | None = Header(default=None, alias=SESSION_HEADER)) -> str:
    if x_session_id and x_session_id.strip():
        token = x_session_id.strip()
        if len(token) < 16 or len(token) > 128:
            raise HTTPException(status_code=400, detail="Invalid session identifier")
        return token
    return new_session_token()


def get_or_create_cart(db: Session, session_token: str) -> Cart:
    cart = db.query(Cart).filter(Cart.session_token == session_token).first()
    if cart:
        return cart
    cart = Cart(session_token=session_token)
    db.add(cart)
    db.flush()
    return cart