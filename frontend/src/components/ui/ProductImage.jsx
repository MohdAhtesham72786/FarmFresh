import { useState } from "react";
import { onImgError, productImage } from "../../utils/images";

const loadingClass =
  "animate-pulse bg-gradient-to-br from-cream-100 to-forest-100/40 object-cover";

/**
 * Consistent 4:3 product photo with lazy loading and fallback.
 */
export default function ProductImage({
  src,
  name,
  category,
  alt = "",
  className = "",
  sizes,
  loading = "lazy",
  decoding = "async",
}) {
  const [loaded, setLoaded] = useState(false);
  const resolved = productImage(src, name, category);

  return (
    <img
      src={resolved}
      alt={alt || name || "Product"}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      data-product-name={name || ""}
      data-product-category={category || ""}
      data-fallback-step="0"
      className={`${className} ${loaded ? "" : loadingClass}`}
      onLoad={() => setLoaded(true)}
      onError={onImgError}
    />
  );
}