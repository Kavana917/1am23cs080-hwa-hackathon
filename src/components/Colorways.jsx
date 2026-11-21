import { useStore } from "../context/StoreContext.jsx";
import { COLORS, COLOR_ORDER } from "../data.js";
import { TintedProduct } from "./TintedProduct.jsx";

export function Colorways() {
  const { color, setColor } = useStore();
  const swatch = COLORS[color];

  return (
    <section className="section colorways" id="colorways">
      <div className="container">
        <div className="colorways__panel" data-color={color} data-reveal>
          <div className="colorways__copy">
            <p className="eyebrow">
              <span className="eyebrow__line" />
              Four colourways
            </p>
            <h2 className="h2">
              Pick your
              <br />
              <em>{swatch.name}.</em>
            </h2>
            <p className="colorways__lede">
              A matte powder coat on 18/8 stainless steel, with a grippy finish that hides
              fingerprints. The honeycomb sleeve stays the same frosty silicone in every colourway.
            </p>

            <div className="swatches" role="group" aria-label="Choose a colourway">
              {COLOR_ORDER.map((key) => {
                const item = COLORS[key];
                return (
                  <button
                    type="button"
                    key={key}
                    className={`swatch ${color === key ? "is-active" : ""}`}
                    style={{ "--sw": item.hex }}
                    aria-pressed={color === key}
                    onClick={() => setColor(key)}
                  >
                    <span className="swatch__dot" aria-hidden="true" />
                    <span className="swatch__name">{item.name}</span>
                    <span className="swatch__sub">{item.sub}</span>
                  </button>
                );
              })}
            </div>

            <div className="colorways__meta">
              <span className="mono">Matte powder coat</span>
              <span className="mono">Replaceable sleeve</span>
            </div>
          </div>

          <div className="colorways__visual">
            <TintedProduct
              color={color}
              alt={`Rime column in ${swatch.name} with a frosted honeycomb sleeve`}
            />
            <div className="colorways__caption">
              <span className="mono">{swatch.name}</span>
              <span className="mono">{swatch.sub}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
