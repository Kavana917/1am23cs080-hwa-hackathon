import { COLORS } from "../data.js";

export function TintedProduct({ color = "glacier", className = "", alt = "", eager = false }) {
  const swatch = COLORS[color] || COLORS.glacier;
  return (
    <div className={`tint-product ${className}`.trim()}>
      <span className="tint-product__glow" aria-hidden="true" />
      <img
        src="/assets/rime-hero.webp"
        alt={alt}
        width="572"
        height="1185"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <span
        className="tint-product__tint"
        aria-hidden="true"
        style={{ "--tint": swatch.tint, opacity: swatch.opacity }}
      />
    </div>
  );
}
