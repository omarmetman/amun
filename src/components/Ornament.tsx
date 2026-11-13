import type { ReactNode } from 'react';

/**
 * One abstract frieze: a water line, lotus buds and measuring ticks. It appears
 * once on the welcome sheet and once on the report cover, never as wallpaper.
 */
export function Frieze({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 20"
      preserveAspectRatio="xMidYMid slice"
      className={`h-5 w-full ${className}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <defs>
        <pattern id="amun-frieze" width="24" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 17.5h24" />
          <path d="M4 17.5V10l4-4 4 4v7.5" />
          <path d="M12 6V3.5" />
          <path d="M18 17.5V13M21 17.5V15" />
          <path d="M2 17.5v-2M6 17.5v-2" />
        </pattern>
      </defs>
      <rect width="240" height="20" fill="url(#amun-frieze)" />
    </svg>
  );
}

/** A single-rope cartouche: the name sits inside an oval with a tied base. */
export function Cartouche({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex items-center rounded-full border border-ochre-400/80 px-5 py-0.5 ${className}`}>
      <span className="pointer-events-none absolute inset-[3px] rounded-full border border-ochre-400/25" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-1 start-1/2 h-1.5 w-px -translate-x-1/2 bg-ochre-400/80" aria-hidden="true" />
      {children}
    </span>
  );
}
