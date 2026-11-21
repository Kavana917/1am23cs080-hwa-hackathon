import { Icon } from "./Icon.jsx";

/* Ice sits out at the edges of the frame, well clear of the product. */
const ICE = [
  { n: 1, w: 132, x: "2%", y: "16%", r: -18, blur: "0px", o: 0.95, front: true },
  { n: 2, w: 88, x: "15%", y: "57%", r: 14, blur: "6px", o: 0.68, front: false },
  { n: 3, w: 72, x: "7%", y: "79%", r: 26, blur: "3px", o: 0.74, front: false },
  { n: 4, w: 124, x: "82%", y: "14%", r: -12, blur: "0px", o: 0.92, front: true },
  { n: 5, w: 100, x: "73%", y: "55%", r: 19, blur: "7px", o: 0.62, front: false },
  { n: 6, w: 110, x: "88%", y: "77%", r: -23, blur: "0px", o: 0.9, front: true },
  { n: 7, w: 64, x: "36%", y: "3%", r: 9, blur: "4px", o: 0.66, front: false },
  { n: 8, w: 78, x: "63%", y: "5%", r: -15, blur: "0px", o: 0.84, front: true },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="container hero__inner">
        <div className="hero__stage">
          <div className="stage__glow" aria-hidden="true" />

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
                "--delay": `${ice.n * -470}ms`,
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

          <a className="btn btn--dark hero__shop" href="#shop">
            Shop Now <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
