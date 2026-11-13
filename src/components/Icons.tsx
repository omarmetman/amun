import type { SVGProps } from 'react';

/**
 * One drawn set: 24px grid, 1.75 stroke, flat caps. These replace the
 * generic UI icons in the application chrome and step markers.
 */
function Glyph({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconMenu = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M3 6h18M3 12h18M3 18h12" />
  </Glyph>
);

export const IconBook = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4Z" />
    <path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6Z" />
  </Glyph>
);

export const IconMedal = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="9" r="5" />
    <path d="M9 13.5 7 21l5-2 5 2-2-7.5" />
  </Glyph>
);

export const IconFlag = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M5 21V4M5 4h13l-3 4 3 4H5" />
  </Glyph>
);

export const IconPlus = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 4v16M4 12h16" />
  </Glyph>
);

export const IconDownload = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </Glyph>
);

export const IconUpload = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 21V9M7 14l5-5 5 5M4 4h16" />
  </Glyph>
);

export const IconReset = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 10a8 8 0 1 1 2 6" />
    <path d="M4 4v6h6" />
  </Glyph>
);

export const IconExit = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
  </Glyph>
);

export const IconCheck = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 12l5 5L20 6" />
  </Glyph>
);

export const IconAlert = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 3 2.5 20h19Z" />
    <path d="M12 9v5M12 17v.5" />
  </Glyph>
);

export const IconCross = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Glyph>
);

export const IconInfo = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5V8" />
  </Glyph>
);

export const IconChevron = ({ dir = 'up', ...props }: SVGProps<SVGSVGElement> & { dir?: 'up' | 'down' | 'start' | 'end' }) => (
  <Glyph {...props}>
    {dir === 'up' ? <path d="M5 15l7-6 7 6" /> : null}
    {dir === 'down' ? <path d="M5 9l7 6 7-6" /> : null}
    {dir === 'start' ? <path d="M15 5l-7 7 7 7" /> : null}
    {dir === 'end' ? <path d="M9 5l7 7-7 7" /> : null}
  </Glyph>
);

export const IconTarget = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </Glyph>
);

export const IconPlay = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5 16 12l-6 3.5Z" />
  </Glyph>
);

export const IconHistory = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 11a8 8 0 1 1 2.3 6" />
    <path d="M4 4.5V11h6.5" />
    <path d="M12 8v5l3 2" />
  </Glyph>
);

export const IconTune = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 7h7M15 7h5M4 17h5M13 17h7" />
    <path d="M13 4v6M9 14v6" />
  </Glyph>
);

export const IconDice = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h.5M15.5 8h.5M8 15.5h.5M15.5 15.5h.5M12 12h.5" />
  </Glyph>
);

export const IconWrench = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M14 4a5 5 0 0 0-5.7 7.3L4 15.6 8.4 20l4.3-4.3A5 5 0 0 0 20 10l-3 3-3-3Z" />
  </Glyph>
);

export const IconLock = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="4" y="10" width="16" height="11" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
  </Glyph>
);

export const IconCompass = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </Glyph>
);

export const IconFlyby = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="7" cy="17" r="3" />
    <path d="M3 12C6 5 14 2.5 21 7" strokeDasharray="3 2" />
    <path d="M18 4.5 21 7l-3.5 1" />
  </Glyph>
);

export const IconOrbit = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="3" />
    <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-28 12 12)" />
    <circle cx="18.5" cy="7" r="1" fill="currentColor" stroke="none" />
  </Glyph>
);

export const IconLander = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M8 4h8v8l-4 3-4-3Z" />
    <path d="M6 20l3-5M18 20l-3-5M12 15v6M9 21h6" />
    <path d="M12 1v2" />
  </Glyph>
);

export const IconRendezvous = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="3" y="3" width="5" height="5" />
    <rect x="16" y="16" width="5" height="5" />
    <path d="M8 5.5h8a2.5 2.5 0 0 1 2.5 2.5v8M5.5 8v8A2.5 2.5 0 0 0 8 18.5h8" />
    <circle cx="12" cy="12" r="2" />
  </Glyph>
);

export const IconSample = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M5 8h14v11H5Z" />
    <path d="M8 8V5h8v3M8 12h8M12 12v7" />
    <path d="M5 8 2 5M19 8l3-3" />
  </Glyph>
);

export const IconBus = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="7" y="7" width="10" height="10" />
    <rect x="2" y="9" width="4" height="6" />
    <rect x="18" y="9" width="4" height="6" />
    <path d="M7 11H2M22 11h-5M12 7V4M9 4h6M9 17v3M15 17v3" />
  </Glyph>
);

export const IconThruster = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M9 4h6v7l3 4H6l3-4Z" />
    <path d="M9 15v2M12 15v4M15 15v2M4 6h3M17 6h3" />
  </Glyph>
);

export const IconShield = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 3 19 6v5c0 4-3 7-7 9-4-2-7-5-7-9V6Z" />
    <path d="M9 12l2 2 4-4" />
  </Glyph>
);

export const IconRadiation = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 4a8 8 0 0 1 6.9 4L15 10.5M5.1 8A8 8 0 0 1 12 4M5.1 8l3.9 2.5M6 17.5A8 8 0 0 0 12 20M6 17.5l3.9-2.5M18 17.5a8 8 0 0 1-6 2.5M18 17.5l-3.9-2.5" />
  </Glyph>
);

export const IconMicroscope = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M9 20h11M5 20h2M9 5h4v7H9Z" />
    <path d="M13 8h3l2 3-3 3h-2M9 15h5a3 3 0 0 0 3-3" />
    <path d="M9 2h4M11 2v3" />
  </Glyph>
);

export const IconRocket = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 2c3 3 4 7 4 11l-2 4h-4l-2-4c0-4 1-8 4-11Z" />
    <circle cx="12" cy="9" r="1.5" />
    <path d="M8 13 5 17l3-1M16 13l3 4-3-1M10 20l2 2 2-2" />
  </Glyph>
);

export const IconCrown = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 18h16M4 18 3 7l5 3 4-6 4 6 5-3-1 11" />
  </Glyph>
);

export const IconThumbUp = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M7 21V10l4-7 1.5 1.5L11 9h6.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 16.3 20H7Z" />
    <path d="M7 10H3v11h4" />
  </Glyph>
);

export const IconThumbDown = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M7 3v11l4 7 1.5-1.5L11 15h6.5a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 16.3 4H7Z" />
    <path d="M7 14H3V3h4" />
  </Glyph>
);

export const IconWallet = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 6h15v13H4Z" />
    <path d="M4 6l11-2v2M15 11h4v4h-4Z" />
  </Glyph>
);

export const IconClock = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Glyph>
);

export const IconFuel = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M6 4h9v16H6Z" />
    <path d="M9 4V2h3v2M15 8h3v6h-3M8 8h5v5H8Z" />
  </Glyph>
);

export const IconBattery = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="2" y="8" width="17" height="9" />
    <path d="M22 11v3M5 11v3M8 11v3M11 11v3" />
  </Glyph>
);

export const IconSun = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </Glyph>
);

export const IconAntenna = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M4 7a10 10 0 0 1 13 13L4 7Z" />
    <path d="M17 20 7 10M3 21h5" />
    <circle cx="15" cy="9" r="1.5" />
  </Glyph>
);

export const IconDatabase = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
  </Glyph>
);

export const IconCalendar = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18M7 3v4M17 3v4M7 14h4M7 17h7" />
  </Glyph>
);

export const IconRoute = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="5" r="2" />
    <path d="M7 19h6a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h8" />
  </Glyph>
);

export const IconWeight = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M5 21 9 8h6l4 13Z" />
    <circle cx="12" cy="4.5" r="2.5" />
  </Glyph>
);

export const IconFlask = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
    <path d="M7.5 15h9" />
  </Glyph>
);

export const IconBulb = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M9 17h6M10 21h4" />
    <path d="M12 3a6 6 0 0 1 3.5 10.8V17h-7v-3.2A6 6 0 0 1 12 3Z" />
  </Glyph>
);

export const IconFlame = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 21c4 0 6-2.7 6-6 0-4-3-7-4-12-1 4-4 6-4 9-1-1-1.5-2-2-3-1 2-2 4-2 6 0 3.3 2 6 6 6Z" />
  </Glyph>
);

export const IconGem = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M7 3h10l4 6-9 12L3 9Z" />
    <path d="M3 9h18M7 3l5 6 5-6M12 9v12" />
  </Glyph>
);

export const IconMoon = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10Z" />
  </Glyph>
);

export const IconStar = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="m12 3 2.8 6 6.2.8-4.5 4.4 1.1 6.3L12 17.4 6.4 20.5l1.1-6.3L3 9.8 9.2 9Z" />
  </Glyph>
);

export const IconPackage = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 2 21 7v10l-9 5-9-5V7Z" />
    <path d="m3 7 9 5 9-5M12 12v10M7.5 4.5 16.5 9.5" />
  </Glyph>
);

export const IconGlobe = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Glyph>
);

export const IconLayers = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="m12 3 9 5-9 5-9-5Z" />
    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  </Glyph>
);

export const IconFeather = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M20 4c-8 0-14 5-14 12v4M6 16h9M9 11h9M12 6h7" />
    <path d="M4 20 20 4" />
  </Glyph>
);

export const IconCoins = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <ellipse cx="10" cy="6" rx="6" ry="3" />
    <path d="M4 6v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6M4 12v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
    <path d="M16 9c2.3.4 4 1.5 4 3v6c0 1.7-2.7 3-6 3" />
  </Glyph>
);

export const IconScale = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M12 3v18M5 21h14M4 7h16" />
    <path d="M7 7 4 13h6ZM17 7l-3 6h6Z" />
  </Glyph>
);

export const IconBolt = (props: SVGProps<SVGSVGElement>) => (
  <Glyph {...props}>
    <path d="M13 2 4 14h7l-1 8 10-13h-7Z" />
  </Glyph>
);

export const IconLikely = IconCheck;
