export const DEFAULT_CATEGORIES = ["Vegetables", "Fruits", "Dairy & Eggs", "Pantry"];

export function slugifyCategory(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveCategory(param, names = DEFAULT_CATEGORIES) {
  if (!param) return "";
  const decoded = String(param).trim();
  const list = names.length ? names : DEFAULT_CATEGORIES;
  const byName = list.find((name) => name.toLowerCase() === decoded.toLowerCase());
  if (byName) return byName;
  const slug = slugifyCategory(decoded);
  return list.find((name) => slugifyCategory(name) === slug) || "";
}

export function categoryAnchorId(name) {
  return `category-${slugifyCategory(name)}`;
}
