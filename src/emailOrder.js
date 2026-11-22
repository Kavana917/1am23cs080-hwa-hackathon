import emailjs from "@emailjs/browser";
import { money } from "./data.js";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SITE_URL = "https://rime-happy-hack.vercel.app";

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const assetUrl = (path) => `${SITE_URL}${path}`;

const productImage = (sku) => {
  if (sku === "RIME-ROD") return assetUrl("/assets/chill-rod.webp");
  if (sku === "RIME-SLEEVE") return assetUrl("/assets/sleeve-frost.webp");
  return assetUrl("/assets/rime-hero.webp");
};

const colorLabel = (color) =>
  color ? color.charAt(0).toUpperCase() + color.slice(1) : "";

export async function sendOrderConfirmation(order) {
  if (!emailConfigured) return { sent: false, reason: "not-configured" };

  const customer = order.customer || {};
  const items = order.items || [];
  const address = [customer.address, customer.city, customer.state, customer.pincode]
    .filter(Boolean)
    .join(", ");
  const date = new Date(order.createdAt).toLocaleString("en-IN");
  const shippingLabel = order.shippingLabel || order.shippingMethod || "Standard";
  const shippingCharge = order.shipping === 0 ? "Free" : money(order.shipping);
  const safeName = customer.name || "there";

  const itemAmount = (item) => item.lineTotal ?? (item.unitPrice || 0) * item.qty;

  const describeItem = (item) => {
    const color = colorLabel(item.color);
    const suffix = color ? ` (${color})` : "";
    return `${item.name}${suffix} × ${item.qty} — ${money(itemAmount(item))}`;
  };

  const itemLines = items.map(describeItem);
  const itemsPlain = itemLines.join("\n");
  const itemsInline = itemLines.join("; ");

  const itemRows = items
    .map((item) => {
      const color = colorLabel(item.color);
      const detail = [item.meta, color && `Colour: ${color}`].filter(Boolean).join(" · ");
      return `
        <tr>
          <td style="padding:12px 8px 12px 0;vertical-align:top;">
            <img src="${productImage(item.sku)}" alt="${escapeHtml(item.name)}" width="72" style="width:72px;height:auto;display:block;border-radius:8px;border:1px solid #e6d0c3;" />
          </td>
          <td style="padding:12px 8px 12px 0;vertical-align:top;font-family:Arial,sans-serif;color:#2a1418;">
            <strong style="font-size:15px;">${escapeHtml(item.name)}</strong>
            <br /><span style="font-size:12px;color:#6d4c52;">Qty ${Number(item.qty) || 1}${detail ? ` · ${escapeHtml(detail)}` : ""}</span>
          </td>
          <td style="padding:12px 0 12px 8px;vertical-align:top;text-align:right;font-family:Arial,sans-serif;color:#2a1418;font-size:15px;white-space:nowrap;">
            ${money(itemAmount(item))}
          </td>
        </tr>`;
    })
    .join("");

  const orderDetailsHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:18px;">
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:10px 0 0;border-top:1px solid #e6d0c3;font-family:Arial,sans-serif;font-size:13px;color:#6d4c52;">Subtotal</td>
        <td style="padding:10px 0 0;border-top:1px solid #e6d0c3;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#2a1418;">${money(order.subtotal)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#6d4c52;">Shipping · ${escapeHtml(shippingLabel)}</td>
        <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#2a1418;">${shippingCharge}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 0 0;border-top:2px solid #37161b;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#2a1418;">Total</td>
        <td style="padding:12px 0 0;border-top:2px solid #37161b;text-align:right;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#37161b;">${money(order.total)}</td>
      </tr>
    </table>`;

  const messageHtml = `
    <div style="background:#f8f1e5;padding:28px;font-family:Arial,sans-serif;color:#2a1418;">
      <img src="${assetUrl("/assets/rime-email-logo.png")}" alt="Rime" width="140" style="width:140px;height:auto;display:block;margin-bottom:22px;" />
      <h1 style="margin:0 0 8px;font-size:26px;color:#37161b;">Order confirmed</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;">Hi ${escapeHtml(safeName)}, thanks for ordering from Rime. You'll pay cash when your order arrives.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6d4c52;">
        <strong style="color:#37161b;">Order:</strong> ${escapeHtml(order.id)}<br />
        <strong style="color:#37161b;">Placed:</strong> ${escapeHtml(date)}<br />
        <strong style="color:#37161b;">Payment:</strong> Cash on delivery
      </p>
      ${orderDetailsHtml}
      <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#6d4c52;">
        <strong style="color:#37161b;">Deliver to:</strong> ${escapeHtml(customer.name)}<br />
        ${escapeHtml(address)}<br />
        Phone: ${escapeHtml(customer.phone)}
      </p>
      ${order.note ? `<p style="margin:18px 0 0;font-size:11px;line-height:1.5;color:#8a6b70;">${escapeHtml(order.note)}</p>` : ""}
    </div>`;

  const summary = [
    `Order ${order.id}`,
    `Placed ${date}`,
    `Items: ${itemsInline}`,
    `Deliver to: ${[customer.name, address].filter(Boolean).join(", ")}`,
    customer.phone ? `Phone: ${customer.phone}` : "",
    "Payment: Cash on delivery",
    `Shipping: ${shippingLabel} (${shippingCharge})`,
    `Subtotal: ${money(order.subtotal)}`,
    `Total: ${money(order.total)}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const messageText = `Hi ${safeName}, your Rime order ${order.id} is confirmed. ${summary} You'll pay cash when it arrives.`;
  const message = messageHtml;

  const rawMoney = (value) => Number(value || 0).toLocaleString("en-IN");
  const orders = items.map((item) => ({
    image_url: productImage(item.sku),
    name: item.name,
    units: item.qty,
    price: rawMoney(itemAmount(item)),
  }));
  const cost = {
    shipping: order.shipping === 0 ? "Free" : rawMoney(order.shipping),
    tax: "Included",
    total: rawMoney(order.total),
  };

  const templateParams = {
    to_email: customer.email,
    email: customer.email,
    to_name: customer.name,
    name: customer.name,
    from_name: "Rime",
    reply_to: customer.email,
    subject: `Rime order ${order.id} confirmed`,
    order_id: order.id,
    order_number: order.id,
    order: order.id,
    order_date: date,
    date,
    customer_name: customer.name,
    customer_email: customer.email,
    phone: customer.phone,
    customer_phone: customer.phone,
    address,
    delivery_address: address,
    payment_method: "Cash on delivery",
    payment: "Cash on delivery",
    shipping_method: shippingLabel,
    subtotal: money(order.subtotal),
    shipping: shippingCharge,
    total: money(order.total),
    total_price: money(order.total),
    total_amount: money(order.total),
    amount: money(order.total),
    price: rawMoney(order.total),
    orders,
    cost,
    website_link: SITE_URL,
    shipping_label: shippingLabel,
    items: itemsPlain,
    item_list: itemsPlain,
    order_items: itemsPlain,
    line_items: itemsPlain,
    products: itemsPlain,
    cart: itemsPlain,
    order_details: summary,
    order_summary: summary,
    summary,
    message,
    message_text: messageText,
    plain_message: messageText,
    content: messageHtml,
    body: messageHtml,
    html: messageHtml,
    message_html: messageHtml,
    email_body: messageHtml,
    order_details_html: orderDetailsHtml,
    order_items_html: itemRows,
    logo_url: assetUrl("/assets/rime-email-logo.png"),
    item_image: productImage(items[0]?.sku),
    item_images: items.map((item) => productImage(item.sku)).join(","),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
    return { sent: true };
  } catch (error) {
    console.warn("Rime: order confirmation email failed —", error?.message || error);
    return { sent: false, reason: error?.message || "send-failed" };
  }
}
