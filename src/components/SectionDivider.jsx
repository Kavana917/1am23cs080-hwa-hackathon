export function SectionDivider({ className = "" }) {
  return (
    <div
      className={`section-divider${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
