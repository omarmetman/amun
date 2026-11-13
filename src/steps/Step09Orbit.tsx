import type { TransferType } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtDate, fmtPct, marginTone } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, SpecTable, Stat } from '../components/StepBits';
import { IconAlert, IconCalendar, IconCompass, IconFlyby, IconOrbit, IconRoute } from '../components/Icons';

const TRANSFERS: Array<{
  id: TransferType;
  name: { ar: string; en: string };
  detail: { ar: string; en: string };
  c3: string;
  time: string;
  dv: string;
  icon: typeof IconRoute;
}> = [
  {
    id: 'hohmann',
    name: { ar: 'هوهمان (اقتصادي)', en: 'Hohmann (efficient)' },
    detail: {
      ar: 'المسار البيضاوي الأدنى للطاقة. زمن أطول لكنه يستهلك أقل دلتا-في.',
      en: 'The minimum-energy transfer ellipse. Longer, but the lowest Δv demand.',
    },
    c3: '×1.00',
    time: '×1.00',
    dv: '×1.00',
    icon: IconRoute,
  },
  {
    id: 'fast',
    name: { ar: 'سريع', en: 'Fast transfer' },
    detail: {
      ar: 'وصول أسرع على حساب طاقة إطلاق أعلى ودلتا-في أكبر. مناسب للمهام الحساسة للزمن.',
      en: 'Faster arrival at the cost of higher launch energy and more Δv. Suited to time-critical missions.',
    },
    c3: '×1.90',
    time: '×0.72',
    dv: '×1.15',
    icon: IconFlyby,
  },
  {
    id: 'assist',
    name: { ar: 'مساعدة جاذبية', en: 'Gravity assist' },
    detail: {
      ar: 'خفض C3 باستخدام كوكب عابر، مقابل رحلة أطول وهندسة أكثر تعقيدًا.',
      en: 'Lower C3 using a planetary flyby, at the cost of a longer and more complex cruise.',
    },
    c3: '×0.55',
    time: '×1.45',
    dv: '×1.02',
    icon: IconCompass,
  },
];

const BREAKDOWN = [
  { key: 'tcm', ar: 'تصحيح المسار (TCM)', en: 'Trajectory correction (TCM)' },
  { key: 'planeChange', ar: 'تغيير المستوى المداري', en: 'Plane change' },
  { key: 'insertion', ar: 'الالتقاط المداري', en: 'Orbit insertion' },
  { key: 'landing', ar: 'الهبوط', en: 'Landing' },
  { key: 'proximity', ar: 'عمليات القرب', en: 'Proximity operations' },
  { key: 'returnLeg', ar: 'رحلة الإرجاع', en: 'Return leg' },
] as const;

export function Step09Orbit() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const orbit = design.orbit;
  const total = Math.max(1, orbit.requiredDvMS);
  const tone = marginTone(orbit.dvMargin);
  const activeWindowId = design.choices.launchWindowId;

  const transferOptions = TRANSFERS.map((transfer) => {
    const Icon = transfer.icon;
    return {
      id: transfer.id,
      title: l(transfer.name),
      icon: <Icon className="h-4 w-4" />,
      note: l(transfer.detail),
      cells: {
        c3: `C₃ ${transfer.c3}`,
        time: `${t('زمن', 'time')} ${transfer.time}`,
        dv: `Δv ${transfer.dv}`,
      },
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-4">
        <Stat
          label={t('طاقة الإطلاق', 'Launch energy')}
          value={<>{fmt(orbit.c3, 2)} <span className="text-[11px]">km²/s²</span></>}
          hint={t('C₃ يحدد الحمولة المتاحة', 'C₃ sets available payload')}
          tone="royal"
        />
        <Stat
          label={t('مدة الرحلة', 'Transfer time')}
          value={<>{fmt(orbit.transferDays, 0)} <span className="text-[11px]">{t('يوم', 'days')}</span></>}
          hint={`${fmt(orbit.transferYears, 2)} ${t('سنة', 'years')}`}
        />
        <Stat
          label={t('دلتا-في المطلوبة', 'Required Δv')}
          value={<>{fmt(orbit.requiredDvMS)} <span className="text-[11px]">m/s</span></>}
          hint={t('الالتقاط والتصحيح والمستوى', 'Capture, correction and plane')}
        />
        <Stat
          label={t('الهامش المتاح', 'Available margin')}
          value={fmtPct(orbit.dvMargin)}
          hint={`${fmt(orbit.availableDvMS)} / ${fmt(orbit.requiredDvMS)} m/s`}
          tone={tone === 'negative' ? 'danger' : tone === 'low' ? 'warn' : 'good'}
        />
      </div>

      <Section
        title={t('نوع المسار', 'Transfer type')}
        description={t(
          'الزمن والطاقة ودلتا-في مثلث مقايضات. المسار السريع يشتري الوقت بالطاقة، والمساعدة الجاذبية تبادل الزمن بالوقود.',
          'Time, energy and Δv form a trade triangle. A fast path buys time with energy; a gravity assist trades time for propellant.',
        )}
        action={<GameBadge />}
      >
        <SpecTable
          label={t('المسار', 'Transfer')}
          columns={[
            { key: 'c3', label: 'C₃' },
            { key: 'time', label: t('الزمن', 'Time') },
            { key: 'dv', label: 'Δv' },
          ]}
          options={transferOptions}
          selectedId={design.choices.transferType}
          onSelect={(id) => setChoice('transferType', id as TransferType)}
        />
      </Section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Section
          title={t('ميزانية دلتا-في', 'Δv budget')}
          description={t('المتاح من الوقود المحمّل يجب أن يغطي كل بنود المهمة مع هامش.', 'Available propellant must cover every mission term with margin.')}
          action={<FormulaBadge label="Δv_req = Σ Δv_terms" />}
        >
          <div>
            {BREAKDOWN.map((term) => {
              const value = orbit.breakdown[term.key];
              if (value <= 0) return null;
              return (
                <div key={term.key} className="border-b border-royal-700 py-1.5 last:border-b-0">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="text-xs text-limestone-300">{t(term.ar, term.en)}</span>
                    <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">{fmt(value)} m/s</span>
                  </div>
                  <Bar ratio={value / total} tone="royal" className="h-1" />
                </div>
              );
            })}
          </div>
          <div className="mt-2 border-t border-royal-700 pt-2">
            <div className="flex items-baseline justify-between gap-3 border-b border-royal-700 py-1.5">
              <span className="text-sm text-limestone-50">{t('المجموع المطلوب', 'Total required')}</span>
              <span className="font-latin text-sm tabular-nums text-ochre-300" dir="ltr">{fmt(orbit.requiredDvMS)} m/s</span>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <span className="text-xs text-limestone-300">{t('المتاح من الوقود', 'Available from propellant')}</span>
              <span className={`font-latin text-xs tabular-nums ${orbit.dvMargin < 0 ? 'text-carnelian-300' : 'text-malachite'}`} dir="ltr">
                {fmt(orbit.availableDvMS)} m/s
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]">
              <span className="text-limestone-400">{t('تغطية المتطلبات', 'Requirement coverage')}</span>
              <span className={`font-latin tabular-nums ${orbit.dvMargin < 0 ? 'text-carnelian-300' : 'text-malachite'}`} dir="ltr">
                {fmtPct(orbit.availableDvMS / Math.max(1, orbit.requiredDvMS))}
              </span>
            </div>
            <Bar
              ratio={orbit.availableDvMS / Math.max(1, orbit.requiredDvMS)}
              tone={orbit.dvMargin < 0 ? 'danger' : orbit.dvMargin < 0.1 ? 'warn' : 'good'}
              className="h-2.5"
            />
          </div>
          {orbit.dvMargin < 0 ? (
            <InlineNote tone="danger" className="mt-3">
              <IconAlert className="me-1 inline h-3.5 w-3.5" />
              {t(
                'الوقود المتاح أقل من المطلوب. زد احتياطي الوقود أو اختر مسارًا أقل استهلاكًا.',
                'Available propellant is below requirement. Add propellant reserve or choose a cheaper trajectory.',
              )}
            </InlineNote>
          ) : (
            <InlineNote tone={orbit.dvMargin < 0.1 ? 'warn' : 'good'} className="mt-3">
              {orbit.dvMargin < 0.1
                ? t('الهامش أقل من 10%؛ التصحيح والمناورات غير المتوقعة قد تستهلكه.', 'The margin is below 10%; corrections and unexpected manoeuvres may consume it.')
                : t('المتاح يغطي المطلوب مع هامش لتصحيح المسار.', 'Available Δv covers the requirement with correction margin.')}
            </InlineNote>
          )}
          <div className="mt-3 border-s-2 border-royal-400 py-1 ps-3 text-xs leading-relaxed text-limestone-300">
            {t(
              `نوع المهمة «${design.missionType.name.ar}» ${design.missionType.requiresCapture ? 'يتطلب التقاطًا مداريًا' : 'لا يتطلب التقاطًا'}${design.missionType.requiresLanding ? ' وهبوطًا' : ''}${design.missionType.requiresSampleReturn ? ' وإرجاع عينة' : ''}.`,
              `The ${design.missionType.name.en} mission ${design.missionType.requiresCapture ? 'requires orbital capture' : 'does not require capture'}${design.missionType.requiresLanding ? ' and landing' : ''}${design.missionType.requiresSampleReturn ? ' and sample return' : ''}.`,
            )}
          </div>
        </Section>

        <div className="space-y-5">
          <Section
            title={t('نافذة الإطلاق', 'Launch window')}
            description={t(
              'النوافذ تقريبية من الدور التزامني. النافذة الأولى عادة أقل عقوبة.',
              'Windows are approximated from the synodic period. The first usually carries the lowest penalty.',
            )}
            action={<IconCalendar className="h-5 w-5 text-royal-300" />}
          >
            <button
              type="button"
              onClick={() => setChoice('launchWindowId', 'auto')}
              aria-pressed={activeWindowId === 'auto'}
              className={`selectable mb-2 flex w-full items-baseline justify-between gap-3 px-3 py-2 text-start ${
                activeWindowId === 'auto' ? 'selectable-on' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm text-limestone-50">{t('تلقائي، أفضل نافذة', 'Automatic, best window')}</span>
                <span className="block text-[11px] text-limestone-400">
                  {t('يختار النافذة الأولى المتاحة', 'Selects the first available window')}
                </span>
              </span>
              {activeWindowId === 'auto' ? (
                <span className="shrink-0 text-[11px] text-ochre-300">{t('مختار', 'Selected')}</span>
              ) : null}
            </button>

            <div>
              {design.windowOptions.map((window, index) => {
                const active = activeWindowId === window.id || (activeWindowId === 'auto' && index === 0);
                return (
                  <button
                    key={window.id}
                    type="button"
                    onClick={() => setChoice('launchWindowId', window.id)}
                    aria-pressed={active}
                    className={`flex w-full items-baseline justify-between gap-3 border-t border-royal-700 px-3 py-2 text-start transition-colors hover:bg-royal-700/20 ${
                      active ? 'bg-royal-700/40' : ''
                    }`}
                    style={active ? { boxShadow: 'inset 0 0 0 1px #E3A92F' } : undefined}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
                        {fmtDate(window.dateISO, design.choices.language)}
                      </span>
                      <span className="block text-[11px] text-limestone-400">{l(window.label)}</span>
                    </span>
                    <span
                      className={`shrink-0 font-latin text-[11px] tabular-nums ${
                        window.penalty > 0.1 ? 'text-amber' : window.penalty > 0 ? 'text-limestone-200' : 'text-malachite'
                      }`}
                      dir="ltr"
                    >
                      {window.penalty === 0 ? t('بلا عقوبة', 'No penalty') : `+${fmtPct(window.penalty, 0)}`}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-limestone-400">
              {t(
                'العقوبة ترفع C3 ودلتا-في المطلوبة. التواريخ توضيحية وليست نافذة إطلاق محسوبة رقميًا.',
                'Penalty raises C3 and required Δv. Dates are illustrative, not numerically optimised launch opportunities.',
              )}
            </p>
          </Section>

          <div className="grid grid-cols-2 gap-x-4">
            <Stat
              label={t('عقوبة النافذة', 'Window penalty')}
              value={fmtPct(orbit.windowPenalty)}
              tone={orbit.windowPenalty > 0.1 ? 'warn' : 'default'}
            />
            <Stat
              label={t('حمولة الصاروخ', 'Launcher payload')}
              value={<>{fmt(design.mass.launcherCapacityKg)} <span className="text-[11px]">kg</span></>}
              tone={design.mass.massMargin < 0 ? 'danger' : 'good'}
            />
            <Stat label={t('الالتقاط', 'Capture')} value={<>{fmt(orbit.breakdown.insertion)} <span className="text-[11px]">m/s</span></>} />
            <Stat label={t('الهبوط', 'Landing')} value={<>{fmt(orbit.breakdown.landing)} <span className="text-[11px]">m/s</span></>} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-royal-700 pt-3">
            <DataSourceBadges sources={['horizons', 'sbdb', 'basics', 'game']} />
            <StatusPill tone={orbit.dvMargin < 0 ? 'danger' : orbit.dvMargin < 0.1 ? 'warn' : 'good'}>
              <IconOrbit className="h-3.5 w-3.5" />
              {orbit.dvMargin < 0 ? t('عجز', 'Deficit') : t('مدار جاهز', 'Orbit ready')}
            </StatusPill>
          </div>
          <SimplifiedNote>
            {t(
              'دلتا-في الالتقاط والهبوط قيم تقريبية. المسارات الحقيقية تحتاج تحسينًا عدديًا وبيانات نافذة دقيقة.',
              'Capture and landing Δv are approximate. Real trajectories need numerical optimisation and precise window data.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
