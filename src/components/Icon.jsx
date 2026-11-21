export function Icon({ name, className = "" }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function Sprite() {
  return (
    <svg className="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <symbol id="i-arrow" viewBox="0 0 24 24">
        <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-down" viewBox="0 0 24 24">
        <path d="M12 4v15M5 13l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-plus" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="i-minus" viewBox="0 0 24 24">
        <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="m4 12.5 5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-warn" viewBox="0 0 24 24">
        <path d="M12 3.5 21 20H3L12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 9v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="17.1" r="0.9" fill="currentColor" />
      </symbol>
      <symbol id="i-snow" viewBox="0 0 24 24">
        <path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M12 6.5 9.4 4M12 6.5 14.6 4M12 17.5l-2.6 2.5M12 17.5l2.6 2.5M7 9.8 4.2 9M7 9.8l.4-2.9M17 14.2l2.8.8M17 14.2l-.4 2.9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </symbol>
      <symbol id="i-hex" viewBox="0 0 24 24">
        <path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7L12 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </symbol>
      <symbol id="i-drop" viewBox="0 0 24 24">
        <path d="M12 3.2c3.6 4.2 6 7 6 9.9a6 6 0 0 1-12 0c0-2.9 2.4-5.7 6-9.9Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-shield" viewBox="0 0 24 24">
        <path d="M12 3 20 6v6c0 4.6-3.2 7.7-8 9-4.8-1.3-8-4.4-8-9V6l8-3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m8.6 12 2.3 2.3 4.6-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-truck" viewBox="0 0 24 24">
        <path d="M3 6h10v10H3zM13 10h4l3 3v3h-7zM7 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 19ZM17 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 17 19Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-return" viewBox="0 0 24 24">
        <path d="M4 9h11a5 5 0 0 1 0 10H7M4 9l4-4M4 9l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-lock" viewBox="0 0 24 24">
        <rect x="4.5" y="10" width="15" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </symbol>
      <symbol id="i-clock" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.2V12l3.2 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </symbol>
      <symbol id="i-bag" viewBox="0 0 24 24">
        <path d="M5 8h14l-1 12H6L5 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 9V6.5a3 3 0 0 1 6 0V9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </symbol>
    </svg>
  );
}
