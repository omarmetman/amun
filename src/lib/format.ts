/** Formatting helpers. Technical values always use Western digits + LTR. */

const cache = new Map<string, Intl.NumberFormat>();

const nf = (digits: number): Intl.NumberFormat => {
  const key = String(digits);
  const found = cache.get(key);
  if (found) return found;
  const made = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  cache.set(key, made);
  return made;
};

export const fmt = (value: number, digits = 0): string => {
  if (!Number.isFinite(value)) return '∞';
  return nf(digits).format(value);
};

export const fmtPct = (ratio: number, digits = 1): string => {
  if (!Number.isFinite(ratio)) return '∞';
  return `${nf(digits).format(ratio * 100)}%`;
};

export const fmtMoney = (millions: number, digits = 1): string =>
  `$${fmt(millions, digits)}M`;

export const fmtDate = (iso: string, lang: 'ar' | 'en'): string => {
  const date = new Date(iso.includes('T') ? iso : `${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const fmtDateTime = (iso: string, lang: 'ar' | 'en'): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
};

export const clamp = (value: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, value));

export const clamp01 = (value: number): number => clamp(value, 0, 1);

export type MarginTone = 'negative' | 'low' | 'ideal' | 'high';

export const marginTone = (margin: number): MarginTone => {
  if (!Number.isFinite(margin) || margin < 0) return 'negative';
  if (margin < 0.1) return 'low';
  if (margin <= 0.3) return 'ideal';
  return 'high';
};

export const toneText: Record<MarginTone, string> = {
  negative: 'text-danger',
  low: 'text-warn',
  ideal: 'text-good',
  high: 'text-gold-300',
};

export const toneBg: Record<MarginTone, string> = {
  negative: 'bg-danger',
  low: 'bg-warn',
  ideal: 'bg-good',
  high: 'bg-gold-400',
};

export const toneBorder: Record<MarginTone, string> = {
  negative: 'border-danger/40',
  low: 'border-warn/40',
  ideal: 'border-good/40',
  high: 'border-gold-400/40',
};

export const signed = (value: number, digits = 0): string =>
  `${value >= 0 ? '+' : '−'}${fmt(Math.abs(value), digits)}`;
