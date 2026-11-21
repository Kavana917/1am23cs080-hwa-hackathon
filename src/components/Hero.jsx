import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";
import StrokeText from "./StrokeText.jsx";

/* Larger, varied ice at the edges. Depth controls parallax speed/direction. */
const ICE = [
  { n: 1, w: 320, x: "-11%", y: "2%", r: -34, blur: "0px", o: 0.9, front: true, depth: 0.85 },
  { n: 2, w: 210, x: "4%", y: "40%", r: 18, blur: "5px", o: 0.6, front: false, depth: 0.35 },
  { n: 3, w: 270, x: "-12%", y: "70%", r: 47, blur: "3px", o: 0.7, front: true, depth: 0.55 },
  { n: 4, w: 230, x: "2%", y: "96%", r: -12, blur: "0px", o: 0.82, front: true, depth: 0.7 },
  { n: 5, w: 360, x: "88%", y: "-12%", r: 62, blur: "0px", o: 0.88, front: true, depth: 0.9 },
  { n: 6, w: 220, x: "100%", y: "20%", r: -28, blur: "6px", o: 0.55, front: false, depth: 0.4 },
  { n: 7, w: 300, x: "92%", y: "66%", r: 15, blur: "0px", o: 0.86, front: true, depth: 0.75 },
  { n: 8, w: 250, x: "96%", y: "94%", r: -51, blur: "3px", o: 0.62, front: false, depth: 0.6 },
  { n: 9, w: 180, x: "20%", y: "-12%", r: 37, blur: "4px", o: 0.58, front: false, depth: 0.3 },
  { n: 10, w: 200, x: "72%", y: "-14%", r: -19, blur: "0px", o: 0.78, front: true, depth: 0.5 },
  { n: 11, w: 190, x: "30%", y: "112%", r: 54, blur: "5px", o: 0.56, front: false, depth: -0.4 },
  { n: 12, w: 220, x: "76%", y: "114%", r: -41, blur: "0px", o: 0.8, front: true, depth: 0.55 },
  { n: 13, w: 160, x: "-8%", y: "56%", r: 23, blur: "6px", o: 0.5, front: false, depth: -0.28 },
  { n: 14, w: 180, x: "108%", y: "52%", r: -63, blur: "4px", o: 0.54, front: false, depth: -0.33 },
  { n: 15, w: 150, x: "8%", y: "6%", r: 11, blur: "0px", o: 0.72, front: true, depth: 0.42 },
  { n: 16, w: 170, x: "84%", y: "4%", r: 72, blur: "5px", o: 0.52, front: false, depth: 0.36 },
];

export function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const productRef = useRef(null);
  const shopRef = useRef(null);
  const hideTimer = useRef(0);
  const taglineRef = useRef(null);
  const meaningCardRef = useRef(null);
  const [productHover, setProductHover] = useState(false);
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [connector, setConnector] = useState({ x: 0, y: 0, length: 0, angle: 0 });

  const positionShop = (clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const button = shopRef.current;
    const halfW = button ? button.offsetWidth / 2 : 60;
    const halfH = button ? button.offsetHeight / 2 : 22;
    const x = Math.min(Math.max(clientX - rect.left, halfW + 8), rect.width - halfW - 8);
    const y = Math.min(Math.max(clientY - rect.top, halfH + 8), rect.height - halfH - 8);
    stage.style.setProperty("--shop-x", `${x}px`);
    stage.style.setProperty("--shop-y", `${y}px`);
  };

  const showShop = (event) => {
    if (event && typeof event.clientX === "number") {
      positionShop(event.clientX, event.clientY);
    } else if (productRef.current) {
      const rect = productRef.current.getBoundingClientRect();
      positionShop(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = 0;
    setProductHover(true);
  };

  const hideShop = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setProductHover(false), 180);
  };

  /* Measure the dotted connector between the name and the meaning card. */
  useLayoutEffect(() => {
    const update = () => {
      const stage = stageRef.current;
      const tagline = taglineRef.current;
      const card = meaningCardRef.current;
      if (!stage || !tagline || !card) return;

      const s = stage.getBoundingClientRect();
      const t = tagline.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const startX = t.right - s.left - 4;
      const startY = t.top + t.height * 0.55 - s.top;
      const endX = c.left - s.left + 10;
      const endY = c.top + 30 - s.top;
      const dx = endX - startX;
      const dy = endY - startY;
      const next = {
        x: startX,
        y: startY,
        length: Math.max(0, Math.hypot(dx, dy)),
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      };

      setConnector((prev) =>
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5 &&
        Math.abs(prev.length - next.length) < 0.5 &&
        Math.abs(prev.angle - next.angle) < 0.5
          ? prev
          : next
      );
    };

    update();
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("resize", update);
    document.fonts?.ready?.then(update).catch(() => {});

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      hero.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
      hero.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handleMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = -nx * 70;
      targetY = -ny * 48;
      schedule();
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      hero.style.setProperty("--parallax-x", "0px");
      hero.style.setProperty("--parallax-y", "0px");
    };

    hero.addEventListener("pointermove", handleMove);
    hero.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (frame) window.cancelAnimationFrame(frame);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <section
      className={`hero${productHover ? " is-product-hover" : ""}`}
      id="top"
      ref={heroRef}
    >
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="container hero__inner">
        <div className="hero__stage" ref={stageRef}>
          <div className="stage__glow" aria-hidden="true" />

          <div className="hero__ice-layer" aria-hidden="true">
            {ICE.map((ice) => (
              <span
                className={[
                  "hero__ice",
                  `hero__ice--${ice.n}`,
                  ice.front ? "is-front" : "is-back",
                  ice.blur !== "0px" ? "is-soft" : "",
                ].join(" ")}
                key={ice.n}
                style={{
                  "--w": `${ice.w}px`,
                  "--x": ice.x,
                  "--y": ice.y,
                  "--r": `${ice.r}deg`,
                  "--blur": ice.blur,
                  "--o": ice.o,
                  "--depth": ice.depth,
                  "--delay": `${ice.n * -470}ms`,
                }}
              >
                <img src="/assets/ice-cube.webp" alt="" decoding="async" />
              </span>
            ))}
          </div>

          <h1 className="hero__title">
            <button
              type="button"
              className="hero__name-trigger"
              onPointerEnter={() => setMeaningOpen(true)}
              onPointerLeave={() => setMeaningOpen(false)}
              onFocus={() => setMeaningOpen(true)}
              onBlur={() => setMeaningOpen(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setMeaningOpen(false);
              }}
              aria-expanded={meaningOpen}
              aria-describedby="rime-name-meaning"
            >
              <StrokeText
                text="RIME"
                className="hero__name"
                strokeColor="rgba(46, 111, 124, 0.92)"
                fillColor="#2a1418"
                strokeWidth={1.5}
                drawDuration={1.05}
                fillDelay={0.12}
                stagger={0.055}
                ease="power2.out"
                trigger="mount"
                fillMode="wipe"
                wipeFrom="left"
                fontSize={160}
                fontWeight={600}
                fontFamily='"Inter Tight", "Helvetica Neue", Arial, sans-serif'
                letterSpacing={-8}
              />
              <span ref={taglineRef} className="hero__tagline">Hydration in its prime.</span>
            </button>
          </h1>

          <span
            className={`hero__meaning-line${meaningOpen ? " is-open" : ""}`}
            style={{
              left: `${connector.x}px`,
              top: `${connector.y}px`,
              width: `${connector.length}px`,
              transform: `rotate(${connector.angle}deg)`,
            }}
            aria-hidden="true"
          />

          <div
            ref={meaningCardRef}
            className={`hero__meaning${meaningOpen ? " is-open" : ""}`}
            id="rime-name-meaning"
            role="tooltip"
            aria-hidden={!meaningOpen}
          >
            <div className="hero__meaning-card">
              <span className="hero__meaning-kicker">Why we kept the name</span>
              <p>
                “Rime most commonly refers to a white, granular crust of ice (frost)
                formed when freezing or supercooled water droplets freeze on contact
                with surfaces.”
              </p>
              <span className="hero__meaning-source">Source: Wikipedia</span>
              <p className="hero__meaning-note">
                That frosty crust is exactly the feeling behind Rime — a cold lick, a
                chilled sip, and one good 3–4 hour session.
              </p>
            </div>
          </div>

          <img
            ref={productRef}
            className="stage__product"
            src="/assets/rime-hero.webp"
            alt="Rime frozen lick and hydration column for dogs, with frosted honeycomb sleeve and stainless steel base"
            width="572"
            height="1185"
            fetchpriority="high"
            decoding="async"
            tabIndex="0"
            onPointerEnter={showShop}
            onPointerMove={(event) => positionShop(event.clientX, event.clientY)}
            onPointerLeave={hideShop}
            onFocus={showShop}
            onBlur={hideShop}
          />

          <a
            ref={shopRef}
            className="btn btn--dark hero__shop"
            href="#shop"
            onPointerEnter={showShop}
            onPointerMove={(event) => positionShop(event.clientX, event.clientY)}
            onPointerLeave={hideShop}
            onFocus={showShop}
            onBlur={hideShop}
          >
            Shop Now <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
