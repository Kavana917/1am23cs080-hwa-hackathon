import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";

/* Floating ice around the product. Some are crisp, some sit out of focus. */
const ICE = [
  { n: 1, w: 142, x: "-4%", y: "12%", r: -16, blur: "0px", o: 0.96, dx: "-120px", dy: "-55px", front: true },
  { n: 2, w: 94, x: "78%", y: "4%", r: 18, blur: "6px", o: 0.7, dx: "105px", dy: "-90px", front: false },
  { n: 3, w: 76, x: "-8%", y: "46%", r: 27, blur: "3px", o: 0.78, dx: "-115px", dy: "25px", front: false },
  { n: 4, w: 128, x: "86%", y: "33%", r: -12, blur: "0px", o: 0.92, dx: "110px", dy: "15px", front: true },
  { n: 5, w: 158, x: "6%", y: "72%", r: 20, blur: "8px", o: 0.6, dx: "-100px", dy: "95px", front: false },
  { n: 6, w: 108, x: "76%", y: "73%", r: -24, blur: "0px", o: 0.94, dx: "95px", dy: "100px", front: true },
  { n: 7, w: 66, x: "36%", y: "0%", r: 9, blur: "5px", o: 0.66, dx: "-25px", dy: "-115px", front: false },
  { n: 8, w: 82, x: "60%", y: "88%", r: -15, blur: "0px", o: 0.88, dx: "35px", dy: "115px", front: true },
];

export function Hero() {
  const heroRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setRevealed(y > 56);
      const node = heroRef.current;
      if (node) {
        node.style.setProperty("--hero-shift", `${(-Math.min(y, 420) * 0.035).toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={`hero ${revealed ? "is-revealed" : ""}`} id="top" ref={heroRef}>
      <div className="hero__viewport">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
          <div className="hero__glow" />
          <div className="hero__word">Rime</div>
        </div>

        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">
              <span className="eyebrow__line" />
              Rime™ 01 — Frozen lick &amp; hydration column
            </p>

            <p className="hero__lede">
              A frozen lick column that keeps your dog happily busy for a{" "}
              <strong>3–4 hour session</strong>. Cold, calm, and drip-managed.
            </p>

            <div className="hero__cta">
              <a className="btn btn--dark btn--lg" href="#shop">
                Shop Rime <span className="btn__price">from ₹3,999</span>
              </a>
              <a className="btn btn--ghost btn--lg" href="#how">
                See how it works <Icon name="down" />
              </a>
            </div>

            <ul className="hero__perks mono">
              <li>Free shipping over ₹4,500</li>
              <li>30-day returns</li>
              <li>2-year warranty</li>
            </ul>
          </div>

          <div className="hero__stage-wrap">
            <div className="stage" id="heroStage">
              <div className="stage__glow" aria-hidden="true" />
              <div className="stage__ring" aria-hidden="true" />
              <div className="stage__ring stage__ring--2" aria-hidden="true" />
              <div className="stage__cross stage__cross--x" aria-hidden="true" />
              <div className="stage__cross stage__cross--y" aria-hidden="true" />

              {ICE.map((ice) => (
                <span
                  className={[
                    "hero__ice",
                    `hero__ice--${ice.n}`,
                    ice.front ? "is-front" : "is-back",
                    ice.blur !== "0px" ? "is-soft" : "",
                  ].join(" ")}
                  key={ice.n}
                  aria-hidden="true"
                  style={{
                    "--w": `${ice.w}px`,
                    "--x": ice.x,
                    "--y": ice.y,
                    "--r": `${ice.r}deg`,
                    "--blur": ice.blur,
                    "--o": ice.o,
                    "--dx": ice.dx,
                    "--dy": ice.dy,
                    "--delay": `${180 + ice.n * 65}ms`,
                  }}
                >
                  <img src="/assets/ice-cube.webp" alt="" decoding="async" />
                </span>
              ))}

              <h1 className="hero__title">
                <span className="hero__name">Rime</span>
                <span className="hero__tagline">Hydration in its prime.</span>
              </h1>

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

          <dl className="hero__stats">
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

        <div className="hero__foot container">
          <a className="scroll-cue" href="#problem">
            <span className="mono">Scroll to reveal</span>
            <span className="scroll-cue__line" />
          </a>
          <span className="mono hero__foot-note">Designed for lickers · Not for chewers</span>
        </div>
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
