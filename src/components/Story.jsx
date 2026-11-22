import { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import { Icon } from "./Icon.jsx";

/* ------------------------------------------------------------------ */
/* Safety                                                              */
/* ------------------------------------------------------------------ */

const SAFETY_POINTS = [
  {
    title: "Supervise the first few sessions",
    body: "Watch how your dog uses Rime before leaving them alone with it.",
  },
  {
    title: "Never give the rod to your dog",
    body: "The Chill Rod stays inside the sleeve and column at all times.",
  },
  {
    title: "Match the size to your dog",
    body: "Standard is for small and medium dogs up to 40 lbs. XL is for large and giant dogs, 40+ lbs.",
  },
  {
    title: "Check before every session",
    body: "Inspect the sleeve, valve and collar. Replace anything cracked, torn or loose.",
  },
  {
    title: "Treats and calories",
    body: "Use only xylitol-free peanut butter and plain, unsweetened yogurt. Treat-loaded sessions add calories.",
  },
];

export function Safety() {
  const { setSafetyOpen } = useStore();

  return (
    <section className="section safety" id="safety">
      <div className="container">
        <div className="safety__head">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__line" />
            Dog safety
          </p>
          <h2 className="h2" data-reveal style={{ "--d": "60ms" }}>
            Built for lickers.
            <br />
            <em>Backed by care.</em>
          </h2>
        </div>

        <div className="safety__grid">
          <ul className="safety__list" data-reveal style={{ "--d": "80ms" }}>
            {SAFETY_POINTS.map((point) => (
              <li key={point.title}>
                <Icon name="check" />
                <div>
                  <strong>{point.title}</strong>
                  <span>{point.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="safety__foot">
          <p>
            <strong>Not a substitute for care.</strong> Always make sure your dog has access to
            fresh water, exercise and company. Check with your vet first if your dog has dental
            problems, a medical condition, a food allergy or a restricted diet.
          </p>
          <button className="btn btn--dark" type="button" onClick={() => setSafetyOpen(true)}>
            Read the full safety guide <Icon name="arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "How long does Rime last?",
    a: "Rime is designed for a 3–4 hour session at normal indoor room temperature (68–75°F / 20–24°C). Time varies with temperature, treat choice and how quickly your dog licks.",
  },
  {
    q: "How do I refreeze it?",
    a: "Wash and dry the Chill Rod, then freeze it for at least 4 hours — overnight is best — at 0°F / −18°C or colder. Never microwave the rod or put it through a heated dry cycle.",
  },
  {
    q: "What can I put on the sleeve?",
    a: "Plain unsweetened yogurt, mashed banana, pumpkin puree or xylitol-free peanut butter. Always check labels for xylitol, and skip anything your dog is allergic to.",
  },
  {
    q: "Will it make a mess?",
    a: "The drip-catch collar is designed to hold melting droplets and condensation during a normal session. It is not a sealed container, so a towel under it is still a sensible idea for very messy loaders.",
  },
  {
    q: "Can my dog chew it?",
    a: "No. Rime is a lick toy. If your dog chews silicone, do not use Rime unattended, and stop using any sleeve that shows cuts, tears or loose pieces.",
  },
  {
    q: "Is it dishwasher safe?",
    a: "Sleeves and the collar gasket are top-rack dishwasher safe. The Chill Rod and base are hand-wash only. Never microwave the rod.",
  },
  {
    q: "What is the return policy?",
    a: "A 30-day return window on unused or lightly used items, plus a 2-year limited warranty on vacuum insulation and stainless-steel seals.",
  },
  {
    q: "Where do you ship?",
    a: "This is a prototype storefront, so orders placed here are test orders rather than live shipments. The shipping, return and warranty terms shown are the intended terms for the product.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="faq">
      <div className="container faq__grid">
        <div className="faq__head">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__line" />
            Questions
          </p>
          <h2 className="h2" data-reveal style={{ "--d": "60ms" }}>
            Good
            <br />
            <em>questions.</em>
          </h2>
          <p data-reveal style={{ "--d": "120ms" }}>
            Straight answers about cold, cleaning, chewing and the honest limits of a session.
          </p>
        </div>

        <div data-reveal style={{ "--d": "80ms" }}>
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div className={`acc ${isOpen ? "is-open" : ""}`} key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="acc__btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-btn-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    {item.q}
                    <span className="acc__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="acc__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

export function FinalCta() {
  return (
    <section className="final">
      <div className="final__glow" aria-hidden="true" />
      <div className="container final__inner">
        <div className="final__copy">
          <h2 className="h2 h2--light">
            Give them
            <br />
            <em>something cold.</em>
          </h2>
          <p>
            Standard from ₹3,999. Free shipping over ₹4,500, 30-day returns and a 2-year limited
            warranty on insulation and seals.
          </p>
          <a className="btn btn--light btn--lg" href="#shop">
            Shop Rime <Icon name="arrow" />
          </a>
        </div>
        <div className="final__product" aria-hidden="true">
          <img
            src="/assets/rime-hero.webp"
            alt=""
            width="572"
            height="1185"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const { setSafetyOpen, openCart } = useStore();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <a className="brand brand--footer" href="#top" aria-label="Rime home">
            <span className="brand__word" aria-hidden="true">RIME</span>
          </a>
          <span className="footer__tag">Hydration in its prime.</span>
        </div>

        <div className="footer__grid">
          <div className="footer__col footer__col--wide">
            <h3 className="mono">Rime™</h3>
            <p>
              A frozen lick and hydration column for dogs. Sealed Chill Rod, sips on demand and a
              replaceable honeycomb sleeve — designed for a 3–4 hour session.
            </p>
          </div>

          <div className="footer__col">
            <h3 className="mono">Explore</h3>
            <a href="#how">How it works</a>
            <a href="#design">Design</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer__col">
            <h3 className="mono">Shop</h3>
            <a href="#shop">Standard 18 oz</a>
            <a href="#shop">XL 28 oz</a>
            <a href="#shop">Back-to-Back bundle</a>
            <a href="#shop">Spare Chill Rod</a>
            <a href="#shop">Replacement sleeve</a>
          </div>

          <div className="footer__col">
            <h3 className="mono">Support</h3>
            <button type="button" onClick={() => setSafetyOpen(true)}>
              Full safety guide
            </button>
            <button type="button" onClick={() => openCart("cart")}>
              View cart
            </button>
            <span>30-day returns</span>
            <span>2-year limited warranty</span>
            <span>Ships in 1–2 business days</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__concept">
            Rime is a concept product shown on a prototype storefront. Product images are
            AI-generated and illustrative. Prices are in INR and inclusive of GST.
          </p>
          <span className="mono">© 2026 Rime — Concept store</span>
        </div>
      </div>
    </footer>
  );
}
