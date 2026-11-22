import { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import { money, discountPercent } from "../data.js";
import { Icon } from "./Icon.jsx";
import { TintedProduct } from "./TintedProduct.jsx";

function Price({ mrp, price, light = false }) {
  const save = mrp - price;
  const pct = discountPercent(mrp, price);
  return (
    <div className={`price ${light ? "price--light" : ""}`.trim()}>
      <span className="price__now">
        <span className="mono">Launch price</span>
        <strong>{money(price)}</strong>
      </span>
      <span className="price__was">
        <span className="mono">MRP</span>
        <s>{money(mrp)}</s>
      </span>
      <span className="price__save">
        Save {money(save)} · {pct}% off
      </span>
    </div>
  );
}

export function Shop() {
  const { color, addItem, openCart, catalog } = useStore();
  const [bundleAdded, setBundleAdded] = useState(false);

  const handleAdd = (sku, selected = color) => {
    addItem(sku, selected);
    openCart("cart");
  };

  const handleBundle = () => {
    addItem("RIME-BUNDLE", color);
    setBundleAdded(true);
    openCart("cart");
  };

  return (
    <section className="section shop" id="shop">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__line" />
              Shop the launch edit
            </p>
            <h2 className="h2" data-reveal style={{ "--d": "60ms" }}>
              Pick your
              <br />
              <em>size.</em>
            </h2>
          </div>
          <p className="section-head__lede section-head__lede--right" data-reveal style={{ "--d": "120ms" }}>
            Launch prices, inclusive of GST. MRP shown struck through. Every column ships with one
            Chill Rod, one honeycomb sleeve and a travel cap.
          </p>
        </div>

        <div className="shop__grid">
          <article className="product-card" data-reveal>
            <div className="product-card__media">
              <span className="product-card__badge mono">Launch price</span>
              <span className="product-card__size mono">18 oz / 530 ml</span>
              <div className="product-card__stage">
                <span className="product-card__glow" aria-hidden="true" />
                <TintedProduct
                  className="tint-product--card"
                  color={color}
                  alt="Rime Standard column"
                />
              </div>
            </div>
            <div className="product-card__body">
              <div className="product-card__title">
                <h3>Rime™ Standard</h3>
                <span className="product-card__sub mono">Small &amp; medium dogs · up to 40 lbs</span>
              </div>
              <p className="product-card__desc">
                The everyday size. 18 oz insulated base, sealed Chill Rod, honeycomb sleeve and
                travel cap. Designed for a <strong>3–4 hour session</strong>.
              </p>
              <Price mrp={6000} price={3999} />
              <span className="product-card__ship">
                <Icon name="truck" />
                Free standard shipping over ₹4,500 · otherwise ₹99
              </span>
              <button
                className="btn btn--dark btn--full"
                type="button"
                onClick={() => handleAdd("RIME-STD")}
              >
                Add to cart <Icon name="plus" />
              </button>
            </div>
          </article>

          <article className="product-card product-card--dark" data-reveal style={{ "--d": "80ms" }}>
            <div className="product-card__media">
              <span className="product-card__badge mono">Launch price</span>
              <span className="product-card__size mono">28 oz / 830 ml</span>
              <div className="product-card__stage">
                <span className="product-card__glow" aria-hidden="true" />
                <TintedProduct
                  className="tint-product--card"
                  color={color}
                  alt="Rime XL column"
                />
              </div>
            </div>
            <div className="product-card__body">
              <div className="product-card__title">
                <h3>Rime™ XL</h3>
                <span className="product-card__sub mono">Large &amp; giant dogs · 40+ lbs</span>
              </div>
              <p className="product-card__desc">
                More reservoir, more sleeve, same session length. 28 oz insulated base with an XL
                Chill Rod and XL honeycomb sleeve.
              </p>
              <Price mrp={7500} price={4999} />
              <span className="product-card__ship">
                <Icon name="truck" />
                Free standard shipping · ships in 1–2 business days
              </span>
              <button
                className="btn btn--light btn--full"
                type="button"
                onClick={() => handleAdd("RIME-XL")}
              >
                Add to cart <Icon name="plus" />
              </button>
            </div>
          </article>
        </div>

        <div className="shop__extras">
          <div className="bundle" data-reveal>
            <div className="bundle__media">
              <img
                src="/assets/sleeve-spin.webp"
                alt="Rime sleeve and spare chill rod arranged for the Back-to-Back bundle"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bundle__body">
              <span className="pill pill--oxblood">
                <Icon name="snow" />
                Save ₹3,201
              </span>
              <h3>The “Back-to-Back” Bundle</h3>
              <p>
                One Standard column, a spare sealed Chill Rod and two extra sleeves — so a second
                frozen session is always ready the next day.
              </p>
              <Price mrp={8700} price={5499} light />
              <span className="bundle__note mono">
                ₹397 less than buying the parts separately at launch prices
              </span>
              <button className="btn btn--light btn--full" type="button" onClick={handleBundle}>
                {bundleAdded ? "Added to cart" : "Add the bundle"} <Icon name="plus" />
              </button>
            </div>
          </div>

          <div className="addons">
            <article className="addon" data-reveal style={{ "--d": "60ms" }}>
              <span className="addon__icon" aria-hidden="true">
                <Icon name="snow" />
              </span>
              <div className="addon__body">
                <h3>Spare Sealed Chill Rod</h3>
                <p>Keep one frozen and ready for the next session.</p>
                <div className="addon__price">
                  <strong>{money(999)}</strong>
                  <s>{money(1500)}</s>
                  <span className="mono">Save 33%</span>
                </div>
              </div>
              <button
                className="add-btn"
                type="button"
                aria-label="Add spare Chill Rod to cart"
                onClick={() => handleAdd("RIME-ROD", null)}
              >
                <Icon name="plus" />
              </button>
            </article>

            <article className="addon" data-reveal style={{ "--d": "120ms" }}>
              <span className="addon__icon" aria-hidden="true">
                <Icon name="hex" />
              </span>
              <div className="addon__body">
                <h3>Replacement Honeycomb Sleeve</h3>
                <p>A fresh sleeve when one wears out. Standard or XL fit.</p>
                <div className="addon__price">
                  <strong>{money(449)}</strong>
                  <s>{money(600)}</s>
                  <span className="mono">Save 25%</span>
                </div>
              </div>
              <button
                className="add-btn"
                type="button"
                aria-label="Add replacement sleeve to cart"
                onClick={() => handleAdd("RIME-SLEEVE", null)}
              >
                <Icon name="plus" />
              </button>
            </article>
          </div>
        </div>

        <div className="shop__notes">
          <div>
            <Icon name="truck" />
            <span>
              <strong>Free standard shipping</strong> on orders of ₹4,500 and above. ₹99 flat below
              that, 3–5 business days.
            </span>
          </div>
          <div>
            <Icon name="return" />
            <span>
              <strong>30-day returns</strong> on unused or lightly used items, for a refund.
            </span>
          </div>
          <div>
            <Icon name="shield" />
            <span>
              <strong>2-year limited warranty</strong> on vacuum insulation and stainless-steel
              seals.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
