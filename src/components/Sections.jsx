import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Problem                                                             */
/* ------------------------------------------------------------------ */

const PROBLEMS = [
  {
    num: "01",
    title: "Lick mats thaw in minutes",
    body: "Frozen mats and stuffed Kongs soften within about 15–25 minutes at room temperature, then leave a sticky puddle behind.",
  },
  {
    num: "02",
    title: "Loose ice is a hazard",
    body: "Ice cubes are hard enough to chip a tooth and slippery enough to send a dog skidding across the floor.",
  },
  {
    num: "03",
    title: "Bottles need a human",
    body: "An insulated dog bottle only works when someone is there to pour water into a bowl. Rime releases sips while your dog licks.",
  },
  {
    num: "04",
    title: "Ice-mold prep, every day",
    body: "Filling, freezing and dumping melted water gets old fast. The sealed Chill Rod only needs a rinse, a dry and a night in the freezer.",
  },
];

export function Problem() {
  const [meltRef, meltInView] = useInView(0.35);

  return (
    <section className="section section--oxblood problem" id="problem">
      <div className="container">
        <div className="problem__head">
          <p className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__line" />
            The problem
          </p>
          <h2 className="h2 h2--light" data-reveal style={{ "--d": "60ms" }}>
            Frozen treats quit
            <br />
            <em>in minutes.</em>
          </h2>
          <p className="problem__lede" data-reveal style={{ "--d": "120ms" }}>
            A frozen lick mat is a good idea with a short life. Rime is built around a sealed
            Chill Rod so the cold stays in the column, not in the puddle — for a{" "}
            <strong>3–4 hour session</strong>.
          </p>
        </div>

        <div
          className={`melt ${meltInView ? "is-visible" : ""}`}
          ref={meltRef}
          data-reveal
          style={{ "--d": "160ms" }}
        >
          <div className="melt__scale mono">
            <span>0 hr</span>
            <span>1 hr</span>
            <span>2 hr</span>
            <span>3 hr</span>
            <span>4 hr</span>
          </div>

          <div className="melt__row">
            <div className="melt__label">
              <span className="mono">Typical frozen lick mat</span>
              <strong>15–25 min</strong>
            </div>
            <div className="melt__track">
              <span className="melt__bar melt__bar--short" />
            </div>
          </div>

          <div className="melt__row">
            <div className="melt__label">
              <span className="mono">Rime, sealed Chill Rod</span>
              <strong>3–4 hours</strong>
            </div>
            <div className="melt__track">
              <span className="melt__bar melt__bar--long" />
            </div>
          </div>

          <p className="melt__note">
            Illustrative comparison at normal indoor room temperature (68–75°F / 20–24°C).
            Session time depends on room temperature, treat choice and how quickly your dog licks.
          </p>
        </div>

        <div className="problem__grid">
          {PROBLEMS.map((item, index) => (
            <article
              className="problem__item"
              key={item.num}
              data-reveal
              style={{ "--d": `${index * 70}ms` }}
            >
              <span className="problem__num mono">{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Anatomy                                                             */
/* ------------------------------------------------------------------ */

const PARTS = [
  {
    num: "01",
    title: "Travel cap with drinking trough",
    body: "A Tritan twist cap with a fold-out trough, so the same column can double as a water bottle on a walk.",
    x: "50%",
    y: "11%",
  },
  {
    num: "02",
    title: "Drip-catch collar",
    body: "Vertical channels guide melting treat and condensation into a 60 ml collar. Dogs can lick up what pools there.",
    x: "51%",
    y: "24%",
  },
  {
    num: "03",
    title: "Honeycomb lick-sleeve",
    body: "Deep food-grade silicone pockets hold yogurt, banana or xylitol-free peanut butter so the lick takes time.",
    x: "44%",
    y: "43%",
  },
  {
    num: "04",
    title: "Sealed Chill Rod",
    body: "Food-grade stainless steel, factory-sealed with purified water and a non-toxic phase-change gel. Never filled, never emptied.",
    x: "51%",
    y: "56%",
  },
  {
    num: "05",
    title: "Insulated weighted base",
    body: "Double-wall 18/8 stainless steel with a low centre of gravity and a non-slip silicone ring. Resists everyday nudges.",
    x: "49%",
    y: "79%",
  },
];

const SPECS = [
  ["Reservoir", "18 oz / 530 ml · 28 oz / 830 ml"],
  ["Materials", "18/8 stainless steel · platinum-cured silicone"],
  ["Session", "3–4 hours at 68–75°F"],
  ["Care", "Sleeve top-rack dishwasher safe"],
];

export function Anatomy() {
  const [active, setActive] = useState(2);

  return (
    <section className="section section--ink anatomy" id="design">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow eyebrow--light" data-reveal>
              <span className="eyebrow__line" />
              Anatomy of a Rime
            </p>
            <h2 className="h2 h2--light" data-reveal style={{ "--d": "60ms" }}>
              Cold lives
              <br />
              <em>in the core.</em>
            </h2>
          </div>
          <p className="section-head__lede section-head__lede--right" data-reveal style={{ "--d": "120ms" }}>
            Five parts, no electronics, nothing to charge. Tap a marker to see what each piece
            does during a session.
          </p>
        </div>

        <div className="anatomy__body">
          <div className="anatomy__visual" data-reveal>
            <div className="anatomy__frame">
              <img
                src="/assets/anatomy.webp"
                alt="Illustrative cutaway of Rime showing the travel cap, drip-catch collar, honeycomb sleeve, sealed chill rod and insulated base"
                width="2000"
                height="1080"
                loading="lazy"
                decoding="async"
              />
              {PARTS.map((part, index) => (
                <span
                  className={`hotspot ${active === index ? "is-active" : ""}`}
                  key={part.num}
                  style={{ "--x": part.x, "--y": part.y }}
                >
                  <button
                    type="button"
                    aria-label={`Part ${part.num}: ${part.title}`}
                    aria-pressed={active === index}
                    onClick={() => setActive(index)}
                  >
                    {part.num}
                  </button>
                </span>
              ))}
              <span className="anatomy__tag mono">Illustrative cutaway · not to scale</span>
            </div>
          </div>

          <div className="anatomy__list">
            {PARTS.map((part, index) => (
              <button
                type="button"
                className={`part ${active === index ? "is-active" : ""}`}
                key={part.num}
                aria-expanded={active === index}
                onClick={() => setActive(index)}
              >
                <span className="part__num mono">{part.num}</span>
                <span className="part__body">
                  <span className="part__title">{part.title}</span>
                  <span className="part__desc">{part.body}</span>
                </span>
                <span className="part__dot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <ul className="specs" data-reveal>
          {SPECS.map(([label, value]) => (
            <li key={label}>
              <span className="mono">{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small hook                                                          */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
