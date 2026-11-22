import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    title: "Freeze the rod",
    body: "Put the sealed Chill Rod in the freezer overnight, or for at least 4 hours. It's the cold source for the whole session, and there's no tray to fill or empty.",
    images: ["/assets/how-1-freeze.webp"],
    alt: "The sealed Rime Chill Rod ready for the freezer",
  },
  {
    title: "Fill the base with cold water",
    body: "Pour cold water into the vacuum-insulated base, up to the fill line. This is the water your dog gets in small sips as they lick.",
    images: ["/assets/how-2-fill.webp"],
    alt: "Cold water being poured into the insulated Rime base",
  },
  {
    title: "Screw the rod into the base",
    body: "Take the frozen rod from the freezer and screw it into the center of the base. It sits in the water and chills it, and it keeps the sleeve cold from the inside.",
    images: ["/assets/how-3-rod.webp"],
    alt: "The frozen Chill Rod being screwed into the Rime base",
  },
  {
    title: "Choose how to use your sleeve",
    body: "There's one honeycomb sleeve with three ways to use it:",
    images: [
      "/assets/how-4-bare.webp",
      "/assets/how-4-spread.webp",
      "/assets/how-4-freeze.webp",
    ],
    alt: "The honeycomb Rime lick sleeve shown in its three serving modes",
    modes: [
      {
        label: "Bare",
        body: "Nothing on it. The cold sleeve, condensation and water sips give a zero-calorie frost lick for everyday use.",
      },
      {
        label: "Spread-On",
        body: "Press a thick treat, such as xylitol-free peanut butter, mashed banana or pumpkin, into the pockets right before serving.",
      },
      {
        label: "Freeze-On",
        body: "Spread the treat onto the sleeve the night before and freeze the sleeve with the rod. It starts frozen and lasts longer.",
      },
    ],
  },
  {
    title: "Twist the sleeve onto the base",
    body: "Slide the sleeve over the rod and twist it onto the base until it's snug. A sealing gasket keeps the water in.",
    images: ["/assets/how-5-sleeve.webp"],
    alt: "The silicone sleeve being twisted onto the Rime base",
  },
  {
    title: "Put the top cap on",
    body: "Twist the cap onto the top to close it up.",
    images: ["/assets/how-6-cap.webp"],
    alt: "The Rime top cap being twisted onto the column",
  },
  {
    title: "Let your dog lick",
    body: "Put Rime on the floor and let your dog lick. Every lick releases a small sip of chilled water, and the drip collar catches melting drops. It's designed to keep your dog busy for a 3–4 hour session. Supervise the first few sessions. Rime is a lick toy, not a chew toy.",
    images: ["/assets/how-7-lick.webp"],
    alt: "A dog licking the frosted Rime sleeve on the floor",
  },
];

const pad = (value) => String(value).padStart(2, "0");

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState(0);
  const [merged, setMerged] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());
  const cards = useRef([]);

  useEffect(() => {
    const nodes = cards.current.filter(Boolean);
    if (!nodes.length) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(new Set(nodes.map((node) => Number(node.dataset.index))));
      setMerged(true);
      return undefined;
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.index);
          setRevealed((prev) =>
            prev.has(index) ? prev : new Set(prev).add(index)
          );
          reveal.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    const follow = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-44% 0px -44% 0px", threshold: 0 }
    );

    nodes.forEach((node) => {
      reveal.observe(node);
      follow.observe(node);
    });

    return () => {
      reveal.disconnect();
      follow.disconnect();
    };
  }, []);

  useEffect(() => {
    setMerged(active === STEPS.length - 1);
  }, [active]);

  const step = STEPS[active];
  const shownImage =
    step.images.length > 1 ? step.images[mode] : step.images[0];

  return (
    <section
      className={`how ${merged ? "is-merged" : ""}`}
      id="how"
      aria-label="How to use Rime"
    >
      <span className="how__wash" aria-hidden="true" />

      <div className="container how__inner">
        <div className="how__rail">
          <span className="how__eyebrow mono">02 — The routine</span>
          <h2 className="how__title">
            How
            <br />
            <em>to use</em>
          </h2>
          <p className="how__lede">
            Seven small steps from freezer to floor. No ice tray, no mixing, no
            refilling.
          </p>
          <div className="how__progress mono" aria-label={`Step ${active + 1} of ${STEPS.length}`}>
            <strong>{pad(active + 1)}</strong>
            <span>/</span>
            {pad(STEPS.length)}
          </div>
          <div className="how__dots" aria-hidden="true">
            {STEPS.map((item, index) => (
              <span
                key={item.title}
                className={`how__dot ${index === active ? "is-active" : ""} ${index < active ? "is-done" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="how__stage">
          <div className="how__frame">
            {STEPS.map((item, index) =>
              item.images.map((image, imageIndex) => (
                <img
                  key={`${index}-${imageIndex}`}
                  className={`how__img ${shownImage === image ? "is-active" : ""}`}
                  src={image}
                  alt={shownImage === image ? item.alt : ""}
                  loading="lazy"
                  decoding="async"
                />
              ))
            )}
            <span className="how__badge mono">
              {pad(active + 1)} — {step.title}
            </span>
          </div>
        </div>

        <div className="how__cards">
          {STEPS.map((item, index) => (
            <article
              className={`how-card ${active === index ? "is-active" : ""} ${revealed.has(index) ? "is-in" : ""}`}
              data-index={index}
              key={item.title}
              ref={(node) => {
                cards.current[index] = node;
              }}
            >
              <span className="how-card__num mono">{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>

              {item.modes && (
                <div className="how-card__modes">
                  {item.modes.map((option, optionIndex) => (
                    <button
                      type="button"
                      className={`how-mode ${active === index && mode === optionIndex ? "is-active" : ""}`}
                      key={option.label}
                      aria-pressed={active === index && mode === optionIndex}
                      onClick={() => {
                        setMode(optionIndex);
                        setActive(index);
                      }}
                    >
                      <img src={item.images[optionIndex]} alt="" loading="lazy" />
                      <span className="how-mode__label mono">{option.label}</span>
                      <span className="how-mode__body">{option.body}</span>
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
