import type { ReactNode } from 'react';
import {
  ArrowDownToLine,
  Check,
  Crosshair,
  Flag,
  Info,
  Lock,
  Orbit,
  Package,
  Sparkles,
  Target,
  Wind,
} from 'lucide-react';
import { MISSION_TYPES, SUCCESS_TIERS } from '../data/missions';
import { TARGETS } from '../data/targets';
import type { MissionTypeId, TargetKind } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt } from '../lib/format';
import { useActiveChapter } from '../store/useCampaign';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { CAMPAIGN_ACCENTS, ChapterPatch, SignalRings } from '../components/CampaignArt';
import { Section } from '../components/StepShell';
import { TargetImage } from '../components/TargetImage';

const kindLabels: Record<TargetKind, { ar: string; en: string }> = {
  moon: { ar: 'قمر', en: 'Moon' },
  planet: { ar: 'كوكب', en: 'Planet' },
  gasGiant: { ar: 'عملاق غازي', en: 'Gas giant' },
  asteroid: { ar: 'كويكب', en: 'Asteroid' },
  comet: { ar: 'مذنب', en: 'Comet' },
  dwarfPlanet: { ar: 'كوكب قزم', en: 'Dwarf planet' },
};

const missionIcons: Record<MissionTypeId, typeof Target> = {
  flyby: Wind,
  orbiter: Orbit,
  lander: ArrowDownToLine,
  rendezvous: Crosshair,
  sampleReturn: Package,
};

export function Step01Objectives({ onCampaign }: { onCampaign?: () => void }) {
  const design = useDesign();
  const t = useT();
  const l = useL();
  const chapter = useActiveChapter();
  const locked = Boolean(chapter);
  const accent = chapter ? CAMPAIGN_ACCENTS[chapter.accent] : null;
  const setTarget = useMissionStore((state) => state.setTarget);
  const setMissionType = useMissionStore((state) => state.setMissionType);
  const setChoice = useMissionStore((state) => state.setChoice);
  const setStep = useMissionStore((state) => state.setStep);

  const scienceShort = design.science.raw < design.tier.minScience;

  return (
    <div className="space-y-4">
      {chapter && accent ? (
        <section className={`relative overflow-hidden rounded-2xl border ${accent.border} ${accent.soft}`}>
          <div className="campaign-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 opacity-60" aria-hidden="true">
            <SignalRings className="h-full w-full" />
          </div>
          <div className="relative flex flex-wrap items-start gap-3 p-4">
            <ChapterPatch chapter={chapter} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold-200/90">
                  <Flag className="h-3 w-3" aria-hidden="true" />
                  {t('توجيه الحملة', 'Campaign directive')}
                </span>
                <span className={`font-latin text-[9px] font-bold tracking-[0.16em] ${accent.text}`} dir="ltr">
                  CHAPTER {String(chapter.number).padStart(2, '0')} · {chapter.code}
                </span>
              </div>
              <h2 className="mt-0.5 text-lg font-black text-white">{l(chapter.title)}</h2>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-200">{l(chapter.objective)}</p>
              <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-400">{l(chapter.briefing)}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="chip !px-2 !py-0.5 !text-[9px]">
                  <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
                  <Target className="h-2.5 w-2.5 text-royal-300" aria-hidden="true" />
                  {l(design.target.name)}
                </span>
                <span className="chip !px-2 !py-0.5 !text-[9px]">
                  <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
                  {l(design.missionType.short)}
                </span>
                <span className="chip !px-2 !py-0.5 !text-[9px]">
                  <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
                  {l(design.tier.name)}
                </span>
                <span className="chip !px-2 !py-0.5 !text-[9px] font-latin" dir="ltr">
                  <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
                  {chapter.seed}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-void-950/30 px-2.5 py-2">
                <p className="text-[10px] leading-relaxed text-slate-400">
                  {t(
                    'الهدف ونوع المهمة ومعيار النجاح والبذرة ثابتة. المنصة والأجهزة والصاروخ والطاقة والاتصالات والمدار بين يديك بالكامل.',
                    'Target, mission type, success tier and seed are fixed. The bus, instruments, launcher, power, communications and orbit are entirely yours.',
                  )}
                </p>
                {onCampaign ? (
                  <button type="button" onClick={onCampaign} className="btn-ghost !px-2.5 !py-1 text-[10px]">
                    <Flag className="h-3 w-3 text-gold-300" aria-hidden="true" />
                    {t('ملف الفصل', 'Chapter dossier')}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <Section
        title={t('إلى أين نتجه؟', 'Where are we going?')}
        description={
          locked
            ? t(
                'هدف الفصل مثبّت. استكشف بياناته هنا، لكن غيّر قراراتك الهندسية لا وجهتك.',
                'The chapter target is fixed. Explore its data here, but change engineering decisions, not the destination.',
              )
            : t(
                'اختر هدفًا. المسافة تحدد الطاقة، والميل يحدد كلفة تغيير المستوى، والبيئة تحدد نوع المهمة الممكن.',
                'Pick a target. Distance sets energy, inclination sets plane-change cost, and the environment limits the viable mission type.',
              )
        }
        action={
          locked ? (
            <StatusPill tone="warn">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {t('هدف ثابت', 'Fixed target')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {TARGETS.map((target) => {
            const active = design.target.id === target.id;
            return (
              <div
                key={target.id}
                className={`selectable overflow-hidden text-start ${active ? 'selectable-on' : ''} ${
                  locked && !active ? 'opacity-30 saturate-50' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setTarget(target.id)}
                  disabled={locked}
                  aria-pressed={active}
                  className="block w-full rounded-2xl text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70 disabled:cursor-not-allowed"
                >
                  <TargetImage target={target} className="h-24 w-full" compact />
                  <div className="px-2.5 pt-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <span className="min-w-0 truncate text-xs font-bold text-white">{l(target.name)}</span>
                      {active ? (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-400 text-void-950">
                          <Check className="h-2.5 w-2.5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded bg-royal-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-royal-300">
                        {l(kindLabels[target.kind])}
                      </span>
                      <span className="text-[9px] text-slate-500">#{target.horizonsId}</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 font-latin text-[9px] text-slate-500" dir="ltr">
                      <span>☀ {fmt(target.sunDistanceAU, 3)} AU</span>
                      <span>⊕ {fmt(target.earthDistanceAU, 3)} AU</span>
                    </div>
                  </div>
                </button>
                <div className="px-2.5 pb-2.5 pt-1.5">
                  <DataSourceBadges
                    sources={target.sbdbId ? ['horizons', 'sbdb'] : ['horizons']}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          title={l(design.target.name)}
          description={l(design.target.description)}
          action={
            <StatusPill tone="info">
              {l(kindLabels[design.target.kind])}
            </StatusPill>
          }
        >
          <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
            <TargetImage target={design.target} className="aspect-[4/3] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-1.5">
              <Stat label={t('المسافة عن الشمس', 'Sun distance')} value={<span className="num">{fmt(design.target.sunDistanceAU, 3)} AU</span>} />
              <Stat label={t('المسافة عن الأرض', 'Earth distance')} value={<span className="num">{fmt(design.target.earthDistanceAU, 3)} AU</span>} />
              <Stat label={t('نصف المحور الأكبر', 'Semi-major axis')} value={<span className="num">{fmt(design.target.semiMajorAxisAU, 3)} AU</span>} />
              <Stat label={t('الانحراف المداري', 'Eccentricity')} value={<span className="num">{fmt(design.target.eccentricity, 3)}</span>} />
              <Stat label={t('الميل المداري', 'Inclination')} value={<span className="num">{fmt(design.target.inclinationDeg, 2)}°</span>} />
              <Stat label={t('الفترة المدارية', 'Orbital period')} value={<span className="num">{fmt(design.target.orbitalPeriodYears, 2)} yr</span>} />
              <Stat label={t('القطر', 'Diameter')} value={<span className="num">{fmt(design.target.diameterKm, design.target.diameterKm < 10 ? 2 : 0)} km</span>} />
              <Stat label={t('الجاذبية', 'Gravity')} value={<span className="num">{fmt(design.target.gravityMS2, 4)} m/s²</span>} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {design.target.allowedMissions.map((id) => {
              const meta = MISSION_TYPES.find((mission) => mission.id === id);
              return meta ? (
                <span key={id} className="chip !text-[10px]">
                  {l(meta.short)}
                </span>
              ) : null;
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <DataSourceBadges sources={[...design.target.sourceKeys, 'nasaFact']} />
            <span className="font-latin text-[9px] text-slate-600" dir="ltr">
              snapshot {design.target.snapshotDate}
            </span>
          </div>
          <SimplifiedNote className="mt-3">{l(design.target.simplifiedNote)}</SimplifiedNote>
        </Section>

        <Section
          title={t('حقائق الهدف', 'Target facts')}
          description={t('القيم الحقيقية من NASA، وقيم دلتا-في التقريبية موسومة بوضوح.', 'Real NASA values, with approximate Δv values clearly marked.')}
        >
          <div className="space-y-1.5">
            <FactRow label={t('معرّف Horizons', 'Horizons ID')} value={design.target.horizonsId} mono />
            <FactRow label={t('معرّف SBDB', 'SBDB ID')} value={design.target.sbdbId ?? '—'} mono />
            <FactRow label={t('دوران الجسم', 'Rotation period')} value={`${fmt(design.target.rotationHours, 2)} h`} mono />
            <FactRow label={t('معامل الخطورة', 'Hazard factor')} value={fmt(design.target.hazardFactor, 2)} mono />
            <FactRow label={t('يدعم إرجاع العينات', 'Sample-return capable')} value={t(design.target.sampleReturnCapable ? 'نعم' : 'لا', design.target.sampleReturnCapable ? 'Yes' : 'No')} />
            <FactRow label={t('يدعم الهبوط', 'Landing capable')} value={t(design.target.landingCapable ? 'نعم' : 'لا', design.target.landingCapable ? 'Yes' : 'No')} />
          </div>
          <div className="mt-3 rounded-xl border border-white/[0.07] bg-void-900/40 p-3">
            <div className="mb-1 text-[10px] font-bold text-slate-400">{t('صورة NASA وإسنادها', 'NASA image & credit')}</div>
            <div className="text-[10px] leading-relaxed text-slate-500">{design.target.image.credit}</div>
            {design.target.image.nasaId ? (
              <div className="mt-1 font-latin text-[10px] text-royal-300" dir="ltr">
                {design.target.image.nasaId}
              </div>
            ) : (
              <div className="mt-1 text-[10px] text-gold-300/80">{t('توضيح فني — لا صورة NASA في اللقطة', 'Illustrative — no NASA image in the snapshot')}</div>
            )}
          </div>
        </Section>
      </div>

      <Section
        title={t('نوع المهمة', 'Mission type')}
        description={t('النوع يحدد ما تفعله عند الوصول، ومعاملات العلم والبيانات، واحتياج الالتقاط والهبوط.', 'The type defines what happens at arrival, the science/data multipliers, and whether capture or landing is required.')}
        action={
          locked ? (
            <StatusPill tone="warn">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {t('نوع ثابت', 'Fixed type')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {MISSION_TYPES.map((mission) => {
            const allowed = design.target.allowedMissions.includes(mission.id);
            const active = design.missionType.id === mission.id;
            const Icon = missionIcons[mission.id];
            return (
              <button
                key={mission.id}
                type="button"
                onClick={() => setMissionType(mission.id)}
                disabled={!allowed || locked}
                aria-pressed={active}
                className={`selectable p-3 text-start ${active ? 'selectable-on' : ''} ${
                  !allowed || (locked && !active) ? 'cursor-not-allowed opacity-40' : ''
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {!allowed ? <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" /> : active ? <Check className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" /> : null}
                </div>
                <div className="text-xs font-bold text-white">{l(mission.name)}</div>
                <p className="mt-1 min-h-[2.8rem] text-[10px] leading-relaxed text-slate-400">{l(mission.description)}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-latin text-[9px] text-slate-400" dir="ltr">science ×{mission.scienceMultiplier}</span>
                  <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-latin text-[9px] text-slate-400" dir="ltr">data ×{mission.dataMultiplier}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        title={t('معيار النجاح', 'Success tier')}
        description={t('يحدد الحد الأدنى للعلم والبيانات. التقييم يقارن النتيجة بهذا المعيار، لا بمجرد نجاح المركبة.', 'Sets the minimum science and data. Scoring compares to this tier, not merely to spacecraft survival.')}
        action={
          locked ? (
            <StatusPill tone="warn">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {t('معيار ثابت', 'Fixed tier')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {SUCCESS_TIERS.map((tier) => {
            const active = design.tier.id === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setChoice('successTier', tier.id)}
                disabled={locked}
                aria-pressed={active}
                className={`selectable p-3.5 text-start ${active ? 'selectable-on' : ''} ${
                  locked && !active ? 'cursor-not-allowed opacity-40' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{l(tier.name)}</span>
                  {active ? <Check className="h-4 w-4 text-gold-300" aria-hidden="true" /> : null}
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{l(tier.description)}</p>
                <div className="mt-2 flex gap-1.5">
                  <span className="chip !px-2 !py-0.5 text-[10px]"><span className="font-latin">{tier.minScience}</span> {t('علم', 'science')}</span>
                  <span className="chip !px-2 !py-0.5 text-[10px]"><span className="font-latin">{tier.minDataGb}</span> GB</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-[11px] ${scienceShort ? 'border-warn/25 bg-warn/[0.05] text-warn' : 'border-good/20 bg-good/[0.04] text-good'}`}>
          <span className="flex items-center gap-1.5 font-semibold">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            {scienceShort
              ? t(`العائد العلمي المتوقع ${fmt(design.science.raw, 1)} أقل من ${design.tier.minScience} المطلوبة.`, `Projected science ${fmt(design.science.raw, 1)} is below the ${design.tier.minScience} requirement.`)
              : t(`العائد العلمي المتوقع ${fmt(design.science.raw, 1)} يحقق ${design.tier.minScience} المطلوبة.`, `Projected science ${fmt(design.science.raw, 1)} meets the ${design.tier.minScience} requirement.`)}
          </span>
          {scienceShort ? (
            <button type="button" onClick={() => setStep(3)} className="inline-flex items-center gap-1 rounded-lg border border-warn/30 px-2 py-1 text-[10px] font-bold hover:bg-warn/10">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t('أضف أجهزة', 'Add instruments')}
            </button>
          ) : null}
        </div>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-void-900/35 px-2 py-1.5">
      <div className="text-[9px] text-slate-500">{label}</div>
      <div className="mt-0.5 text-[11px] font-bold text-slate-200">{value}</div>
    </div>
  );
}

function FactRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="table-row">
      <span className="text-[11px] text-slate-400">{label}</span>
      <span className={`text-[11px] font-semibold text-slate-200 ${mono ? 'font-latin' : ''}`} dir={mono ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}
