const QUADRANTS = [
  {
    id: 1,
    word: "WHY",
    title: "Silicone lick mats",
    lasts: "Lasts: 5 to 15 minutes, depending on the food.",
    rime: "Rime: The frozen rod keeps the sleeve cold for a 3–4 hour session, so your dog has something to lick with or without food.",
    image: "/assets/why-quadrant-1.webp",
  },
  {
    id: 2,
    word: "RIME",
    title: "Loose ice cubes",
    lasts: "Lasts: 2 to 5 minutes",
    rime: "Rime: The surface is soft silicone with no hard ice to crunch, and it stays cold for hours instead of mins.",
    image: "/assets/why-quadrant-2.webp",
  },
  {
    id: 3,
    word: "IS THE",
    title: "Stuffed rubber chew toys",
    lasts: "Lasts: 5 to 10 mins",
    rime: "Rime: There's no messy cleaning. The sleeve rinses in about a minute.",
    image: "/assets/why-quadrant-3.webp",
  },
  {
    id: 4,
    word: "BEST",
    title: "DIY frozen molds",
    lasts: "Lasts: 10 to 30 minutes.",
    rime: "Rime: The sealed rod never needs filling or cleaning. Just after use put it back in the freezer.",
    image: "/assets/why-quadrant-4.webp",
  },
];

export function WhyBest() {
  return (
    <section className="why" id="why" aria-label="Why Rime is the best">
      <div className="why__grid">
        {QUADRANTS.map((quadrant) => (
          <button
            className={`why__cell why__cell--${quadrant.id}`}
            type="button"
            key={quadrant.id}
          >
            <span
              className="why__flip"
              style={{ backgroundImage: `url(${quadrant.image})` }}
              aria-hidden="true"
            />
            <span className={`why__word why__word--${quadrant.id}`} aria-hidden="true">
              {quadrant.word}
            </span>
            <span className="why__content">
              <span className="why__title">{quadrant.title}</span>
              <span className="why__lasts">{quadrant.lasts}</span>
              <span className="why__rime">{quadrant.rime}</span>
            </span>
          </button>
        ))}
      </div>

      <span className="why__line why__line--vertical" aria-hidden="true" />
      <span className="why__line why__line--horizontal" aria-hidden="true" />
    </section>
  );
}
