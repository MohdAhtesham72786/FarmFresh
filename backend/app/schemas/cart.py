from decimal import Decimal

from pydantic import BaseModel, Field, model_validator


class CartAddRequest(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, default=1)


class CartUpdateRequest(BaseModel):
    quantity: int = Field(ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    category: str
    farmer_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal
    available_quantity: int
    image_url: str

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    session_id: str
    items: list[CartItemResponse]
    grand_total: Decimal
    item_count: int

    @model_validator(mode="after")
    def compute_meta(self) -> "CartResponse":
        self.item_count = sum(i.quantity for i in self.items)
        return self