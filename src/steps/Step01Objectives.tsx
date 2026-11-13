import { MISSION_TYPES, SUCCESS_TIERS } from '../data/missions';
import { TARGETS } from '../data/targets';
import type { MissionTypeId, TargetKind } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt } from '../lib/format';
import { useActiveChapter } from '../store/useCampaign';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { CAMPAIGN_ACCENTS, ChapterPatch } from '../components/CampaignArt';
import { Section } from '../components/StepShell';
import { SpecTable } from '../components/StepBits';
import { TargetImage } from '../components/TargetImage';
import {
  IconCheck,
  IconFlyby,
  IconFlag,
  IconLander,
  IconLock,
  IconOrbit,
  IconRendezvous,
  IconSample,
  IconTarget,
} from '../components/Icons';

const kindLabels: Record<TargetKind, { ar: string; en: string }> = {
  moon: { ar: 'قمر', en: 'Moon' },
  planet: { ar: 'كوكب', en: 'Planet' },
  gasGiant: { ar: 'عملاق غازي', en: 'Gas giant' },
  asteroid: { ar: 'كويكب', en: 'Asteroid' },
  comet: { ar: 'مذنب', en: 'Comet' },
  dwarfPlanet: { ar: 'كوكب قزم', en: 'Dwarf planet' },
};

const missionIcons: Record<MissionTypeId, typeof IconFlyby> = {
  flyby: IconFlyby,
  orbiter: IconOrbit,
  lander: IconLander,
  rendezvous: IconRendezvous,
  sampleReturn: IconSample,
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

  const missionOptions = MISSION_TYPES.map((mission) => {
    const allowed = design.target.allowedMissions.includes(mission.id);
    const Icon = missionIcons[mission.id];
    return {
      id: mission.id,
      title: l(mission.name),
      icon: <Icon className="h-4 w-4" />,
      note: (
        <>
          {l(mission.description)}
          {!allowed ? (
            <span className="mt-0.5 block text-[10px] text-amber">
              {t('غير متاح لهذا الهدف', 'Not available for this target')}
            </span>
          ) : null}
        </>
      ),
      disabled: !allowed,
      cells: {
        science: `×${fmt(mission.scienceMultiplier, 1)}`,
        data: `×${fmt(mission.dataMultiplier, 1)}`,
        status: allowed ? t('متاح', 'Open') : t('مقفل', 'Locked'),
      },
    };
  });

  const tierOptions = SUCCESS_TIERS.map((tier) => ({
    id: tier.id,
    title: l(tier.name),
    note: l(tier.description),
    cells: {
      science: fmt(tier.minScience, 0),
      data: `${fmt(tier.minDataGb, 1)} GB`,
    },
  }));

  return (
    <div className="space-y-5">
      {chapter && accent ? (
        <section
          className="border border-s-2 border-royal-700"
          style={{ borderInlineStartColor: accent.hex }}
        >
          <div className="flex flex-wrap items-start gap-3 p-3.5">
            <ChapterPatch chapter={chapter} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="inline-flex items-baseline gap-1.5 text-[10px] text-ochre-300">
                  <IconFlag className="h-3 w-3 self-center" />
                  {t('توجيه الحملة', 'Campaign directive')}
                </span>
                <span className={`font-latin text-[10px] tabular-nums ${accent.text}`} dir="ltr">
                  CHAPTER {String(chapter.number).padStart(2, '0')} / {chapter.code}
                </span>
              </div>
              <h2 className="mt-0.5 font-display text-lg leading-snug text-limestone-50">
                {l(chapter.title)}
              </h2>
              <p className="mt-1 max-w-[64ch] text-sm leading-[1.8] text-limestone-100">
                {l(chapter.objective)}
              </p>
              <p className="mt-1 max-w-[64ch] text-xs leading-[1.8] text-limestone-300">
                {l(chapter.briefing)}
              </p>

              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-royal-700 pt-2 sm:grid-cols-4">
                <BannerFact label={t('الهدف', 'Target')} value={l(design.target.name)} />
                <BannerFact label={t('المهمة', 'Mission')} value={l(design.missionType.short)} />
                <BannerFact label={t('المعيار', 'Tier')} value={l(design.tier.name)} />
                <BannerFact label={t('البذرة', 'Seed')} value={chapter.seed} latin />
              </dl>

              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-2">
                <p className="max-w-[62ch] text-[11px] leading-relaxed text-limestone-300">
                  {t(
                    'الهدف ونوع المهمة ومعيار النجاح والبذرة ثابتة. المنصة والأجهزة والصاروخ والطاقة والاتصالات والمدار بين يديك بالكامل.',
                    'Target, mission type, success tier and seed are fixed. The bus, instruments, launcher, power, communications and orbit are entirely yours.',
                  )}
                </p>
                {onCampaign ? (
                  <button type="button" onClick={onCampaign} className="btn-ghost text-xs">
                    <IconFlag className="h-3.5 w-3.5" />
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
              <IconLock className="h-3 w-3" />
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
                  locked && !active ? 'opacity-40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setTarget(target.id)}
                  disabled={locked}
                  aria-pressed={active}
                  className="block w-full text-start focus:outline-none disabled:cursor-not-allowed"
                >
                  <TargetImage target={target} className="h-28 w-full" compact />
                  <div className="px-2.5 pb-2 pt-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="min-w-0 truncate text-sm text-limestone-50">{l(target.name)}</span>
                      {active ? (
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-ochre-300" />
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[10px] text-limestone-400">
                      <span>{l(kindLabels[target.kind])}</span>
                      <span className="font-latin tabular-nums" dir="ltr">#{target.horizonsId}</span>
                    </div>
                    <dl className="mt-1.5 grid grid-cols-2 gap-x-2 border-t border-royal-700 pt-1.5 font-latin text-[10px] tabular-nums text-limestone-300" dir="ltr">
                      <div>
                        <dt className="text-limestone-400">AU sun</dt>
                        <dd>{fmt(target.sunDistanceAU, 3)}</dd>
                      </div>
                      <div>
                        <dt className="text-limestone-400">AU earth</dt>
                        <dd>{fmt(target.earthDistanceAU, 3)}</dd>
                      </div>
                    </dl>
                  </div>
                </button>
                <div className="border-t border-royal-700 px-2.5 py-1.5">
                  <DataSourceBadges sources={target.sbdbId ? ['horizons', 'sbdb'] : ['horizons']} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          title={l(design.target.name)}
          description={l(design.target.description)}
          action={<StatusPill tone="info">{l(kindLabels[design.target.kind])}</StatusPill>}
        >
          <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
            <TargetImage
              target={design.target}
              className="aspect-[4/3] w-full border border-royal-700"
            />
            <dl className="grid grid-cols-2 gap-x-3">
              <TargetFigure label={t('المسافة عن الشمس', 'Sun distance')} value={`${fmt(design.target.sunDistanceAU, 3)} AU`} />
              <TargetFigure label={t('المسافة عن الأرض', 'Earth distance')} value={`${fmt(design.target.earthDistanceAU, 3)} AU`} />
              <TargetFigure label={t('نصف المحور الأكبر', 'Semi-major axis')} value={`${fmt(design.target.semiMajorAxisAU, 3)} AU`} />
              <TargetFigure label={t('الانحراف المداري', 'Eccentricity')} value={fmt(design.target.eccentricity, 3)} />
              <TargetFigure label={t('الميل المداري', 'Inclination')} value={`${fmt(design.target.inclinationDeg, 2)}°`} />
              <TargetFigure label={t('الفترة المدارية', 'Orbital period')} value={`${fmt(design.target.orbitalPeriodYears, 2)} yr`} />
              <TargetFigure label={t('القطر', 'Diameter')} value={`${fmt(design.target.diameterKm, design.target.diameterKm < 10 ? 2 : 0)} km`} />
              <TargetFigure label={t('الجاذبية', 'Gravity')} value={`${fmt(design.target.gravityMS2, 4)} m/s²`} />
            </dl>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {design.target.allowedMissions.map((id) => {
              const meta = MISSION_TYPES.find((mission) => mission.id === id);
              return meta ? (
                <span key={id} className="chip !text-[11px]">
                  {l(meta.short)}
                </span>
              ) : null;
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-2">
            <DataSourceBadges sources={[...design.target.sourceKeys, 'nasaFact']} />
            <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
              snapshot {design.target.snapshotDate}
            </span>
          </div>
          <SimplifiedNote className="mt-3">{l(design.target.simplifiedNote)}</SimplifiedNote>
        </Section>

        <Section
          title={t('حقائق الهدف', 'Target facts')}
          description={t('القيم الحقيقية من NASA، وقيم دلتا-في التقريبية موسومة بوضوح.', 'Real NASA values, with approximate Δv values clearly marked.')}
        >
          <div>
            <FactRow label={t('معرّف Horizons', 'Horizons ID')} value={design.target.horizonsId} mono />
            <FactRow label={t('معرّف SBDB', 'SBDB ID')} value={design.target.sbdbId ?? t('غير متاح', 'Not available')} mono />
            <FactRow label={t('دوران الجسم', 'Rotation period')} value={`${fmt(design.target.rotationHours, 2)} h`} mono />
            <FactRow label={t('معامل الخطورة', 'Hazard factor')} value={fmt(design.target.hazardFactor, 2)} mono />
            <FactRow label={t('يدعم إرجاع العينات', 'Sample-return capable')} value={t(design.target.sampleReturnCapable ? 'نعم' : 'لا', design.target.sampleReturnCapable ? 'Yes' : 'No')} />
            <FactRow label={t('يدعم الهبوط', 'Landing capable')} value={t(design.target.landingCapable ? 'نعم' : 'لا', design.target.landingCapable ? 'Yes' : 'No')} />
          </div>
          <div className="mt-3 border-s border-royal-600 ps-3">
            <div className="text-[10px] text-limestone-400">{t('صورة NASA وإسنادها', 'NASA image and credit')}</div>
            <div className="mt-0.5 text-[11px] leading-relaxed text-limestone-200">{design.target.image.credit}</div>
            {design.target.image.nasaId ? (
              <div className="mt-1 font-latin text-[10px] tabular-nums text-royal-300" dir="ltr">
                {design.target.image.nasaId}
              </div>
            ) : (
              <div className="mt-1 text-[10px] text-ochre-300">
                {t('توضيح فني، لا صورة NASA في اللقطة', 'Illustrative, no NASA image in the snapshot')}
              </div>
            )}
          </div>
        </Section>
      </div>

      <Section
        title={t('نوع المهمة', 'Mission type')}
        description={t('النوع يحدد ما تفعله عند الوصول، ومعاملات العلم والبيانات، واحتياج الالتقاط والهبوط.', 'The type defines what happens at arrival, the science and data multipliers, and whether capture or landing is required.')}
        action={
          locked ? (
            <StatusPill tone="warn">
              <IconLock className="h-3 w-3" />
              {t('نوع ثابت', 'Fixed type')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <SpecTable
          label={t('نوع المهمة', 'Mission type')}
          columns={[
            { key: 'science', label: t('العلم', 'Science') },
            { key: 'data', label: t('البيانات', 'Data') },
            { key: 'status', label: t('الحالة', 'Status'), numeric: false },
          ]}
          options={missionOptions}
          selectedId={design.missionType.id}
          onSelect={(id) => setMissionType(id as MissionTypeId)}
          disabled={locked}
        />
      </Section>

      <Section
        title={t('معيار النجاح', 'Success tier')}
        description={t('يحدد الحد الأدنى للعلم والبيانات. التقييم يقارن النتيجة بهذا المعيار، لا بمجرد نجاح المركبة.', 'Sets the minimum science and data. Scoring compares to this tier, not merely to spacecraft survival.')}
        action={
          locked ? (
            <StatusPill tone="warn">
              <IconLock className="h-3 w-3" />
              {t('معيار ثابت', 'Fixed tier')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <SpecTable
          label={t('معيار النجاح', 'Success tier')}
          columns={[
            { key: 'science', label: t('علم مطلوب', 'Science') },
            { key: 'data', label: t('بيانات مطلوبة', 'Data') },
          ]}
          options={tierOptions}
          selectedId={design.tier.id}
          onSelect={(id) => {
            const selected = SUCCESS_TIERS.find((tier) => tier.id === id);
            if (selected) setChoice('successTier', selected.id);
          }}
          disabled={locked}
        />

        <div
          className={`mt-3 flex flex-wrap items-center justify-between gap-2 border-s-2 py-1 ps-3 text-xs ${
            scienceShort ? 'border-amber text-amber' : 'border-malachite text-malachite'
          }`}
        >
          <span>
            {scienceShort
              ? t(
                  `العائد العلمي المتوقع ${fmt(design.science.raw, 1)} أقل من ${design.tier.minScience} المطلوبة.`,
                  `Projected science ${fmt(design.science.raw, 1)} is below the ${design.tier.minScience} requirement.`,
                )
              : t(
                  `العائد العلمي المتوقع ${fmt(design.science.raw, 1)} يحقق ${design.tier.minScience} المطلوبة.`,
                  `Projected science ${fmt(design.science.raw, 1)} meets the ${design.tier.minScience} requirement.`,
                )}
          </span>
          {scienceShort ? (
            <button type="button" onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 border-b border-amber pb-px text-[11px] text-amber hover:text-ochre-200">
              <IconTarget className="h-3.5 w-3.5" />
              {t('أضف أجهزة', 'Add instruments')}
            </button>
          ) : null}
        </div>
      </Section>
    </div>
  );
}

function BannerFact({ label, value, latin = false }: { label: string; value: string; latin?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] text-limestone-400">{label}</dt>
      <dd
        className={`truncate text-[11px] text-limestone-100 ${latin ? 'font-latin tabular-nums' : ''}`}
        dir={latin ? 'ltr' : undefined}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function TargetFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-royal-700 py-2">
      <dt className="text-[10px] leading-snug text-limestone-400">{label}</dt>
      <dd className="mt-0.5 font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
        {value}
      </dd>
    </div>
  );
}

function FactRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="table-row">
      <span className="text-xs text-limestone-300">{label}</span>
      <span
        className={`text-xs text-limestone-100 ${mono ? 'font-latin tabular-nums' : ''}`}
        dir={mono ? 'ltr' : undefined}
      >
        {value}
      </span>
    </div>
  );
}
