from sqlalchemy.orm import Session

from app.models.category import Category


def get_or_create_category(db: Session, name: str) -> Category:
    clean = name.strip()
    existing = db.query(Category).filter(Category.name == clean).first()
    if existing:
        return existing
    category = Category(name=clean)
    db.add(category)
    db.flush()
    return category