from decimal import Decimal

from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_products: int
    active_products: int
    inactive_products: int
    low_stock_products: int
    out_of_stock_products: int
    total_inventory_units: int
    inventory_value: Decimal
    total_orders: int
    total_revenue: Decimal
    orders_today: int