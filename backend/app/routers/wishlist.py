from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.wishlist import WishlistAddRequest, WishlistResponse
from app.services.cart_session import resolve_session_token
from app.services.wishlist import add_wishlist_item, build_wishlist_response, remove_wishlist_item

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=WishlistResponse)
def view_wishlist(
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> WishlistResponse:
    return build_wishlist_response(session_token, db)


@router.post("/items", response_model=WishlistResponse)
def add_to_wishlist(
    payload: WishlistAddRequest,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> WishlistResponse:
    data, _created = add_wishlist_item(db, session_token, payload.product_id)
    return data


@router.delete("/items/{product_id}", response_model=WishlistResponse)
def remove_from_wishlist(
    product_id: int,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> WishlistResponse:
    data = remove_wishlist_item(db, session_token, product_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Product is not in your wishlist")
    return data
