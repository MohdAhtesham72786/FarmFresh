export const PLACEHOLDER_PRODUCT =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

/** Unique photos for the 20 landing-page products. */
export const PRODUCT_PHOTOS = {
  "Organic Heirloom Tomatoes":
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Fresh Strawberries":
    "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&w=800&q=80",
  "Farm Eggs (Dozen)":
    "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=800&q=80",
  "Raw Wildflower Honey":
    "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
  "Baby Spinach Bundle":
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "Rainbow Carrots":
    "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80",
  "Blueberry Pint":
    "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
  "Whole Milk (1L)":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  "Sourdough Loaf":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
  "Hass Avocados (3 pack)":
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
  "Honeycrisp Apples":
    "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=800&q=80",
  "Sharp Cheddar Wedge":
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
  "Extra Virgin Olive Oil":
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
  "Broccoli Crowns":
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80",
  "Red Bell Peppers":
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  "Bing Cherries":
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
  "Navel Oranges":
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
  "Cauliflower Head":
    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80",
  "Cavendish Bananas":
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  "Yukon Gold Potatoes":
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  "Gold Pineapple":
    "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
};

export const LANDING_PRODUCT_NAMES = [
  "Organic Heirloom Tomatoes",
  "Fresh Strawberries",
  "Farm Eggs (Dozen)",
  "Raw Wildflower Honey",
  "Rainbow Carrots",
  "Blueberry Pint",
  "Whole Milk (1L)",
  "Sourdough Loaf",
  "Hass Avocados (3 pack)",
  "Honeycrisp Apples",
  "Sharp Cheddar Wedge",
  "Extra Virgin Olive Oil",
  "Broccoli Crowns",
  "Red Bell Peppers",
  "Bing Cherries",
  "Navel Oranges",
  "Cauliflower Head",
  "Cavendish Bananas",
  "Yukon Gold Potatoes",
  "Gold Pineapple",
];

const CATEGORY_PHOTOS = {
  Vegetables: PRODUCT_PHOTOS["Rainbow Carrots"],
  Fruits: PRODUCT_PHOTOS["Fresh Strawberries"],
  "Dairy & Eggs": PRODUCT_PHOTOS["Farm Eggs (Dozen)"],
  Pantry: PRODUCT_PHOTOS["Raw Wildflower Honey"],
};

export function productImage(url, name, category) {
  const value = url?.trim();
  if (value && (value.startsWith("http") || value.startsWith("/uploads/"))) return value;
  if (name && PRODUCT_PHOTOS[name]) return PRODUCT_PHOTOS[name];
  if (category && CATEGORY_PHOTOS[category]) return CATEGORY_PHOTOS[category];
  return PLACEHOLDER_PRODUCT;
}

export function onImgError(e) {
  const img = e.currentTarget;
  const name = img.dataset.productName;
  const category = img.dataset.productCategory;
  const tried = Number(img.dataset.fallbackStep || "0");
  if (tried === 0 && name && PRODUCT_PHOTOS[name]) {
    img.dataset.fallbackStep = "1";
    img.src = PRODUCT_PHOTOS[name];
    return;
  }
  if (tried <= 1 && category && CATEGORY_PHOTOS[category]) {
    img.dataset.fallbackStep = "2";
    img.src = CATEGORY_PHOTOS[category];
    return;
  }
  img.onerror = null;
  img.src = PLACEHOLDER_PRODUCT;
}
