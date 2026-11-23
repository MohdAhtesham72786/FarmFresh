from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models.admin import Admin
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductStatus
from app.schemas.order import CheckoutRequest, OrderResponse
from app.services.cart import build_cart_response, get_cart_for_session
from app.services.cart_session import resolve_session_token

router = APIRouter(prefix="/orders", tags=["Orders"])
admin_router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])


def _order_to_response(order: Order) -> OrderResponse:
    return OrderResponse.model_validate(order)


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutRequest,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> OrderResponse:
    cart = get_cart_for_session(db, session_token)
    cart_view = build_cart_response(session_token, db)
    if not cart_view.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    try:
        product_ids = [i.product_id for i in cart_view.items]
        products = {
            p.id: p
            for p in db.query(Product).filter(Product.id.in_(product_ids)).with_for_update().all()
        }

        for item in cart_view.items:
            product = products.get(item.product_id)
            if not product or product.status != ProductStatus.ACTIVE:
                raise HTTPException(status_code=400, detail=f"Product {item.product_name} is no longer available")
            if item.quantity > product.available_quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}. Available: {product.available_quantity}",
                )

        grand_total = Decimal("0.00")
        order = Order(
            cart_id=cart.id,
            session_token=session_token,
            customer_name=payload.customer_name.strip(),
            customer_email=payload.customer_email,
            customer_phone=payload.customer_phone.strip(),
            shipping_address=payload.shipping_address.strip(),
            grand_total=Decimal("0.00"),
        )
        db.add(order)
        db.flush()

        for item in cart_view.items:
            product = products[item.product_id]
            line_total = (product.price * item.quantity).quantize(Decimal("0.01"))
            grand_total += line_total
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=item.quantity,
                    line_total=line_total,
                )
            )
            product.available_quantity -= item.quantity
            if product.available_quantity < 0:
                raise HTTPException(status_code=400, detail="Stock would become negative")

        order.grand_total = grand_total.quantize(Decimal("0.01"))
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
        db.refresh(order)
        return _order_to_response(order)
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Checkout failed") from exc


@router.get("", response_model=list[OrderResponse])
def list_session_orders(
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> list[OrderResponse]:
    orders = db.query(Order).filter(Order.session_token == session_token).order_by(Order.id.desc()).all()
    return [_order_to_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    session_token: str = Depends(resolve_session_token),
    db: Session = Depends(get_db),
) -> OrderResponse:
    order = db.get(Order, order_id)
    if not order or order.session_token != session_token:
        raise HTTPException(status_code=404, detail="Order not found")
    return _order_to_response(order)


@admin_router.get("", response_model=list[OrderResponse])
def admin_list_orders(_: Admin = Depends(get_current_admin), db: Session = Depends(get_db)) -> list[OrderResponse]:
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return [_order_to_response(o) for o in orders]