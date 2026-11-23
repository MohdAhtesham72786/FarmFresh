from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models.admin import Admin
from app.models.order import Order
from app.models.product import Product, ProductStatus
from app.schemas.admin import DashboardStatsResponse

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def dashboard_stats(_: Admin = Depends(get_current_admin), db: Session = Depends(get_db)) -> DashboardStatsResponse:
    products = db.query(Product).all()
    active = sum(1 for p in products if p.status == ProductStatus.ACTIVE)
    inactive = len(products) - active
    low_stock = sum(1 for p in products if 0 < p.available_quantity <= 10)
    out_of_stock = sum(1 for p in products if p.available_quantity == 0)
    total_units = sum(p.available_quantity for p in products)
    inventory_value = sum((Decimal(p.price) * p.available_quantity for p in products), Decimal("0.00"))

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Order.grand_total), 0)).scalar() or Decimal("0.00")

    start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = db.query(func.count(Order.id)).filter(Order.created_at >= start_of_day).scalar() or 0

    return DashboardStatsResponse(
        total_products=len(products),
        active_products=active,
        inactive_products=inactive,
        low_stock_products=low_stock,
        out_of_stock_products=out_of_stock,
        total_inventory_units=total_units,
        inventory_value=inventory_value.quantize(Decimal("0.01")),
        total_orders=int(total_orders),
        total_revenue=Decimal(total_revenue).quantize(Decimal("0.01")),
        orders_today=int(orders_today),
    )