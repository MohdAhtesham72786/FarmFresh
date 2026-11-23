import math
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product, ProductStatus
from app.schemas.product import (
    ProductCreate,
    ProductListPage,
    ProductResponse,
    ProductStatusUpdate,
    ProductStockUpdate,
    ProductUpdate,
)
from app.services.categories import get_or_create_category

router = APIRouter(prefix="/products", tags=["Products"])
public_router = APIRouter(prefix="/catalog", tags=["Catalog"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _to_response(product: Product) -> ProductResponse:
    return ProductResponse.from_model(product)


def _admin_products_query(
    db: Session,
    *,
    search: str | None,
    status: str | None,
    category: str | None,
):
    q = db.query(Product).options(joinedload(Product.category_rel))
    if search and search.strip():
        term = f"%{search.strip()}%"
        q = q.filter(or_(Product.name.ilike(term), Product.farmer_name.ilike(term), Product.sku.ilike(term)))
    if status and status.strip():
        try:
            q = q.filter(Product.status == ProductStatus(status.strip()))
        except ValueError:
            q = q.filter(Product.id == -1)
    if category and category.strip():
        q = q.join(Category, Product.category_id == Category.id).filter(Category.name == category.strip())
    return q


@router.get("", response_model=ProductListPage)
def admin_list_products(
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = Query(default=None, max_length=200),
    status: str | None = Query(default=None, pattern="^(active|inactive)$"),
    category: str | None = Query(default=None, max_length=100),
) -> ProductListPage:
    base = _admin_products_query(db, search=search, status=status, category=category)
    total = base.order_by(None).count()
    total_pages = math.ceil(total / limit) if total > 0 else 0
    if total_pages and page > total_pages:
        page = total_pages
    offset = (page - 1) * limit
    products = base.order_by(Product.id.desc()).offset(offset).limit(limit).all()
    return ProductListPage(
        items=[_to_response(p) for p in products],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get("/filters/categories", response_model=list[str])
def admin_product_categories(_: Admin = Depends(get_current_admin), db: Session = Depends(get_db)) -> list[str]:
    rows = (
        db.query(Category.name)
        .join(Product, Product.category_id == Category.id)
        .distinct()
        .order_by(Category.name.asc())
        .all()
    )
    return [r[0] for r in rows]


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    _: Admin = Depends(get_current_admin),
) -> dict[str, str]:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, or GIF images are allowed")
    payload = await file.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(payload) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 5 MB or smaller")
    ext = Path(file.filename or "image.jpg").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXT:
        ext = ".jpg"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{ext}"
    (UPLOAD_DIR / filename).write_bytes(payload)
    return {"image_url": f"/uploads/{filename}"}


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    category = get_or_create_category(db, payload.category)
    requested_sku = (payload.sku or "").strip()
    if requested_sku and db.query(Product).filter(Product.sku == requested_sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")
    product = Product(
        category_id=category.id,
        sku=requested_sku or f"FF-PENDING-{uuid4().hex[:12]}",
        name=payload.name.strip(),
        farmer_name=payload.farmer_name.strip(),
        description=payload.description.strip(),
        price=payload.price,
        available_quantity=payload.available_quantity,
        image_url=payload.image_url.strip(),
        status=ProductStatus(payload.status.value),
    )
    db.add(product)
    db.flush()
    if not requested_sku:
        product.sku = f"FF-M{product.id:05d}"
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.get("/{product_id}", response_model=ProductResponse)
def admin_get_product(
    product_id: int,
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    product = db.query(Product).options(joinedload(Product.category_rel)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _to_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_unset=True)
    if "category" in data and data["category"]:
        category = get_or_create_category(db, data.pop("category"))
        product.category_id = category.id
    if "status" in data and data["status"] is not None:
        data["status"] = ProductStatus(data["status"].value)
    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, _: Admin = Depends(get_current_admin), db: Session = Depends(get_db)) -> None:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()


@router.patch("/{product_id}/status", response_model=ProductResponse)
def update_product_status(
    product_id: int,
    payload: ProductStatusUpdate,
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.status = ProductStatus(payload.status.value)
    db.commit()
    db.refresh(product)
    return _to_response(product)


@router.patch("/{product_id}/stock", response_model=ProductResponse)
def update_product_stock(
    product_id: int,
    payload: ProductStockUpdate,
    _: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.available_quantity = payload.available_quantity
    db.commit()
    db.refresh(product)
    return _to_response(product)


@public_router.get("", response_model=list[ProductResponse])
def catalog_list(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None, max_length=200),
    category: str | None = Query(default=None, max_length=100),
) -> list[ProductResponse]:
    q = db.query(Product).options(joinedload(Product.category_rel)).filter(Product.status == ProductStatus.ACTIVE)
    if search and search.strip():
        q = q.filter(Product.name.ilike(f"%{search.strip()}%"))
    if category and category.strip():
        q = q.join(Category).filter(Category.name.ilike(category.strip()))
    products = q.order_by(Product.name.asc()).all()
    return [_to_response(p) for p in products]


@public_router.get("/categories", response_model=list[str])
def catalog_categories(db: Session = Depends(get_db)) -> list[str]:
    rows = (
        db.query(Category.name)
        .join(Product, Product.category_id == Category.id)
        .filter(Product.status == ProductStatus.ACTIVE)
        .distinct()
        .order_by(Category.name.asc())
        .all()
    )
    return [r[0] for r in rows]


@public_router.get("/{product_id}", response_model=ProductResponse)
def catalog_detail(product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    product = (
        db.query(Product)
        .options(joinedload(Product.category_rel))
        .filter(Product.id == product_id, Product.status == ProductStatus.ACTIVE)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _to_response(product)