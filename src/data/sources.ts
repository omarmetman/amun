import type { SourceDef, SourceKey } from './types';

/**
 * Central source registry. Every real-world number in the game points at one
 * of these records, which the DataSourceBadge renders with its URL, fetch
 * state and timestamp. `game` is deliberately not a NASA source.
 */
export const SOURCES: Record<SourceKey, SourceDef> = {
  horizons: {
    key: 'horizons',
    name: { ar: 'JPL Horizons: نظام البيانات الفلكية', en: 'JPL Horizons: Solar System Dynamics' },
    publisher: 'NASA/JPL-Caltech',
    url: 'https://ssd.jpl.nasa.gov/api/horizons.api',
    note: {
      ar: 'مسافات هدف/الأرض والشمس عند لقطة 12 نوفمبر 2026.',
      en: 'Target–Earth and target–Sun ranges at the 12 Nov 2026 snapshot epoch.',
    },
  },
  sbdb: {
    key: 'sbdb',
    name: { ar: 'JPL Small-Body Database', en: 'JPL Small-Body Database' },
    publisher: 'NASA/JPL-Caltech',
    url: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
    note: {
      ar: 'العناصر المدارية والقطر والدوران للأجسام الصغيرة.',
      en: 'Orbital elements, diameter and rotation for small bodies.',
    },
  },
  ntrs: {
    key: 'ntrs',
    name: { ar: 'NASA Technical Reports Server', en: 'NASA Technical Reports Server' },
    publisher: 'NASA STI Program',
    url: 'https://ntrs.nasa.gov/api/citations/search',
    note: {
      ar: 'مراجع هندسية اختيارية للأنظمة والدفع.',
      en: 'Optional engineering references for systems and propulsion.',
    },
  },
  nasaImages: {
    key: 'nasaImages',
    name: { ar: 'أرشيف صور المهام', en: 'Mission imagery archives' },
    publisher: 'NASA / ESA / JAXA',
    url: 'https://images.nasa.gov/search',
    note: {
      ar: 'صور الأهداف الحقيقية مع الإسناد الأصلي (NASA وESA وJAXA).',
      en: 'Real target imagery with its original credit (NASA, ESA and JAXA).',
    },
  },
  basics: {
    key: 'basics',
    name: { ar: 'Basics of Space Flight', en: 'Basics of Space Flight' },
    publisher: 'NASA/JPL',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
    note: {
      ar: 'مرجع المفاهيم في لوحة «تعلّم».',
      en: 'Concept reference for the Learn panel.',
    },
  },
  nasaFact: {
    key: 'nasaFact',
    name: { ar: 'NASA Planetary Fact Sheet', en: 'NASA Planetary Fact Sheet' },
    publisher: 'NASA Goddard Space Flight Center',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    note: {
      ar: 'قيم مرجعية للكواكب: الجاذبية، القطر، الميل المداري.',
      en: 'Reference planetary values: gravity, diameter, inclination.',
    },
  },
  dsn: {
    key: 'dsn',
    name: { ar: 'NASA Deep Space Network', en: 'NASA Deep Space Network' },
    publisher: 'NASA/JPL-Caltech',
    url: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/experimental-dsn/',
    note: {
      ar: 'مرجع هوائيات 34 م و70 م ومعايرة معامل الأرض.',
      en: 'Reference for 34 m and 70 m stations and ground gain.',
    },
  },
  launchApprox: {
    key: 'launchApprox',
    name: { ar: 'بيانات إطلاق منشورة، تقريبية', en: 'Published launch data, approximate' },
    publisher: 'NASA / launch providers',
    url: 'https://www.nasa.gov/nasa-missions/',
    note: {
      ar: 'جداول الحمولة مقابل C3 مبسّطة للعبة ومبنية على أرقام منشورة.',
      en: 'Payload-vs-C3 tables are game simplifications built from published figures.',
    },
  },
  game: {
    key: 'game',
    name: { ar: 'قيمة مبسّطة للعبة', en: 'Simplified for game' },
    publisher: 'AMUN',
    url: '',
    note: {
      ar: 'ليست بيانات NASA؛ اختيرت لموازنة اللعب.',
      en: 'Not NASA data; tuned for gameplay balance.',
    },
  },
};

export const sourceUrl = (key: SourceKey): string => SOURCES[key].url;

export const statusLabel = {
  live: { ar: 'مباشر', en: 'Live' },
  cached: { ar: 'مخزّن مؤقتًا', en: 'Cached' },
  snapshot: { ar: 'لقطة مضمّنة', en: 'Snapshot' },
  simplified: { ar: 'مبسّط للعبة', en: 'Game-simplified' },
} as const;

export type DataStatus = keyof typeof statusLabel;
