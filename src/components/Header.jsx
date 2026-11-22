import { Icon } from "./Icon.jsx";
import { useStore } from "../context/StoreContext.jsx";

const OFFERS = [
  "Launch price — Standard ₹3,999",
  "Save 33% on the launch",
  "Free shipping over ₹4,500",
  "Ships in 1–2 business days",
];

export function Ticker() {
  const line = [...OFFERS, ...OFFERS, ...OFFERS, ...OFFERS];
  return (
    <div className="ticker" role="region" aria-label="Launch offer">
      <div className="ticker__track">
        {line.map((text, index) => (
          <span key={`${text}-${index}`}>
            {text}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const { cartCount, openCart, menuOpen, setMenuOpen } = useStore();
  return (
    <header className="nav" id="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="#top" aria-label="Rime home">
          RIME<sup>™</sup>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#design">Design</a>
          <a href="#safety">Safety</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="nav__actions">
          <button className="cart-link" type="button" onClick={() => openCart("cart")} aria-label="Open cart">
            <Icon name="bag" />
            <span className="cart-link__label">Cart</span>
            <span className="cart-count" key={cartCount}>{cartCount}</span>
          </button>
          <a className="btn btn--dark btn--sm" href="#shop">
            Shop Rime <Icon name="arrow" />
          </a>
          <button
            className="menu-btn"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileMenu() {
  const { menuOpen, setMenuOpen, openCart, cartCount } = useStore();
  return (
    <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobileMenu" aria-hidden={!menuOpen}>
      <div className="mobile-menu__head">
        <span className="mono">RIME™ — MENU</span>
        <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <Icon name="close" />
        </button>
      </div>
      <nav className="mobile-menu__links" aria-label="Mobile">
        {[
          ["01", "How it works", "#how"],
          ["02", "Design", "#design"],
          ["03", "Safety", "#safety"],
          ["04", "Shop", "#shop"],
          ["05", "FAQ", "#faq"],
        ].map(([num, label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            <span>{num}</span>
            {label}
          </a>
        ))}
      </nav>
      <div className="mobile-menu__foot">
        <p>
          Frozen lick &amp; hydration column for dogs.
          <br />
          Designed for a 3–4 hour session.
        </p>
        <button className="btn btn--light" type="button" onClick={() => openCart("cart")}>
          Cart ({cartCount}) <Icon name="arrow" />
        </button>
      </div>
    </div>
  );
}
