#!/usr/bin/env python3
"""Generate name-relevant Wikimedia Commons image URLs for the demo catalog."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.catalog_data import FEATURED_PRODUCTS, _parse_extra, build_catalog  # noqa: E402
from app.product_image_rules import IMAGE_PARAMS, keyword_for_name, unsplash  # noqa: E402
from app.catalog_data import IMG  # noqa: E402

OUT = ROOT / "app" / "catalog_product_images.json"
UA = {"User-Agent": "FarmFreshCatalog/1.0 (local dev; contact admin@farmfresh.local)"}

# Verified Unsplash fallbacks when Commons has no hit (keyword → photo id from IMG).
_UNSPLASH_FALLBACK: dict[str, str] = {
    "tomato": "1592924357228-91a4daadcfea",
    "strawberry": "1464454709131-ffd692591ee5",
    "egg": "1598965675045-45c5e72c7d05",
    "honey": "1558642452-9d2a7deb7f62",
    "spinach": "1576045057995-568f588f82fb",
    "carrot": "1447175008436-054170c2e979",
    "blueberry": "1498557850523-fd3d118b962e",
    "milk": "1550583724-b2692b85b150",
    "bread": "1509440159596-0249088772ff",
    "avocado": "1523049673857-eb18f1d7b578",
    "apple": "1606923829579-0cb981a83e2e",
    "cheese": "1486297678162-eb2a19b0a32d",
    "broccoli": "1459411621453-7b03977f4bfc",
    "pepper": "1563565375-f3fdfdbefa83",
    "olive": "1474979266404-7eaacbcd87c5",
    "cherry": "1559181567-c3190ca9959b",
    "orange": "1611080626919-7cf5a9dbab5b",
    "cauliflower": "1568584711075-3d021a7c3ca3",
    "banana": "1571771894821-ce9b6c11b08e",
    "potato": "1518977676601-b53f82aba655",
    "pineapple": "1550258987-190a2d41a8ba",
    "produce": "1542838132-92c53300491e",
    "fruit": "1610832958506-aa56368176cf",
    "dairy": "1628088062854-d1870b4553da",
    "wheat": "1509440159596-0249088772ff",
    "rice": "1542838132-92c53300491e",
    "chili": "1563565375-f3fdfdbefa83",
    "chilli": "1563565375-f3fdfdbefa83",
}


def _commons_search(query: str, offset: int = 0) -> list[str]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": "6",
        "gsrlimit": "8",
        "gsroffset": str(offset),
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": "800",
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode())
    pages = data.get("query", {}).get("pages", {})
    urls: list[str] = []
    for page in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        info = (page.get("imageinfo") or [{}])[0]
        raw = info.get("url") or ""
        if not raw.startswith("https://upload.wikimedia.org/"):
            continue
        if any(x in raw.lower() for x in (".svg", ".pdf", ".gif")):
            continue
        # Consistent card crop via thumb
        thumb = info.get("thumburl")
        if thumb and "thumb.wikimedia.org" in thumb:
            urls.append(thumb.split("?")[0])
        else:
            urls.append(raw.split("?")[0])
    return urls


def _search_query(name: str) -> str:
    base = re.sub(r"\s*\([^)]*\)", "", name).strip()
    base = re.sub(r"\b(organic|fresh|farm|raw|whole|classic|mild|sharp|extra virgin)\b", "", base, flags=re.I)
    base = re.sub(r"\s+", " ", base).strip()
    if not base:
        base = name
    return f"{base} food"


def _unsplash_for(name: str, category: str, variant: int) -> str:
    kw = keyword_for_name(name)
    pid = None
    if kw and kw in _UNSPLASH_FALLBACK:
        pid = _UNSPLASH_FALLBACK[kw]
    elif kw:
        for key, val in _UNSPLASH_FALLBACK.items():
            if key in (kw or ""):
                pid = val
                break
    if not pid:
        cat_map = {
            "Vegetables": "produce",
            "Fruits": "fruit",
            "Dairy & Eggs": "dairy",
            "Pantry": "honey",
        }
        pid = _UNSPLASH_FALLBACK.get(cat_map.get(category, "produce"), "1542838132-92c53300491e")
    # Unique crop focal point per variant (same photo only when Commons misses).
    x = 0.15 + (variant % 5) * 0.12
    y = 0.2 + (variant % 4) * 0.1
    return f"{unsplash(pid).split('?')[0]}?{IMAGE_PARAMS}&fp-x={x:.2f}&fp-y={y:.2f}&fit=crop"


def _verified_img_urls() -> list[str]:
    return [u.split("?")[0] + f"?{IMAGE_PARAMS}" for u in IMG.values()]


def _catalog_without_images() -> list[dict]:
    """Same product list as build_catalog without assigning image_url."""
    products = list(FEATURED_PRODUCTS)
    seen = {item["name"] for item in products}
    extras = _parse_extra()
    by_category: dict[str, list[dict]] = {
        "Vegetables": [],
        "Fruits": [],
        "Dairy & Eggs": [],
        "Pantry": [],
    }
    for item in extras:
        if item["name"] not in seen:
            by_category[item["category"]].append(item)
    targets = {"Vegetables": 76, "Fruits": 50, "Dairy & Eggs": 38, "Pantry": 36}
    for category, target in targets.items():
        current = sum(1 for product in products if product["category"] == category)
        for item in by_category[category]:
            if current >= target:
                break
            products.append(item)
            seen.add(item["name"])
            current += 1
    expected = sum(targets.values())
    for item in extras:
        if len(products) >= expected:
            break
        if item["name"] not in seen:
            products.append(item)
            seen.add(item["name"])
    return products


def main() -> None:
    products = _catalog_without_images()
    # Strip picsum assignment from build_catalog until we wire assign after
    used: set[str] = set()
    mapping: dict[str, str] = {}
    spare_unsplash = _verified_img_urls()
    spare_idx = 0

    for index, product in enumerate(products):
        name = product["name"]
        category = product["category"]
        chosen = ""
        for offset in (0, 8, 16):
            try:
                for candidate in _commons_search(_search_query(name), offset):
                    if candidate not in used:
                        chosen = candidate
                        break
                if chosen:
                    break
            except Exception:
                time.sleep(0.5)
            time.sleep(0.25)
        if not chosen:
            chosen = _unsplash_for(name, category, index)
            if chosen in used:
                while spare_idx < len(spare_unsplash):
                    alt = spare_unsplash[spare_idx]
                    spare_idx += 1
                    if alt not in used:
                        chosen = alt
                        break
                if chosen in used:
                    chosen = _unsplash_for(name, category, index + spare_idx)
        used.add(chosen)
        mapping[name] = chosen
        print(f"[{index + 1}/200] {name}")
        time.sleep(0.35)

    OUT.write_text(json.dumps(mapping, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Wrote {len(mapping)} images to {OUT}")


if __name__ == "__main__":
    main()