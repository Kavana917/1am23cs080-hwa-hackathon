import { useEffect, useRef, useState } from "react";

const MAROON = "#37161b";
const SHADES = [
  "#f8f1e5",
  "#f1e6d9",
  "#e6d0c3",
  "#d6b0a3",
  "#bd887c",
  "#925a54",
  MAROON,
];

const STEPS = [
  {
    title: "Freeze the rod",
    body: "Put the sealed Chill Rod in the freezer overnight, or for at least 4 hours. It's the cold source for the whole session, and there's no tray to fill or empty.",
    image: "/assets/how-1-freeze.webp",
    alt: "The sealed Chill Rod ready for the freezer",
  },
  {
    title: "Fill the base with cold water",
    body: "Pour cold water into the vacuum-insulated base, up to the fill line. This is the water your dog gets in small sips as they lick.",
    image: "/assets/how-2-fill.webp",
    alt: "Cold water being poured into the insulated Rime base",
  },
  {
    title: "Screw the rod into the base",
    body: "Take the frozen rod from the freezer and screw it into the center of the base. It sits in the water and chills it, and it keeps the sleeve cold from the inside.",
    image: "/assets/how-3-rod.webp",
    alt: "The frozen Chill Rod being screwed into the base",
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
    image: "/assets/how-5-sleeve.webp",
    alt: "The silicone sleeve being twisted onto the base",
  },
  {
    title: "Put the top cap on",
    body: "Twist the cap onto the top to close it up.",
    image: "/assets/how-6-cap.webp",
    alt: "The top cap being twisted onto the column",
  },
  {
    title: "Let your dog lick",
    body: "Put Rime on the floor and let your dog lick. Every lick releases a small sip of chilled water, and the drip collar catches melting drops. It's designed to keep your dog busy for a 3–4 hour session. Supervise the first few sessions. Rime is a lick toy, not a chew toy.",
    image: "/assets/how-7-lick.webp",
    alt: "A dog licking the frosted Rime sleeve",
  },
];

const pad = (value) => String(value).padStart(2, "0");

function StepMedia({ step }) {
  const images = step.modes
    ? step.modes.map((mode) => ({ src: mode.image, alt: mode.label }))
    : [{ src: step.image, alt: step.alt }];

  return (
    <div className={`how__media ${step.modes ? "how__media--multi" : ""}`}>
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} decoding="async" />
      ))}
    </div>
  );
}

function StepCopy({ step, index }) {
  return (
    <div className="how__copy">
      <span className="how__count mono">
        {pad(index + 1)} / {pad(STEPS.length)}
      </span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
      {step.modes && (
        <div className="how__modes">
          {step.modes.map((mode) => (
            <div className="how__mode" key={mode.label}>
              <span className="how__mode-label mono">{mode.label}</span>
              <span>{mode.body}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HowItWorks() {
  const section = useRef(null);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1020px)").matches
  );

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
      setActive(
        Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
      );
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
    const query = window.matchMedia("(max-width: 1020px)");
    const onChange = (event) => setCompact(event.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  const theme = (index) => ({
    backgroundColor: SHADES[index],
    color: index >= 5 ? "#f8f1e5" : "#2a1418",
  });

  return (
    <section ref={section} className="how" id="how" aria-label="How to use Rime">
      <div className={`how__pin ${compact ? "is-compact" : ""}`}>
        <div className="how__left">
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
            {STEPS.map((step, index) => (
              <span
                key={step.title}
                className={`how__dot ${index === active ? "is-active" : ""} ${index < active ? "is-done" : ""}`}
              />
            ))}
          </div>
        </div>

        {compact ? (
          <div className="how__compact">
            {STEPS.map((step, index) => (
              <div className="how__step" style={theme(index)} key={step.title}>
                <StepMedia step={step} />
                <StepCopy step={step} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="how__reveal" style={theme(active)} key={active}>
              <StepCopy step={STEPS[active]} index={active} />
            </div>
            <StepMedia step={STEPS[active]} key={`media-${active}`} />
          </>
        )}
      </div>
    </section>
  );
}
