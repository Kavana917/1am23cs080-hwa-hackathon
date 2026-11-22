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
  const rawMoney = (value) => Number(value || 0).toLocaleString("en-IN");

  const orderRows = items
    .map((item) => {
      const color = colorLabel(item.color);
      const detail = [item.meta, color && `Colour: ${color}`]
        .filter(Boolean)
        .join(" · ");
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

  const orderEmailHtml = `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px 8px;">
      <div style="max-width:600px;margin:auto;background:#fff;">
        <div style="border-top:6px solid #37161b;padding:16px;">
          <a href="${SITE_URL}" style="text-decoration:none;outline:none;vertical-align:middle;">
            <img src="${assetUrl("/assets/rime-email-logo.png")}" alt="Rime" width="120" style="width:120px;height:auto;vertical-align:middle;" />
          </a>
          <span style="font-size:16px;vertical-align:middle;border-left:1px solid #333;padding-left:8px;color:#37161b;">
            <strong>Thank You for Your Order</strong>
          </span>
        </div>
        <div style="padding:0 16px 16px;">
          <p style="font-size:14px;color:#333;">Hi ${escapeHtml(safeName)}, we'll send you tracking information when the order ships. You'll pay cash when it arrives.</p>
          <div style="font-size:14px;padding-bottom:6px;border-bottom:2px solid #37161b;color:#37161b;">
            <strong>Order # ${escapeHtml(order.id)}</strong>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            ${orderRows}
          </table>
          <div style="padding:16px 0 0;"><div style="border-top:2px solid #37161b;"></div></div>
          <table style="border-collapse:collapse;width:100%;text-align:right;">
            <tr>
              <td style="width:60%;"></td>
              <td style="font-size:14px;color:#333;">Subtotal</td>
              <td style="padding:6px 8px;white-space:nowrap;font-size:14px;color:#37161b;">${money(order.subtotal)}</td>
            </tr>
            <tr>
              <td style="width:60%;"></td>
              <td style="font-size:14px;color:#333;">Shipping · ${escapeHtml(shippingLabel)}</td>
              <td style="padding:6px 8px;white-space:nowrap;font-size:14px;color:#37161b;">${shippingCharge}</td>
            </tr>
            <tr>
              <td style="width:60%;"></td>
              <td style="font-size:14px;color:#333;">Taxes</td>
              <td style="padding:6px 8px;white-space:nowrap;font-size:14px;color:#37161b;">Included</td>
            </tr>
            <tr>
              <td style="width:60%;"></td>
              <td style="border-top:2px solid #37161b;font-size:14px;color:#37161b;"><strong>Order Total</strong></td>
              <td style="padding:12px 8px;border-top:2px solid #37161b;white-space:nowrap;font-size:16px;color:#37161b;"><strong>${money(order.total)}</strong></td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#6d4c52;">
            <strong style="color:#37161b;">Deliver to:</strong> ${escapeHtml(customer.name)}<br />
            ${escapeHtml(address)}<br />
            Phone: ${escapeHtml(customer.phone)}
          </p>
          ${order.note ? `<p style="margin:16px 0 0;font-size:11px;line-height:1.5;color:#8a6b70;">${escapeHtml(order.note)}</p>` : ""}
        </div>
      </div>
      <div style="max-width:600px;margin:auto;">
        <p style="color:#999;font-size:12px;">The email was sent to ${escapeHtml(customer.email)}<br />You received this email because you placed the order</p>
      </div>
    </div>`;

  const itemLines = items.map((item) => {
    const color = colorLabel(item.color);
    return `${item.name}${color ? ` (${color})` : ""} × ${item.qty} — ${money(itemAmount(item))}`;
  });
  const summary = [
    `Order ${order.id}`,
    `Placed ${date}`,
    `Items: ${itemLines.join("; ")}`,
    `Deliver to: ${[customer.name, address].filter(Boolean).join(", ")}`,
    customer.phone ? `Phone: ${customer.phone}` : "",
    "Payment: Cash on delivery",
    `Shipping: ${shippingLabel} (${shippingCharge})`,
    `Subtotal: ${money(order.subtotal)}`,
    `Taxes: Included`,
    `Total: ${money(order.total)}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const templateParams = {
    to_email: customer.email,
    email: customer.email,
    to_name: customer.name,
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
    customer_phone: customer.phone,
    delivery_address: address,
    payment_method: "Cash on delivery",
    shipping_method: shippingLabel,
    subtotal: money(order.subtotal),
    shipping: shippingCharge,
    tax: "Included",
    total: money(order.total),
    total_amount: money(order.total),
    "cost.shipping": shippingCharge,
    "cost.tax": "Included",
    "cost.total": Number(order.total || 0).toLocaleString("en-IN"),
    item_count: items.length,
    items: itemLines.join("\n"),
    order_details: summary,
    order_summary: summary,
    message_text: `Hi ${safeName}, your Rime order ${order.id} is confirmed. ${summary}`,
    order_email: orderEmailHtml,
    message: orderEmailHtml,
    logo_url: assetUrl("/assets/rime-email-logo.png"),
    website_link: SITE_URL,
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
