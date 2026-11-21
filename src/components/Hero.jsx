import { useRef } from "react";
import { Icon } from "./Icon.jsx";

export function Hero() {
  const stageRef = useRef(null);

  const handleMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--mx", x.toFixed(3));
    node.style.setProperty("--my", y.toFixed(3));
  };

  const handleLeave = () => {
    const node = stageRef.current;
    if (!node) return;
    node.style.setProperty("--mx", "0");
    node.style.setProperty("--my", "0");
  };

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
        <div className="hero__word">COLD</div>
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__line" />
            Rime™ 01 — Frozen lick &amp; hydration column
          </p>

          <h1 className="hero__title" data-reveal style={{ "--d": "60ms" }}>
            <span>Hydration</span>
            <span>in <em>its prime.</em></span>
          </h1>

          <p className="hero__lede" data-reveal style={{ "--d": "140ms" }}>
            A frozen lick column that keeps your dog happily busy for a{" "}
            <strong>3–4 hour session</strong>. Cold, calm, and drip-managed.
          </p>

          <div className="hero__cta" data-reveal style={{ "--d": "220ms" }}>
            <a className="btn btn--dark btn--lg" href="#shop">
              Shop Rime <span className="btn__price">from ₹3,999</span>
            </a>
            <a className="btn btn--ghost btn--lg" href="#how">
              See how it works <Icon name="down" />
            </a>
          </div>

          <ul className="hero__perks mono" data-reveal style={{ "--d": "300ms" }}>
            <li>Free shipping over ₹4,500</li>
            <li>30-day returns</li>
            <li>2-year warranty</li>
          </ul>

          <dl className="hero__stats" data-reveal style={{ "--d": "380ms" }}>
            <div>
              <dt className="mono">Session</dt>
              <dd>3–4<span>hr</span></dd>
            </div>
            <div>
              <dt className="mono">Reservoir</dt>
              <dd>18<span>/ 28 oz</span></dd>
            </div>
            <div>
              <dt className="mono">Reset</dt>
              <dd>60<span>sec</span></dd>
            </div>
          </dl>
        </div>

        <div className="hero__stage-wrap" data-reveal style={{ "--d": "180ms" }}>
          <div
            className="stage"
            id="heroStage"
            ref={stageRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <div className="stage__glow" aria-hidden="true" />
            <div className="stage__ring" aria-hidden="true" />
            <div className="stage__ring stage__ring--2" aria-hidden="true" />
            <div className="stage__cross stage__cross--x" aria-hidden="true" />
            <div className="stage__cross stage__cross--y" aria-hidden="true" />

            <img className="stage__ice stage__ice--1" src="/assets/ice-cube.webp" alt="" width="900" height="900" loading="eager" decoding="async" aria-hidden="true" />
            <img className="stage__ice stage__ice--2" src="/assets/ice-cube.webp" alt="" width="900" height="900" loading="lazy" decoding="async" aria-hidden="true" />

            <img
              className="stage__product"
              src="/assets/rime-hero.webp"
              alt="Rime frozen lick and hydration column for dogs, with frosted honeycomb sleeve and stainless steel base"
              width="572"
              height="1185"
              fetchpriority="high"
              decoding="async"
            />

            <div className="stage__chip stage__chip--a">
              <span className="mono">Sealed chill rod</span>
              <small>No filling. No ice trays.</small>
            </div>
            <div className="stage__chip stage__chip--b">
              <span className="mono">3–4 hour session</span>
              <small>At normal indoor room temperature</small>
            </div>
            <div className="stage__chip stage__chip--c">
              <span className="mono">60 ml drip-catch collar</span>
              <small>Designed to keep floors drier</small>
            </div>

            <div className="stage__temp mono" aria-hidden="true">0°F / −18°C</div>
            <div className="stage__caption mono">Rime™ Standard · 18 oz / 530 ml</div>
          </div>
        </div>
      </div>

      <div className="hero__foot container">
        <a className="scroll-cue" href="#problem">
          <span className="mono">Scroll to explore</span>
          <span className="scroll-cue__line" />
        </a>
        <span className="mono hero__foot-note">Designed for lickers · Not for chewers</span>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    "Hydration in its prime",
    "Sealed chill rod",
    "3–4 hour sessions",
    "Sips on demand",
    "Drip-catch collar",
    "60-second reset",
  ];
  const line = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {line.map((text, index) => (
          <span key={`${text}-${index}`}>
            {text}
            <b>✳</b>
          </span>
        ))}
      </div>
    </div>
  );
}
