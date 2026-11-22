import { useCallback, useEffect, useRef, useState } from "react";

export function Loader({ onReveal, onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const frame = useRef(0);
  const exitTimer = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 180 : 2350;
    const exitDuration = reduced ? 80 : 650;
    let start = 0;

    document.body.classList.add("is-locked");
    document.documentElement.classList.add("is-booting");

    const step = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frame.current = window.requestAnimationFrame(step);
        return;
      }

      setPhase("exiting");
      onReveal?.();
      exitTimer.current = window.setTimeout(() => {
        setPhase("done");
        document.body.classList.remove("is-locked");
        document.documentElement.classList.remove("is-booting");
        onDone?.();
      }, exitDuration);
    };

    frame.current = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame.current);
      window.clearTimeout(exitTimer.current);
      document.body.classList.remove("is-locked");
      document.documentElement.classList.remove("is-booting");
    };
  }, [onReveal, onDone]);

  if (phase === "done") return null;

  return (
    <div
      className={`loader${phase === "exiting" ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Rime"
    >
      <div className="loader__inner">
        <div className="loader__title-row">
          <span>CHILLING</span>
          <span>IN</span>
        </div>

        <div className="loader__sub-row">
          <span>Hydration in its prime.</span>
          <span>@RIME</span>
        </div>

        <div className="loader__foot">
          <span className="loader__meta">
            FROZEN LICK &nbsp;/&nbsp; COLD HYDRATION &nbsp;/&nbsp; 3–4 HOUR SESSION
          </span>
          <span className="loader__percent">{String(progress).padStart(3, "0")}%</span>
        </div>

        <div className="loader__track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default Loader;
