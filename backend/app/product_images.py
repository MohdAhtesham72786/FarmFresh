"""Assign name-relevant images to catalog products."""

from __future__ import annotations

import json
from pathlib import Path

from app.product_image_rules import IMAGE_PARAMS, image_url_for_product, keyword_for_name, unsplash

_OVERRIDES_PATH = Path(__file__).with_name("catalog_product_images.json")


def _load_overrides() -> dict[str, str]:
    if not _OVERRIDES_PATH.is_file():
        return {}
    data = json.loads(_OVERRIDES_PATH.read_text(encoding="utf-8"))
    return {str(k): str(v).strip() for k, v in data.items()}


def assign_catalog_images(products: list[dict]) -> None:
    """Set image_url on each catalog row from product name (unique + relevant)."""
    overrides = _load_overrides()
    if len(overrides) >= len(products):
        for product in products:
            url = overrides.get(product["name"])
            if not url:
                raise RuntimeError(f"Missing catalog image override for {product['name']}")
            product["image_url"] = _normalize_url(url)
        return

    used_urls: set[str] = set()
    used_ids: set[str] = set()
    for product in products:
        name = product["name"]
        if name in overrides:
            url = _normalize_url(overrides[name])
        else:
            url = image_url_for_product(name, product["category"], used_urls, used_ids)
        if url in used_urls:
            raise RuntimeError(f"Duplicate image assigned for {name}")
        used_urls.add(url)
        product["image_url"] = url

    if len(used_urls) != len(products):
        raise RuntimeError("Catalog image assignment did not produce unique URLs for every product")


def _normalize_url(url: str) -> str:
    value = url.strip()
    if not value.startswith("https://"):
        raise RuntimeError("Catalog image must be an HTTPS URL")
    if "wikimedia.org" in value and "?" not in value:
        return value
    if "images.unsplash.com" in value and "w=800" not in value:
        base = value.split("?")[0]
        return f"{base}?{IMAGE_PARAMS}"
    return value


def export_catalog_images(products: list[dict]) -> None:
    """Write frozen name→URL map (run manually after tuning rules)."""
    payload = {p["name"]: p["image_url"] for p in products}
    _OVERRIDES_PATH.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def validate_catalog_images(products: list[dict]) -> None:
    overrides = _load_overrides()
    urls = [p["image_url"] for p in products]
    if len(urls) != len(set(urls)):
        raise RuntimeError("Duplicate catalog image URLs")
    for p in products:
        url = p["image_url"]
        if not url.startswith("https://"):
            raise RuntimeError(f"Catalog image must be HTTPS for {p['name']}")
        if len(overrides) < len(products) and p["name"] not in overrides:
            if keyword_for_name(p["name"]) is None:
                raise RuntimeError(f"No keyword match for catalog product {p['name']}")