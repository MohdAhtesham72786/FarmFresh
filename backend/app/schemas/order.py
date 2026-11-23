from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field


class CheckoutRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=200)
    customer_email: EmailStr
    customer_phone: str = Field(min_length=7, max_length=50)
    shipping_address: str = Field(min_length=5, max_length=500)


class OrderItemResponse(BaseModel):
    product_id: int | None = None
    product_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    grand_total: Decimal
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}