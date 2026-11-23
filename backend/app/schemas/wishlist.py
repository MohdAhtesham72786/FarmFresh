from decimal import Decimal

from pydantic import BaseModel, Field


class WishlistAddRequest(BaseModel):
    product_id: int = Field(gt=0)


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    category: str
    farmer_name: str
    unit_price: Decimal
    available_quantity: int
    image_url: str
    status: str

    model_config = {"from_attributes": True}


class WishlistResponse(BaseModel):
    session_id: str
    items: list[WishlistItemResponse]
    item_count: int
