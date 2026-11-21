/**
 * Rime — prototype order endpoint.
 *
 * POST /api/orders
 *   body: { items: [{ sku, qty, color? }], customer: {...}, shippingMethod? }
 *   returns: { ok: true, order: {...} }
 *
 * GET /api/orders            -> service health + catalog summary
 * GET /api/orders?id=RIME-…  -> look up an order placed on this instance
 *
 * Orders are kept in memory for the life of the serverless instance. This is a
 * prototype storefront: no payment is taken and no order is shipped.
 */

const catalog = require("../catalog.json");

const MAX_ITEMS = 20;
const MAX_QTY = 10;
const MAX_ORDERS = 250;
const SAFETY =
  "Rime is a lick toy, not a chew toy. Supervise the first few sessions. Never give the Chill Rod directly to your dog. Use xylitol-free treats only.";

const orders = globalThis.__rimeOrders || (globalThis.__rimeOrders = new Map());

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  if (req.body == null) return null;
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
  if (!raw.trim()) return null;
  return JSON.parse(raw);
}

function clean(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function makeId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const salt = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `RIME-${stamp}${salt}`;
}

function validateCustomer(input) {
  const source = input && typeof input === "object" ? input : {};
  const customer = {
    name: clean(source.name, 80),
    email: clean(source.email, 120).toLowerCase(),
    phone: clean(source.phone, 24),
    address: clean(source.address, 180),
    city: clean(source.city, 60),
    state: clean(source.state, 60),
    pincode: clean(source.pincode, 6),
    notes: clean(source.notes, 300),
  };

  const errors = {};
  if (customer.name.length < 2) errors.name = "A name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email))
    errors.email = "A valid email is required.";
  if (customer.phone.replace(/[^\d]/g, "").length < 10)
    errors.phone = "A valid phone number is required.";
  if (customer.address.length < 6) errors.address = "A street address is required.";
  if (customer.city.length < 2) errors.city = "A city is required.";
  if (customer.state.length < 2) errors.state = "A state is required.";
  if (!/^\d{6}$/.test(customer.pincode)) errors.pincode = "A 6-digit PIN code is required.";

  return { customer, errors };
}

function buildOrder(input) {
  if (!input || typeof input !== "object") {
    return { error: "Send a JSON body with items and customer details." };
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (input.items.length > MAX_ITEMS) {
    return { error: `Too many line items (maximum ${MAX_ITEMS}).` };
  }

  const merged = new Map();
  for (const raw of input.items) {
    if (!raw || typeof raw !== "object") {
      return { error: "Each cart item needs a sku and quantity." };
    }
    const sku = clean(raw.sku, 40).toUpperCase();
    const product = catalog.products[sku];
    if (!product) return { error: `Unknown product: ${sku || "(blank)"}.` };

    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { error: `Quantity for ${sku} must be a whole number from 1 to ${MAX_QTY}.` };
    }

    let color = null;
    if (product.color) {
      color = clean(raw.color, 20).toLowerCase();
      if (!["glacier", "sage", "terracotta", "slate"].includes(color)) {
        color = "glacier";
      }
    }

    const key = `${sku}::${color || ""}`;
    const existing = merged.get(key);
    if (existing) {
      existing.qty = Math.min(MAX_QTY, existing.qty + qty);
    } else {
      merged.set(key, { sku, qty, color });
    }
  }

  const { customer, errors } = validateCustomer(input.customer);
  if (Object.keys(errors).length) {
    return {
      error: "Please check the delivery details and try again.",
      fields: errors,
    };
  }

  const method =
    input.shippingMethod === "express" ? "express" : "standard";

  const items = [...merged.values()].map((line) => {
    const product = catalog.products[line.sku];
    return {
      sku: line.sku,
      name: product.name,
      short: product.short,
      meta: product.meta,
      color: line.color,
      qty: line.qty,
      unitPrice: product.price,
      mrp: product.mrp,
      lineTotal: product.price * line.qty,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingConfig = catalog.shipping[method];
  const shipping =
    method === "standard" && subtotal >= catalog.freeShippingThreshold
      ? 0
      : shippingConfig.price;
  const total = subtotal + shipping;

  return {
    order: {
      id: makeId(),
      currency: catalog.currency,
      createdAt: new Date().toISOString(),
      items,
      customer,
      shippingMethod: method,
      shippingLabel: shippingConfig.label,
      shippingDetail: shippingConfig.detail,
      subtotal,
      shipping,
      total,
      status: "test-order",
      safety: SAFETY,
      note: "Prototype storefront — test order only. No payment was taken and nothing will ship.",
    },
  };
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method === "GET") {
    let id = "";
    if (req.query && typeof req.query.id === "string") {
      id = req.query.id;
    } else if (typeof req.url === "string") {
      try {
        const url = new URL(req.url, "https://rime.local");
        id = url.searchParams.get("id") || "";
      } catch {
        id = "";
      }
    }

    if (id) {
      const order = orders.get(clean(id, 40).toUpperCase());
      if (!order) {
        send(res, 404, { ok: false, error: "Order not found on this instance." });
        return;
      }
      send(res, 200, { ok: true, order });
      return;
    }

    send(res, 200, {
      ok: true,
      service: "rime-orders",
      status: "ready",
      currency: catalog.currency,
      freeShippingThreshold: catalog.freeShippingThreshold,
      shipping: catalog.shipping,
      products: Object.entries(catalog.products).map(([sku, product]) => ({
        sku,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        discountPercent: Math.round(((product.mrp - product.price) / product.mrp) * 100),
        savings: product.mrp - product.price,
      })),
      safety: SAFETY,
    });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    send(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    send(res, 400, { ok: false, error: "Invalid JSON body." });
    return;
  }

  const result = buildOrder(body);
  if (result.error) {
    send(res, 422, {
      ok: false,
      error: result.error,
      fields: result.fields || undefined,
    });
    return;
  }

  orders.set(result.order.id, result.order);
  if (orders.size > MAX_ORDERS) {
    const oldest = orders.keys().next().value;
    orders.delete(oldest);
  }

  send(res, 201, { ok: true, order: result.order });
};
