const QUADRANTS = [
  {
    id: 1,
    label: "Why Rime — detail one",
    image: "/assets/why-quadrant-1.webp",
  },
  {
    id: 2,
    label: "Why Rime — detail two",
    image: "/assets/why-quadrant-2.webp",
  },
  {
    id: 3,
    label: "Why Rime — detail three",
    image: "/assets/why-quadrant-3.webp",
  },
  {
    id: 4,
    label: "Why Rime — detail four",
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
            aria-label={quadrant.label}
            key={quadrant.id}
          >
            <span
              className="why__flip"
              style={{ backgroundImage: `url(${quadrant.image})` }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <span className="why__line why__line--vertical" aria-hidden="true" />
      <span className="why__line why__line--horizontal" aria-hidden="true" />
    </section>
  );
}
