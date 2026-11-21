export const COLORS = {
  glacier: {
    name: "Glacier Mist",
    sub: "matte ice blue",
    hex: "#a9d3dd",
    tint: "#8cc6d3",
    opacity: 0.7,
  },
  sage: {
    name: "Sage Moss",
    sub: "muted green",
    hex: "#7c8f76",
    tint: "#6f8a6e",
    opacity: 0.72,
  },
  terracotta: {
    name: "Terracotta Clay",
    sub: "warm earth tone",
    hex: "#b06a4e",
    tint: "#b06a4e",
    opacity: 0.68,
  },
  slate: {
    name: "Slate Stone",
    sub: "matte charcoal",
    hex: "#3d474b",
    tint: "#3d474b",
    opacity: 0.6,
  },
};

export const COLOR_ORDER = ["glacier", "sage", "terracotta", "slate"];

export const money = (value) =>
  "\u20b9" + Number(value).toLocaleString("en-IN");

export const discountPercent = (mrp, price) =>
  Math.round(((mrp - price) / mrp) * 100);

export const itemKey = (sku, color) => `${sku}::${color || ""}`;

export const fullCartKey = (sku, color) =>
  `${sku}::${color || ""}`;
