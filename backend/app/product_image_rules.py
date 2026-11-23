"""Curated Unsplash food photos keyed by product-name tokens (longest match wins)."""

from __future__ import annotations

import re

def _img() -> dict[str, str]:
    from app.catalog_data import IMG

    return IMG

IMAGE_PARAMS = "auto=format&fit=crop&w=800&h=600&q=82"


def unsplash(photo_id: str) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?{IMAGE_PARAMS}"


def _photo_ids_from_img(*keys: str) -> list[str]:
    out: list[str] = []
    for key in keys:
        raw = _img().get(key, "")
        m = re.search(r"photo-(\d{10}-[a-f0-9]+)", raw)
        if m:
            out.append(m.group(1))
    return out


# Each keyword → distinct verified Unsplash ids (from catalog IMG + themed keys).
_KEYWORD_PHOTOS: dict[str, list[str]] = {
    "heirloom tomato": _photo_ids_from_img("tomato"),
    "cherry tomato": _photo_ids_from_img("tomato", "produce"),
    "roma tomato": _photo_ids_from_img("tomato", "produce"),
    "beefsteak tomato": _photo_ids_from_img("tomato", "produce"),
    "grape tomato": _photo_ids_from_img("tomato", "produce"),
    "tomato": _photo_ids_from_img("tomato", "produce"),
    "strawberries": _photo_ids_from_img("strawberry", "fruit"),
    "strawberry": _photo_ids_from_img("strawberry", "fruit"),
    "blueberry": _photo_ids_from_img("blueberry", "fruit"),
    "raspberries": _photo_ids_from_img("fruit", "strawberry"),
    "raspberry": _photo_ids_from_img("fruit", "strawberry"),
    "blackberries": _photo_ids_from_img("fruit", "blueberry"),
    "blackberry": _photo_ids_from_img("fruit", "blueberry"),
    "spinach": _photo_ids_from_img("spinach", "produce"),
    "carrot": _photo_ids_from_img("carrot", "produce"),
    "parsnip": _photo_ids_from_img("carrot", "produce"),
    "beet": _photo_ids_from_img("produce", "carrot"),
    "radish": _photo_ids_from_img("produce", "carrot"),
    "turnip": _photo_ids_from_img("produce", "carrot"),
    "rutabaga": _photo_ids_from_img("produce", "potato"),
    "potato": _photo_ids_from_img("potato", "produce"),
    "sweet potato": _photo_ids_from_img("potato", "produce"),
    "onion": _photo_ids_from_img("produce", "farm"),
    "shallot": _photo_ids_from_img("produce", "farm"),
    "garlic": _photo_ids_from_img("produce", "farm"),
    "leek": _photo_ids_from_img("produce", "spinach"),
    "fennel": _photo_ids_from_img("produce", "spinach"),
    "celery": _photo_ids_from_img("produce", "spinach"),
    "asparagus": _photo_ids_from_img("broccoli", "produce"),
    "artichoke": _photo_ids_from_img("broccoli", "produce"),
    "eggplant": _photo_ids_from_img("pepper", "produce"),
    "corn": _photo_ids_from_img("produce", "farm"),
    "okra": _photo_ids_from_img("pepper", "produce"),
    "pea": _photo_ids_from_img("produce", "spinach"),
    "wax beans": _photo_ids_from_img("produce", "broccoli"),
    "green bean": _photo_ids_from_img("produce", "broccoli"),
    "cabbage": _photo_ids_from_img("produce", "broccoli"),
    "bok choy": _photo_ids_from_img("produce", "spinach"),
    "cucumber": _photo_ids_from_img("produce", "pepper"),
    "bell pepper": _photo_ids_from_img("pepper", "produce"),
    "jalapeño": _photo_ids_from_img("pepper", "produce"),
    "poblano": _photo_ids_from_img("pepper", "produce"),
    "shishito": _photo_ids_from_img("pepper", "produce"),
    "zucchini": _photo_ids_from_img("produce", "broccoli"),
    "squash": _photo_ids_from_img("produce", "farm"),
    "pumpkin": _photo_ids_from_img("produce", "farm"),
    "broccoli": _photo_ids_from_img("broccoli", "produce"),
    "broccolini": _photo_ids_from_img("broccoli", "produce"),
    "cauliflower": _photo_ids_from_img("cauliflower", "broccoli"),
    "romanesco": _photo_ids_from_img("cauliflower", "broccoli"),
    "brussels": _photo_ids_from_img("broccoli", "produce"),
    "kale": _photo_ids_from_img("spinach", "produce"),
    "chard": _photo_ids_from_img("spinach", "produce"),
    "collard": _photo_ids_from_img("spinach", "produce"),
    "arugula": _photo_ids_from_img("spinach", "produce"),
    "spring mix": _photo_ids_from_img("spinach", "produce"),
    "romaine": _photo_ids_from_img("spinach", "produce"),
    "lettuce": _photo_ids_from_img("spinach", "produce"),
    "radicchio": _photo_ids_from_img("produce", "spinach"),
    "watercress": _photo_ids_from_img("spinach", "produce"),
    "microgreen": _photo_ids_from_img("spinach", "produce"),
    "avocado": _photo_ids_from_img("avocado", "produce"),
    "apple": _photo_ids_from_img("apple", "fruit"),
    "pear": _photo_ids_from_img("apple", "fruit"),
    "peach": _photo_ids_from_img("fruit", "apple"),
    "nectarine": _photo_ids_from_img("fruit", "apple"),
    "plum": _photo_ids_from_img("fruit", "apple"),
    "apricot": _photo_ids_from_img("fruit", "apple"),
    "cherries": _photo_ids_from_img("cherry", "fruit"),
    "cherry": _photo_ids_from_img("cherry", "fruit"),
    "orange": _photo_ids_from_img("orange", "fruit"),
    "mandarin": _photo_ids_from_img("orange", "fruit"),
    "grapefruit": _photo_ids_from_img("orange", "fruit"),
    "lemon": _photo_ids_from_img("orange", "fruit"),
    "lime": _photo_ids_from_img("orange", "fruit"),
    "grape": _photo_ids_from_img("fruit", "blueberry"),
    "watermelon": _photo_ids_from_img("fruit", "strawberry"),
    "cantaloupe": _photo_ids_from_img("fruit", "pineapple"),
    "honeydew": _photo_ids_from_img("fruit", "pineapple"),
    "banana": _photo_ids_from_img("banana", "fruit"),
    "plantain": _photo_ids_from_img("banana", "fruit"),
    "mango": _photo_ids_from_img("fruit", "pineapple"),
    "pineapple": _photo_ids_from_img("pineapple", "fruit"),
    "kiwi": _photo_ids_from_img("fruit", "apple"),
    "papaya": _photo_ids_from_img("fruit", "pineapple"),
    "passion fruit": _photo_ids_from_img("fruit", "strawberry"),
    "pomegranate": _photo_ids_from_img("fruit", "apple"),
    "fig": _photo_ids_from_img("fruit", "apple"),
    "date": _photo_ids_from_img("fruit", "honey"),
    "cranberries": _photo_ids_from_img("fruit", "strawberry"),
    "cranberry": _photo_ids_from_img("fruit", "strawberry"),
    "currant": _photo_ids_from_img("fruit", "blueberry"),
    "coconut": _photo_ids_from_img("fruit", "pineapple"),
    "gooseberries": _photo_ids_from_img("fruit", "blueberry"),
    "gooseberry": _photo_ids_from_img("fruit", "blueberry"),
    "persimmon": _photo_ids_from_img("fruit", "apple"),
    "starfruit": _photo_ids_from_img("fruit", "pineapple"),
    "guava": _photo_ids_from_img("fruit", "pineapple"),
    "egg": _photo_ids_from_img("eggs", "dairy"),
    "duck egg": _photo_ids_from_img("eggs", "dairy"),
    "quail egg": _photo_ids_from_img("eggs", "dairy"),
    "yolk": _photo_ids_from_img("eggs", "dairy"),
    "egg white": _photo_ids_from_img("eggs", "dairy"),
    "milk": _photo_ids_from_img("milk", "dairy"),
    "chocolate milk": _photo_ids_from_img("milk", "dairy"),
    "goat milk": _photo_ids_from_img("milk", "dairy"),
    "half & half": _photo_ids_from_img("milk", "dairy"),
    "cream": _photo_ids_from_img("milk", "dairy"),
    "buttermilk": _photo_ids_from_img("milk", "dairy"),
    "yogurt": _photo_ids_from_img("dairy", "milk"),
    "butter": _photo_ids_from_img("dairy", "cheese"),
    "ghee": _photo_ids_from_img("dairy", "cheese"),
    "cheddar": _photo_ids_from_img("cheese", "dairy"),
    "gouda": _photo_ids_from_img("cheese", "dairy"),
    "mozzarella": _photo_ids_from_img("cheese", "dairy"),
    "feta": _photo_ids_from_img("cheese", "dairy"),
    "goat cheese": _photo_ids_from_img("cheese", "dairy"),
    "cottage cheese": _photo_ids_from_img("cheese", "dairy"),
    "ricotta": _photo_ids_from_img("cheese", "dairy"),
    "parmesan": _photo_ids_from_img("cheese", "dairy"),
    "sour cream": _photo_ids_from_img("cheese", "dairy"),
    "cream cheese": _photo_ids_from_img("cheese", "dairy"),
    "kefir": _photo_ids_from_img("milk", "dairy"),
    "mascarpone": _photo_ids_from_img("cheese", "dairy"),
    "halloumi": _photo_ids_from_img("cheese", "dairy"),
    "camembert": _photo_ids_from_img("cheese", "dairy"),
    "blue cheese": _photo_ids_from_img("cheese", "dairy"),
    "string cheese": _photo_ids_from_img("cheese", "dairy"),
    "honey": _photo_ids_from_img("honey", "produce"),
    "maple syrup": _photo_ids_from_img("honey", "produce"),
    "sorghum": _photo_ids_from_img("honey", "produce"),
    "olive oil": _photo_ids_from_img("olive", "produce"),
    "sunflower oil": _photo_ids_from_img("olive", "produce"),
    "vinegar": _photo_ids_from_img("olive", "produce"),
    "balsamic": _photo_ids_from_img("olive", "produce"),
    "oat": _photo_ids_from_img("bread", "produce"),
    "granola": _photo_ids_from_img("bread", "honey"),
    "lentil": _photo_ids_from_img("produce", "bread"),
    "chickpea": _photo_ids_from_img("produce", "bread"),
    "black bean": _photo_ids_from_img("produce", "bread"),
    "jam": _photo_ids_from_img("strawberry", "fruit"),
    "preserves": _photo_ids_from_img("fruit", "strawberry"),
    "apple butter": _photo_ids_from_img("apple", "honey"),
    "pasta": _photo_ids_from_img("bread", "produce"),
    "noodle": _photo_ids_from_img("bread", "produce"),
    "flour": _photo_ids_from_img("bread", "produce"),
    "wheat": _photo_ids_from_img("bread", "produce", "farm"),
    "cornmeal": _photo_ids_from_img("bread", "produce"),
    "salt": _photo_ids_from_img("produce", "olive"),
    "peppercorn": _photo_ids_from_img("pepper", "produce"),
    "tea": _photo_ids_from_img("spinach", "produce"),
    "lavender": _photo_ids_from_img("spinach", "honey"),
    "walnut": _photo_ids_from_img("produce", "bread"),
    "almond": _photo_ids_from_img("produce", "bread"),
    "pecan": _photo_ids_from_img("produce", "bread"),
    "pumpkin seed": _photo_ids_from_img("produce", "farm"),
    "pickle": _photo_ids_from_img("produce", "farm"),
    "sauerkraut": _photo_ids_from_img("produce", "cabbage" if False else "produce"),
    "kimchi": _photo_ids_from_img("produce", "pepper"),
    "bread": _photo_ids_from_img("bread", "produce"),
    "sourdough": _photo_ids_from_img("bread", "produce"),
    "rice": _photo_ids_from_img("produce", "bread"),
    "chilli": _photo_ids_from_img("pepper", "produce"),
    "chili": _photo_ids_from_img("pepper", "produce"),
}

# Deduplicate photo id lists per keyword
for kw, ids in list(_KEYWORD_PHOTOS.items()):
    seen: set[str] = set()
    clean: list[str] = []
    for pid in ids:
        if pid and pid not in seen:
            seen.add(pid)
            clean.append(pid)
    _KEYWORD_PHOTOS[kw] = clean or _photo_ids_from_img("produce")

_SORTED_KEYWORDS = sorted(_KEYWORD_PHOTOS.keys(), key=len, reverse=True)

_CATEGORY_FALLBACK: dict[str, list[str]] = {
    "Vegetables": _photo_ids_from_img("produce", "spinach", "broccoli", "carrot", "farm"),
    "Fruits": _photo_ids_from_img("fruit", "strawberry", "apple", "banana", "orange"),
    "Dairy & Eggs": _photo_ids_from_img("milk", "eggs", "dairy", "cheese", "farm"),
    "Pantry": _photo_ids_from_img("honey", "bread", "olive", "produce", "farm"),
}

_SPARE_FOOD_PHOTOS = list(dict.fromkeys(_photo_ids_from_img(*_img().keys())))


def _normalize(name: str) -> str:
    return (
        name.lower()
        .replace("é", "e")
        .replace("'", "")
        .replace("(", " ")
        .replace(")", " ")
    )


def keyword_for_name(name: str) -> str | None:
    n = _normalize(name)
    for keyword in _SORTED_KEYWORDS:
        if keyword in n:
            return keyword
    return None


def _variant_url(photo_id: str, variant: int) -> str:
    x = 0.12 + (variant % 6) * 0.11
    y = 0.18 + (variant % 5) * 0.09
    return f"{unsplash(photo_id).split('?')[0]}?{IMAGE_PARAMS}&fp-x={x:.2f}&fp-y={y:.2f}"


def _next_photo_id(keyword: str | None, category: str, used_ids: set[str], variant: int) -> str:
    candidates: list[str] = []
    if keyword and keyword in _KEYWORD_PHOTOS:
        candidates.extend(_KEYWORD_PHOTOS[keyword])
    candidates.extend(_CATEGORY_FALLBACK.get(category, []))
    candidates.extend(_SPARE_FOOD_PHOTOS)
    for photo_id in candidates:
        if photo_id not in used_ids:
            return photo_id
    for photo_id in candidates:
        return photo_id
    raise RuntimeError("Could not assign a food photo id; extend IMG keyword pools")


def image_url_for_product(name: str, category: str, used_urls: set[str], used_ids: set[str]) -> str:
    keyword = keyword_for_name(name)
    variant = len(used_urls)
    photo_id = _next_photo_id(keyword, category, used_ids, variant)
    used_ids.add(photo_id)
    url = _variant_url(photo_id, variant)
    attempts = 0
    while url in used_urls and attempts < 12:
        attempts += 1
        url = _variant_url(photo_id, variant + attempts)
    if url in used_urls:
        for spare in _SPARE_FOOD_PHOTOS:
            url = _variant_url(spare, variant + attempts)
            if url not in used_urls:
                break
    used_urls.add(url)
    return url