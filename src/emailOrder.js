import emailjs from "@emailjs/browser";
import { money } from "./data.js";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export async function sendOrderConfirmation(order) {
  if (!emailConfigured) return { sent: false, reason: "not-configured" };

  const customer = order.customer || {};
  const address = [customer.address, customer.city, customer.state, customer.pincode]
    .filter(Boolean)
    .join(", ");
  const describeItem = (item) => {
    const color = item.color
      ? ` (${item.color.charAt(0).toUpperCase()}${item.color.slice(1)})`
      : "";
    const amount = item.lineTotal ?? (item.unitPrice || 0) * item.qty;
    return `${item.name}${color} × ${item.qty} — ${money(amount)}`;
  };
  const items = (order.items || []).map(describeItem).join("\n");
  const itemsInline = (order.items || []).map(describeItem).join("; ");
  const date = new Date(order.createdAt).toLocaleString("en-IN");
  const shippingLabel = order.shippingLabel || order.shippingMethod || "Standard";
  const shippingCharge = order.shipping === 0 ? "Free" : money(order.shipping);
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
  const message = `Hi ${customer.name || "there"}, your Rime order ${order.id} is confirmed. ${summary} You'll pay cash when it arrives.`;

  const templateParams = {
    to_email: customer.email,
    email: customer.email,
    to_name: customer.name,
    name: customer.name,
    from_name: "Rime",
    reply_to: customer.email,
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
    items,
    item_list: items,
    order_summary: summary,
    summary,
    message,
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
