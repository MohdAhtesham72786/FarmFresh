from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field, HttpUrl, field_validator

from app.models.product import Product


class ProductStatusSchema(str, Enum):
    active = "active"
    inactive = "inactive"


class ProductBase(BaseModel):
    sku: str = Field(min_length=1, max_length=32)
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    farmer_name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=5000)
    price: Decimal = Field(gt=0, decimal_places=2)
    available_quantity: int = Field(ge=0)
    image_url: str = Field(max_length=500)
    status: ProductStatusSchema = ProductStatusSchema.active

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: str) -> str:
        value = (v or "").strip()
        if not value:
            return ""
        if value.startswith("/uploads/"):
            return value
        try:
            HttpUrl(value)
        except Exception as exc:
            raise ValueError("image_url must be a valid URL, an uploaded /uploads path, or empty") from exc
        return value


class ProductCreate(BaseModel):
    sku: str | None = Field(default=None, max_length=32)
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    farmer_name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=5000)
    price: Decimal = Field(gt=0, decimal_places=2)
    available_quantity: int = Field(ge=0)
    image_url: str = Field(max_length=500)
    status: ProductStatusSchema = ProductStatusSchema.active

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: str) -> str:
        return ProductBase.validate_image_url(v)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    farmer_name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1, max_length=5000)
    price: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    available_quantity: int | None = Field(default=None, ge=0)
    image_url: str | None = Field(default=None, max_length=500)
    status: ProductStatusSchema | None = None

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return ProductBase.validate_image_url(v)


class ProductResponse(ProductBase):
    id: int

    @classmethod
    def from_model(cls, product: Product) -> "ProductResponse":
        return cls(
            id=product.id,
            sku=product.sku,
            name=product.name,
            category=product.category,
            farmer_name=product.farmer_name,
            description=product.description,
            price=product.price,
            available_quantity=product.available_quantity,
            image_url=product.image_url,
            status=ProductStatusSchema(product.status.value),
        )


class ProductStockUpdate(BaseModel):
    available_quantity: int = Field(ge=0)


class ProductStatusUpdate(BaseModel):
    status: ProductStatusSchema


class ProductListPage(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int