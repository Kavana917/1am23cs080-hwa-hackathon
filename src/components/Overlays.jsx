import { useEffect, useRef } from "react";
import { useStore } from "../context/StoreContext.jsx";
import { Icon } from "./Icon.jsx";

const POINTS = [
  {
    title: "Supervise the first uses.",
    body: "Watch how your dog uses Rime for the first few sessions before leaving them alone with it.",
  },
  {
    title: "Never give the Chill Rod directly to your dog.",
    body: "The rod stays inside the sleeve and column at all times.",
  },
  {
    title: "Match the size to your dog.",
    body: "Standard is designed for small and medium dogs up to 40 lbs. XL is designed for large and giant dogs, 40+ lbs.",
  },
  {
    title: "Check for damage before each session.",
    body: "Inspect the sleeve, valve and collar. Replace anything cracked, torn or loose.",
  },
  {
    title: "Treat safety.",
    body: "Use only xylitol-free peanut butter and plain, unsweetened yogurt. Check every ingredient for xylitol, and skip treats your dog is allergic to or has been told to avoid.",
  },
  {
    title: "Mind the calories.",
    body: "Treat-loaded sessions add calories. Use plain frost sessions for everyday use.",
  },
  {
    title: "Talk to your vet",
    body: "before use if your dog has dental problems, a medical condition, a food allergy or a restricted diet.",
  },
  {
    title: "Puppies and seniors.",
    body: "Stay nearby and supervise every session.",
  },
  {
    title: "Not a substitute for care.",
    body: "Always make sure your dog has access to fresh water, exercise and company. Do not use Rime as the only thing keeping a dog occupied for longer than 3–4 hours.",
  },
];

export function SafetyDialog() {
  const { safetyOpen, setSafetyOpen } = useStore();
  const dialogRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (safetyOpen) {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (!dialog.open) dialog.showModal();
      const frame = window.requestAnimationFrame(() => dialog.classList.add("is-open"));
      return () => window.cancelAnimationFrame(frame);
    }

    dialog.classList.remove("is-open");
    closeTimer.current = window.setTimeout(() => {
      if (dialog.open) dialog.close();
    }, 380);
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, [safetyOpen]);

  useEffect(() => {
    if (!safetyOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onCancel = (event) => {
      event.preventDefault();
      setSafetyOpen(false);
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [safetyOpen, setSafetyOpen]);

  const handleBackdrop = (event) => {
    if (event.target === dialogRef.current) setSafetyOpen(false);
  };

  return (
    <dialog
      className="safety-dialog"
      ref={dialogRef}
      onClick={handleBackdrop}
      aria-labelledby="safety-dialog-title"
    >
      <div className="safety-dialog__inner">
        <div className="safety-dialog__head">
          <div>
            <span className="mono">Dog safety guide</span>
            <h2 id="safety-dialog-title">Built for lickers. Backed by care.</h2>
          </div>
          <button
            className="icon-btn"
            type="button"
            onClick={() => setSafetyOpen(false)}
            aria-label="Close safety guide"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="safety-dialog__body">
          <p className="safety-dialog__intro">
            <strong>A few simple habits.</strong> Read these points before the first session, and
            keep the sleeve and rod in good condition.
          </p>

          <ol className="safety-dialog__list">
            {POINTS.map((point) => (
              <li key={point.title}>
                <span>
                  <strong>{point.title}</strong> {point.body}
                </span>
              </li>
            ))}
          </ol>

          <div className="safety-dialog__foot">
            <p>
              Questions about a medical condition, allergy or diet? Ask your vet before use. This
              guide is general information, not veterinary advice.
            </p>
            <button className="btn btn--dark btn--sm" type="button" onClick={() => setSafetyOpen(false)}>
              Got it <Icon name="check" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
