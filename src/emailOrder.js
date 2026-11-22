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
  const items = (order.items || [])
    .map((item) => `${item.name} × ${item.qty}`)
    .join("\n");
  const date = new Date(order.createdAt).toLocaleString("en-IN");

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
    shipping_method: order.shippingLabel || order.shippingMethod,
    subtotal: money(order.subtotal),
    shipping: order.shipping === 0 ? "Free" : money(order.shipping),
    total: money(order.total),
    total_price: money(order.total),
    items,
    item_list: items,
    message: `Hi ${customer.name}, your Rime order ${order.id} is confirmed. You'll pay cash when it arrives.`,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: error?.message || "send-failed" };
  }
}
