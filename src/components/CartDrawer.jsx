import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import { COLORS, itemKey, money } from "../data.js";
import { Icon } from "./Icon.jsx";
import { sendOrderConfirmation } from "../emailOrder.js";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

export function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    view,
    cartCount,
    cart,
    subtotal,
    shippingCost,
    total,
    shippingMethod,
    setShippingMethod,
    changeQty,
    removeItem,
    addItem,
    catalog,
    completeOrder,
    lastOrder,
    setView,
  } = useStore();

  const dialogRef = useRef(null);
  const closeTimer = useRef(null);
  const [emailStatus, setEmailStatus] = useState("idle");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (cartOpen) {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (!dialog.open) dialog.showModal();
      const frame = window.requestAnimationFrame(() => dialog.classList.add("is-open"));
      return () => window.cancelAnimationFrame(frame);
    }

    dialog.classList.remove("is-open");
    closeTimer.current = window.setTimeout(() => {
      if (dialog.open) dialog.close();
    }, 480);
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onCancel = (event) => {
      event.preventDefault();
      closeCart();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [cartOpen, closeCart]);

  const handleBackdrop = (event) => {
    if (event.target === dialogRef.current) closeCart();
  };

  const heading =
    view === "checkout" ? "Checkout" : view === "success" ? "Confirmed" : "Your cart";

  return (
    <dialog className="drawer" ref={dialogRef} onClick={handleBackdrop} aria-label="Shopping cart">
      <div className="drawer__inner">
        <div className="drawer__head">
          <div>
            <span className="mono">{heading}</span>
            <h2>
              {view === "cart" && (
                <>
                  Cart <span className="drawer__count mono">{cartCount}</span>
                </>
              )}
              {view === "checkout" && "Almost there"}
              {view === "success" && "Order placed"}
            </h2>
          </div>
          <button className="icon-btn" type="button" onClick={closeCart} aria-label="Close cart">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer__body" id="cartBody">
          {view === "cart" && (
            <CartView
              cart={cart}
              catalog={catalog}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              shippingMethod={shippingMethod}
              changeQty={changeQty}
              removeItem={removeItem}
              addItem={addItem}
              setView={setView}
              closeCart={closeCart}
            />
          )}

          {view === "checkout" && (
            <CheckoutView
              cart={cart}
              catalog={catalog}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              setView={setView}
              completeOrder={completeOrder}
              setEmailStatus={setEmailStatus}
            />
          )}

          {view === "success" && (
            <SuccessView
              order={lastOrder}
              closeCart={closeCart}
              catalog={catalog}
              emailStatus={emailStatus}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

function CartView({
  cart,
  catalog,
  subtotal,
  shippingCost,
  total,
  shippingMethod,
  changeQty,
  removeItem,
  addItem,
  setView,
  closeCart,
}) {
  if (!cart.length) {
    return (
      <div className="cart-empty">
        <span className="cart-empty__icon" aria-hidden="true">
          <Icon name="bag" />
        </span>
        <h3>Nothing here yet.</h3>
        <p>Your dog is waiting. Start with a Standard or XL column.</p>
        <button
          className="btn btn--dark"
          type="button"
          onClick={() => {
            closeCart();
            window.setTimeout(() => {
              document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
            }, 380);
          }}
        >
          Shop Rime <Icon name="arrow" />
        </button>
      </div>
    );
  }

  const threshold = catalog.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const hasColumn = cart.some((item) => item.sku === "RIME-STD" || item.sku === "RIME-XL");
  const hasRod = cart.some((item) => item.sku === "RIME-ROD");

  return (
    <>
      <div className="cart-items">
        {cart.map((item) => {
          const product = catalog.products[item.sku];
          if (!product) return null;
          const key = itemKey(item.sku, item.color);
          const colorName = item.color && COLORS[item.color] ? COLORS[item.color].name : null;
          return (
            <div className="cart-item" key={key}>
              <div className="cart-item__thumb">
                <img
                  src={
                    product.kind === "column" || product.kind === "bundle"
                      ? "/assets/rime-hero.webp?v=20261122c"
                      : product.kind === "rod"
                        ? "/assets/chill-rod.webp?v=20261122c"
                        : "/assets/sleeve-frost.webp?v=20261122c"
                  }
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div>
                <div className="cart-item__top">
                  <div>
                    <div className="cart-item__name">{product.name}</div>
                    <div className="cart-item__meta">
                      {product.meta}
                      {colorName ? ` · ${colorName}` : ""}
                    </div>
                  </div>
                  <span className="cart-item__price">{money(product.price * item.qty)}</span>
                </div>
                <div className="cart-item__bottom">
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => changeQty(key, -1)}
                      aria-label={`Decrease quantity of ${product.short}`}
                    >
                      <Icon name="minus" />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(key, 1)}
                      aria-label={`Increase quantity of ${product.short}`}
                    >
                      <Icon name="plus" />
                    </button>
                  </div>
                  <button
                    className="cart-item__remove"
                    type="button"
                    onClick={() => removeItem(key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasColumn && !hasRod && (
        <div className="upsell">
          <span className="upsell__icon" aria-hidden="true">
            <Icon name="snow" />
          </span>
          <div className="upsell__body">
            <strong>Add a spare Chill Rod</strong>
            <span>Keep one frozen for the next day. ₹999</span>
          </div>
          <button
            className="add-btn"
            type="button"
            aria-label="Add a spare Chill Rod"
            onClick={() => addItem("RIME-ROD", null)}
          >
            <Icon name="plus" />
          </button>
        </div>
      )}

      <div className="ship-bar">
        <div className="ship-bar__text">
          <span>
            {remaining > 0 ? (
              <>
                You&rsquo;re <strong>{money(remaining)}</strong> away from free shipping.
              </>
            ) : (
              <strong>Free standard shipping unlocked.</strong>
            )}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="ship-bar__track">
          <span className="ship-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="cart-summary">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="cart-summary__row">
          <span>
            Shipping · {shippingMethod === "express" ? "Express 2-day" : "Standard"}
          </span>
          <strong>{shippingCost === 0 ? "Free" : money(shippingCost)}</strong>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
        <span className="cart-summary__tax">Inclusive of GST · Prices in INR</span>
      </div>

      <div className="cart-actions">
        <button className="btn btn--dark btn--full" type="button" onClick={() => setView("checkout")}>
          Checkout <Icon name="arrow" />
        </button>
        <button className="btn btn--ghost btn--full" type="button" onClick={closeCart}>
          Keep shopping
        </button>
      </div>

    </>
  );
}

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  const digits = form.phone.replace(/[^\d]/g, "");
  if (digits.length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (form.address.trim().length < 6) errors.address = "Enter your street address.";
  if (form.city.trim().length < 2) errors.city = "Enter your city.";
  if (form.state.trim().length < 2) errors.state = "Enter your state.";
  if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = "Enter a 6-digit PIN code.";
  return errors;
}

function CheckoutView({
  cart,
  catalog,
  subtotal,
  shippingCost,
  total,
  shippingMethod,
  setShippingMethod,
  setView,
  completeOrder,
  setEmailStatus,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    if (paymentMethod !== "cod") {
      setPaymentError("Please choose cash on delivery to place your order.");
      return;
    }
    setPaymentError("");

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            sku: item.sku,
            qty: item.qty,
            color: item.color,
          })),
          customer: form,
          shippingMethod,
          paymentMethod: "cod",
        }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(
          payload?.error || "We couldn't place that order. Please check your details and try again."
        );
      }

      sendOrderConfirmation(payload.order).then((emailResult) => {
        setEmailStatus(emailResult.sent ? "sent" : "failed");
      });
      completeOrder(payload.order);
    } catch (error) {
      setServerError(
        error.message ||
          "We couldn't reach the order service. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <button className="checkout__back" type="button" onClick={() => setView("cart")}>
        <Icon name="arrow" /> Back to cart
      </button>

      <h3>Delivery details</h3>

      <div className="form-grid">
        <Field
          id="name"
          label="Full name"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="phone"
          label="Phone"
          value={form.phone}
          onChange={update("phone")}
          error={errors.phone}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="98765 43210"
        />
        <Field
          id="email"
          label="Email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          type="email"
          autoComplete="email"
          full
        />
        <Field
          id="address"
          label="Street address"
          value={form.address}
          onChange={update("address")}
          error={errors.address}
          autoComplete="street-address"
          full
        />
        <Field
          id="city"
          label="City"
          value={form.city}
          onChange={update("city")}
          error={errors.city}
          autoComplete="address-level2"
        />
        <Field
          id="state"
          label="State"
          value={form.state}
          onChange={update("state")}
          error={errors.state}
          autoComplete="address-level1"
        />
        <Field
          id="pincode"
          label="PIN code"
          value={form.pincode}
          onChange={update("pincode")}
          error={errors.pincode}
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
        />
        <Field
          id="notes"
          label="Delivery notes (optional)"
          value={form.notes}
          onChange={update("notes")}
          autoComplete="off"
        />
      </div>

      <div className="ship-method" role="radiogroup" aria-label="Shipping method">
        <label className="ship-method__opt">
          <input
            type="radio"
            name="shipping"
            value="standard"
            checked={shippingMethod === "standard"}
            onChange={() => setShippingMethod("standard")}
          />
          <span>
            Standard delivery · 3–5 business days
          </span>
          <strong>
            {catalog.freeShippingThreshold <= subtotal ? "Free" : money(catalog.shipping.standard.price)}
          </strong>
        </label>
        <label className="ship-method__opt">
          <input
            type="radio"
            name="shipping"
            value="express"
            checked={shippingMethod === "express"}
            onChange={() => setShippingMethod("express")}
          />
          <span>Express 2-day delivery</span>
          <strong>{money(catalog.shipping.express.price)}</strong>
        </label>
      </div>

      <h3>Payment</h3>
      <div className="payment-method" role="radiogroup" aria-label="Payment method">
        <label
          className={`payment-method__opt${paymentMethod === "cod" ? " is-selected" : ""}`}
        >
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => {
              setPaymentMethod("cod");
              setPaymentError("");
            }}
          />
          <span className="payment-method__dot" aria-hidden="true" />
          <span className="payment-method__text">
            <strong>Cash on delivery</strong>
            <small>Pay in cash when your order arrives. No card or UPI needed.</small>
          </span>
        </label>
      </div>
      {paymentError && (
        <p className="payment-error" role="alert">
          {paymentError}
        </p>
      )}

      <div className="checkout__summary">
        <div className="cart-summary__row">
          <span>{cart.reduce((sum, item) => sum + item.qty, 0)} items</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="cart-summary__row">
          <span>Shipping</span>
          <strong>{shippingCost === 0 ? "Free" : money(shippingCost)}</strong>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
      </div>

      <div className={`checkout__error ${serverError ? "is-visible" : ""}`} role="alert">
        {serverError}
      </div>

      <button className="btn btn--dark btn--full" type="submit" disabled={submitting}>
        {submitting ? "Placing order…" : "Place Order"} <Icon name="lock" />
      </button>

      <p className="checkout__legal">
        Ships in 1–2 business days. This is a prototype storefront, so this order is a test
        order and will not be charged or shipped.
      </p>

    </form>
  );
}

function Field({ id, label, error, full = false, ...props }) {
  return (
    <div className={`field ${full ? "field--full" : ""} ${error ? "has-error" : ""}`.trim()}>
      <label htmlFor={`field-${id}`}>{label}</label>
      <input id={`field-${id}`} name={id} {...props} />
      <span className="field__error">{error}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Success                                                             */
/* ------------------------------------------------------------------ */

function SuccessView({ order, closeCart, catalog, emailStatus }) {
  if (!order) {
    return (
      <div className="cart-empty">
        <h3>No recent order.</h3>
        <p>Add something to your cart to place a test order.</p>
        <button className="btn btn--dark" type="button" onClick={closeCart}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="success">
      <span className="success__icon" aria-hidden="true">
        <Icon name="check" />
      </span>
      <h3>Order placed! Thanks for choosing Rime.</h3>
      <p>
        Your order number is <strong>#{order.id}</strong>. We&rsquo;ll email your tracking details
        when it ships.
      </p>
      {emailStatus === "sent" && (
        <p className="email-status email-status--ok">
          A confirmation email has been sent to {order.customer?.email}.
        </p>
      )}
      {emailStatus === "failed" && (
        <p className="email-status email-status--error">
          We couldn&rsquo;t send the confirmation email. Please note your order number above.
        </p>
      )}

      <span className="success__order">
        Order <strong>{order.id}</strong>
      </span>

      <div className="success__card">
        <h4>Before your first session</h4>
        <ol>
          <li>Freeze your Chill Rod for at least 4 hours — overnight is best.</li>
          <li>Supervise the first few sessions.</li>
          <li>Use xylitol-free treats only.</li>
        </ol>
      </div>

      <div className="success__items">
        {order.items.map((item) => (
          <div className="success__item" key={`${item.sku}-${item.color || "std"}`}>
            <span>
              {catalog.products[item.sku]?.short || item.sku} × {item.qty}
              {item.color && COLORS[item.color] ? ` · ${COLORS[item.color].name}` : ""}
            </span>
            <strong>{money(item.lineTotal)}</strong>
          </div>
        ))}
        <div className="success__item">
          <span>Shipping</span>
          <strong>{order.shipping === 0 ? "Free" : money(order.shipping)}</strong>
        </div>
        <div className="success__item">
          <span>Total paid (test order)</span>
          <strong>{money(order.total)}</strong>
        </div>
      </div>

      <button className="btn btn--dark btn--full" type="button" onClick={closeCart}>
        Continue browsing <Icon name="arrow" />
      </button>
    </div>
  );
}
