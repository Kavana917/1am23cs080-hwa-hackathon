import { useEffect, useRef, useState } from "react";

const GALLERY = [
  { src: "/assets/how-1-freeze.webp", alt: "The sealed Chill Rod ready for the freezer" },
  { src: "/assets/how-2-fill.webp", alt: "Cold water being poured into the insulated Rime base" },
  { src: "/assets/how-3-rod.webp", alt: "The frozen Chill Rod being screwed into the base" },
  { src: "/assets/how-4-bare.webp", alt: "The bare honeycomb Rime lick sleeve" },
  { src: "/assets/how-4-spread.webp", alt: "A thick spread being pressed into the honeycomb sleeve" },
  { src: "/assets/how-4-freeze.webp", alt: "A prepared sleeve going into the freezer" },
  { src: "/assets/how-5-sleeve.webp", alt: "The silicone sleeve being twisted onto the base" },
  { src: "/assets/how-6-cap.webp", alt: "The top cap being twisted onto the column" },
  { src: "/assets/how-7-lick.webp", alt: "A dog licking the frosted Rime sleeve" },
];

const STEPS = [
  {
    title: "Freeze the rod",
    body: "Put the sealed Chill Rod in the freezer overnight, or for at least 4 hours. It's the cold source for the whole session, and there's no tray to fill or empty.",
  },
  {
    title: "Fill the base with cold water",
    body: "Pour cold water into the vacuum-insulated base, up to the fill line. This is the water your dog gets in small sips as they lick.",
  },
  {
    title: "Screw the rod into the base",
    body: "Take the frozen rod from the freezer and screw it into the center of the base. It sits in the water and chills it, and it keeps the sleeve cold from the inside.",
  },
  {
    title: "Choose how to use your sleeve",
    body: "There's one honeycomb sleeve with three ways to use it:",
    modes: [
      {
        label: "Bare",
        body: "Nothing on it. The cold sleeve, condensation and water sips give a zero-calorie frost lick for everyday use.",
        image: "/assets/how-4-bare.webp",
      },
      {
        label: "Spread-On",
        body: "Press a thick treat, such as xylitol-free peanut butter, mashed banana or pumpkin, into the pockets right before serving.",
        image: "/assets/how-4-spread.webp",
      },
      {
        label: "Freeze-On",
        body: "Spread the treat onto the sleeve the night before and freeze the sleeve with the rod. It starts frozen and lasts longer.",
        image: "/assets/how-4-freeze.webp",
      },
    ],
  },
  {
    title: "Twist the sleeve onto the base",
    body: "Slide the sleeve over the rod and twist it onto the base until it's snug. A sealing gasket keeps the water in.",
  },
  {
    title: "Put the top cap on",
    body: "Twist the cap onto the top to close it up.",
  },
  {
    title: "Let your dog lick",
    body: "Put Rime on the floor and let your dog lick. Every lick releases a small sip of chilled water, and the drip collar catches melting drops. It's designed to keep your dog busy for a 3–4 hour session. Supervise the first few sessions. Rime is a lick toy, not a chew toy.",
  },
];

const pad = (value) => String(value).padStart(2, "0");

export function HowItWorks() {
  const section = useRef(null);
  const [active, setActive] = useState(0);
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const distance = node.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const progress = Math.min(
        1,
        Math.max(0, -node.getBoundingClientRect().top / distance)
      );
      const index = Math.min(
        STEPS.length - 1,
        Math.floor(progress * STEPS.length)
      );
      setActive(index);
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

  useEffect(() => {
    setMerged(active === STEPS.length - 1);
  }, [active]);

  return (
    <section
      ref={section}
      className={`how ${merged ? "is-merged" : ""}`}
      id="how"
      aria-label="How to use Rime"
    >
      <div className="how__pin">
        <div className="how__inner">
          <aside className="how__rail">
            <span className="how__eyebrow mono">02 — The routine</span>
            <h2 className="how__title">
              How
              <br />
              <em>it works</em>
            </h2>
            <p className="how__lede">
              Seven small steps from freezer to floor. No ice tray, no mixing,
              no refilling.
            </p>
            <div
              className="how__progress mono"
              aria-label={`Step ${active + 1} of ${STEPS.length}`}
            >
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
          </aside>

          <div className="how__gallery" aria-label="The Rime routine, step by step">
            {GALLERY.map((item, index) => (
              <img
                className="how__thumb"
                key={item.src}
                src={item.src}
                alt={index === 3 || index === 4 || index === 5 ? `${item.alt} — sleeve option ${index - 2}` : item.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>

          <div className="how__panel">
            {STEPS.map((step, index) => (
              <article
                className={`how-card ${active === index ? "is-active" : ""}`}
                key={step.title}
              >
                <span className="how-card__num mono">
                  {pad(index + 1)} / {pad(STEPS.length)}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {step.modes && (
                  <div className="how-card__modes">
                    {step.modes.map((option) => (
                      <div className="how-mode" key={option.label}>
                        <img src={option.image} alt="" loading="lazy" />
                        <span className="how-mode__label mono">{option.label}</span>
                        <span className="how-mode__body">{option.body}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
