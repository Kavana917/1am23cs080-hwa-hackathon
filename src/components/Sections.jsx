import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";

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
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    num: "01",
    title: "Freeze.",
    body: "Pop the sealed Chill Rod in the freezer overnight. No filling, no ice trays, no water to change. Four hours minimum at 0°F / −18°C or colder.",
    meta: "Overnight · 4 hr minimum",
    img: "/assets/freeze-rod.webp",
    alt: "The sealed stainless steel Rime Chill Rod beside its freezer sleeve",
  },
  {
    num: "02",
    title: "Load.",
    body: "Fill the base with cold water, slide on a honeycomb sleeve and spread on dog-safe treats — or leave it bare for a zero-calorie frost lick.",
    meta: "60-second setup",
    img: "/assets/sleeve-load.webp",
    alt: "Dog-safe yogurt being spread into the honeycomb pockets of a Rime sleeve",
  },
  {
    num: "03",
    title: "Lick.",
    body: "Your dog licks, a small sip of chilled water follows, and the cold sleeve keeps going for a 3–4 hour session. The collar catches the drips.",
    meta: "3–4 hour session",
    img: "/assets/dog-licking.webp",
    alt: "A dog calmly licking the frosted honeycomb sleeve of a Rime column",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-38% 0px -46% 0px", threshold: 0 }
    );
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__line" />
              How it works
            </p>
            <h2 className="h2" data-reveal style={{ "--d": "60ms" }}>
              Three steps.
              <br />
              <em>One long session.</em>
            </h2>
          </div>
          <p className="section-head__lede section-head__lede--right" data-reveal style={{ "--d": "120ms" }}>
            Freeze it overnight, load it in under a minute, then hand your dog something cold to
            work on. Rime is designed for one good <strong>3–4 hour session</strong> at a time.
          </p>
        </div>

        <div className="steps">
          <div className="steps__list">
            {STEPS.map((step, index) => (
              <article
                className={`step ${active === index ? "is-active" : ""}`}
                key={step.num}
                data-index={index}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                onClick={() => setActive(index)}
              >
                <span className="step__num mono">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span className="step__meta mono">
                  <Icon name="snow" />
                  {step.meta}
                </span>
                <img
                  className="step__mobile-img"
                  src={step.img}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                />
              </article>
            ))}
          </div>

          <div className="steps__visual">
            <div className="steps__frame">
              {STEPS.map((step, index) => (
                <img
                  key={step.img}
                  className={`steps__img ${active === index ? "is-active" : ""}`}
                  src={step.img}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                />
              ))}
              <span className="steps__badge mono">
                {STEPS[active].num} — {STEPS[active].title.replace(".", "")}
              </span>
              <span className="steps__frame-line" />
            </div>
            <div className="steps__foot">
              <span className="mono">No filling · No ice trays</span>
              <p>Sealed rod in, sleeve on, water in. That is the whole routine.</p>
            </div>
          </div>
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
/* Features                                                            */
/* ------------------------------------------------------------------ */

export function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__line" />
              Why Rime
            </p>
            <h2 className="h2" data-reveal style={{ "--d": "60ms" }}>
              Engineered
              <br />
              <em>for the lick.</em>
            </h2>
          </div>
          <p className="section-head__lede section-head__lede--right" data-reveal style={{ "--d": "120ms" }}>
            Every part earns its place: longer cold, smaller sips, fewer puddles and a base that
            stays where you put it.
          </p>
        </div>

        <div className="bento">
          <article className="bento__card bento__card--wide" data-reveal>
            <div>
              <span className="bento__num mono">01 — Thermal core</span>
              <h3>Cold that lasts a session.</h3>
              <p>
                The sealed stainless-steel Chill Rod keeps the sleeve frosty and firm for a{" "}
                <strong>3–4 hour session</strong> — far longer than a frozen lick mat. Refreeze
                overnight and it is ready again.
              </p>
            </div>
            <div className="valve" aria-hidden="true">
              <span className="valve__top" />
              <span className="valve__drop" />
              <span className="valve__pool" />
            </div>
          </article>

          <article className="bento__card bento__card--valve" data-reveal style={{ "--d": "60ms" }}>
            <div>
              <span className="bento__num mono">02 — Slit valve</span>
              <h3>Sips on demand.</h3>
              <p>
                A pressure-activated silicone valve releases small sips of chilled water only
                while your dog licks. No continuous flow, no bowl to knock over.
              </p>
            </div>
          </article>

          <article className="bento__card bento__card--base" data-reveal style={{ "--d": "80ms" }}>
            <div>
              <span className="bento__num mono">03 — Weighted base</span>
              <h3>Built to stay put.</h3>
              <p>
                A vacuum-insulated base with a low centre of gravity and a non-slip ring resists
                everyday nudges and pawing. No exterior sweating.
              </p>
            </div>
            <div className="base-graphic" aria-hidden="true">
              <span className="base-graphic__ring" />
              <span className="base-graphic__shadow" />
              <span className="base-graphic__body" />
            </div>
          </article>

          <article className="bento__card bento__card--drip" data-reveal style={{ "--d": "100ms" }}>
            <div>
              <span className="bento__num mono">04 — Drip catch</span>
              <h3>Designed to catch drips.</h3>
              <p>
                A 60 ml collar collects melting treat and condensation, so hardwood and rugs stay
                cleaner during a normal session.
              </p>
            </div>
            <div className="collar-graphic" aria-hidden="true">
              <svg viewBox="0 0 200 150" fill="none">
                <ellipse cx="100" cy="76" rx="62" ry="58" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
                <ellipse cx="100" cy="76" rx="44" ry="41" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
                <path d="M56 76c0 24 20 41 44 41s44-17 44-41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M62 60v34M74 52v42M88 48v46M112 48v46M126 52v42M138 60v34" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
                <circle cx="100" cy="34" r="4" fill="currentColor" opacity="0.8" />
                <path d="M100 38v10" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
              </svg>
            </div>
          </article>

          <article
            className="bento__card bento__card--treats bento__card--image"
            data-reveal
            style={{ "--d": "120ms" }}
          >
            <img
              src="/assets/sleeve-treats.webp"
              alt="Yogurt, banana and peanut butter spread into the honeycomb pockets of a Rime sleeve"
              loading="lazy"
              decoding="async"
            />
            <span className="bento__overlay" />
            <div className="bento__content">
              <span className="pill pill--ice">
                <Icon name="hex" />
                Deep pockets
              </span>
              <h3>Treats that take time.</h3>
              <p>
                Fill the honeycomb with plain yogurt, mashed banana, pumpkin puree or
                xylitol-free peanut butter. Or leave it bare for a zero-calorie frost lick.
              </p>
            </div>
          </article>

          <article className="bento__card bento__card--reset" data-reveal style={{ "--d": "140ms" }}>
            <div>
              <span className="bento__num mono">06 — Reset</span>
              <h3>60-second reset.</h3>
              <p>
                Unscrew the collar, slide off the sleeve, rinse, wipe the rod and refreeze. One
                fresh session is always a night away.
              </p>
            </div>
            <div className="timer-graphic" aria-hidden="true">
              <svg viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" opacity="0.22" />
                <circle
                  className="timer-graphic__arc"
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="289"
                  strokeDashoffset="96"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="500" fill="currentColor">
                  60
                </text>
                <text x="60" y="74" textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="currentColor" opacity="0.6">
                  SECONDS
                </text>
              </svg>
            </div>
          </article>
        </div>
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
