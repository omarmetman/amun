import { CalendarDays, Check, Compass, Orbit, Route, TriangleAlert } from 'lucide-react';
import type { TransferType } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtDate, fmtPct, marginTone } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, Stat } from '../components/StepBits';

const TRANSFERS: Array<{
  id: TransferType;
  name: { ar: string; en: string };
  detail: { ar: string; en: string };
  c3: string;
  time: string;
  dv: string;
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

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t('طاقة الإطلاق', 'Launch energy')}
          value={<>{fmt(orbit.c3, 2)} <span className="text-[10px]">km²/s²</span></>}
          hint={t('C₃ يحدد الحمولة المتاحة', 'C₃ sets available payload')}
          tone="royal"
        />
        <Stat
          label={t('مدة الرحلة', 'Transfer time')}
          value={<>{fmt(orbit.transferDays, 0)} <span className="text-[10px]">{t('يوم', 'days')}</span></>}
          hint={`${fmt(orbit.transferYears, 2)} ${t('سنة', 'years')}`}
        />
        <Stat
          label={t('دلتا-في المطلوبة', 'Required Δv')}
          value={<>{fmt(orbit.requiredDvMS)} <span className="text-[10px]">m/s</span></>}
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
        <div className="grid gap-2 md:grid-cols-3">
          {TRANSFERS.map((transfer) => {
            const active = design.choices.transferType === transfer.id;
            return (
              <button
                key={transfer.id}
                type="button"
                onClick={() => setChoice('transferType', transfer.id)}
                aria-pressed={active}
                className={`selectable p-3.5 text-start ${active ? 'selectable-on' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                    {transfer.id === 'assist' ? <Compass className="h-4 w-4" aria-hidden="true" /> : <Route className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  {active ? <Check className="h-4 w-4 text-gold-300" aria-hidden="true" /> : null}
                </div>
                <div className="mt-2 text-sm font-bold text-white">{l(transfer.name)}</div>
                <p className="mt-1 min-h-[3rem] text-[10px] leading-relaxed text-slate-400">{l(transfer.detail)}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="chip !px-1.5 !py-0.5 !text-[9px]">C₃ {transfer.c3}</span>
                  <span className="chip !px-1.5 !py-0.5 !text-[9px]">{t('زمن', 'time')} {transfer.time}</span>
                  <span className="chip !px-1.5 !py-0.5 !text-[9px]">Δv {transfer.dv}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Section
          title={t('ميزانية دلتا-في', 'Δv budget')}
          description={t('المتاح من الوقود المحمّل يجب أن يغطي كل بنود المهمة مع هامش.', 'Available propellant must cover every mission term with margin.')}
          action={<FormulaBadge label="Δv_req = Σ Δv_terms" />}
        >
          <div className="space-y-1.5">
            {BREAKDOWN.map((term) => {
              const value = orbit.breakdown[term.key];
              if (value <= 0) return null;
              return (
                <div key={term.key}>
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">{t(term.ar, term.en)}</span>
                    <span className="num text-[10px] font-bold text-slate-200">{fmt(value)} m/s</span>
                  </div>
                  <Bar ratio={value / total} tone="royal" className="h-1.5" />
                </div>
              );
            })}
            <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-2">
              <span className="text-[11px] font-bold text-white">{t('المجموع المطلوب', 'Total required')}</span>
              <span className="num text-[11px] font-bold text-gold-200">{fmt(orbit.requiredDvMS)} m/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{t('المتاح من الوقود', 'Available from propellant')}</span>
              <span className={`num text-[11px] font-bold ${orbit.dvMargin < 0 ? 'text-danger' : 'text-good'}`}>{fmt(orbit.availableDvMS)} m/s</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">{t('تغطية المتطلبات', 'Requirement coverage')}</span>
              <span className={`num font-bold ${orbit.dvMargin < 0 ? 'text-danger' : 'text-good'}`}>{fmtPct(orbit.availableDvMS / Math.max(1, orbit.requiredDvMS))}</span>
            </div>
            <Bar
              ratio={orbit.availableDvMS / Math.max(1, orbit.requiredDvMS)}
              tone={orbit.dvMargin < 0 ? 'danger' : orbit.dvMargin < 0.1 ? 'warn' : 'good'}
              className="h-3"
            />
          </div>
          {orbit.dvMargin < 0 ? (
            <InlineNote tone="danger" className="mt-3">
              <TriangleAlert className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t('الوقود المتاح أقل من المطلوب. زد احتياطي الوقود أو اختر مسارًا أقل استهلاكًا.', 'Available propellant is below requirement. Add propellant reserve or choose a cheaper trajectory.')}
            </InlineNote>
          ) : (
            <InlineNote tone={orbit.dvMargin < 0.1 ? 'warn' : 'good'} className="mt-3">
              {orbit.dvMargin < 0.1
                ? t('الهامش أقل من 10%؛ التصحيح والمناورات غير المتوقعة قد تستهلكه.', 'The margin is below 10%; corrections and unexpected manoeuvres may consume it.')
                : t('المتاح يغطي المطلوب مع هامش لتصحيح المسار.', 'Available Δv covers the requirement with correction margin.')}
            </InlineNote>
          )}
          <div className="mt-3 rounded-xl border border-white/[0.07] bg-void-900/40 p-3 text-[10px] leading-relaxed text-slate-400">
            {t(
              `نوع المهمة «${design.missionType.name.ar}» ${design.missionType.requiresCapture ? 'يتطلب التقاطًا مداريًا' : 'لا يتطلب التقاطًا'}${design.missionType.requiresLanding ? ' وهبوطًا' : ''}${design.missionType.requiresSampleReturn ? ' وإرجاع عينة' : ''}.`,
              `The ${design.missionType.name.en} mission ${design.missionType.requiresCapture ? 'requires orbital capture' : 'does not require capture'}${design.missionType.requiresLanding ? ' and landing' : ''}${design.missionType.requiresSampleReturn ? ' and sample return' : ''}.`,
            )}
          </div>
        </Section>

        <div className="space-y-4">
          <Section
            title={t('نافذة الإطلاق', 'Launch window')}
            description={t('النوافذ تقريبية من الدور التزامني. النافذة الأولى عادة أقل عقوبة.', 'Windows are approximated from the synodic period. The first usually carries the lowest penalty.')}
            action={<CalendarDays className="h-4 w-4 text-royal-300" aria-hidden="true" />}
          >
            <button
              type="button"
              onClick={() => setChoice('launchWindowId', 'auto')}
              aria-pressed={activeWindowId === 'auto'}
              className={`mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-start transition ${activeWindowId === 'auto' ? 'border-gold-400/60 bg-gold-400/[0.08]' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
            >
              <span>
                <span className="block text-[11px] font-bold text-white">{t('تلقائي — أفضل نافذة', 'Automatic — best window')}</span>
                <span className="block text-[9px] text-slate-500">{t('يختار النافذة الأولى المتاحة', 'Selects the first available window')}</span>
              </span>
              {activeWindowId === 'auto' ? <Check className="h-4 w-4 text-gold-300" aria-hidden="true" /> : null}
            </button>
            <div className="space-y-1.5">
              {design.windowOptions.map((window, index) => {
                const active = activeWindowId === window.id || (activeWindowId === 'auto' && index === 0);
                return (
                  <button
                    key={window.id}
                    type="button"
                    onClick={() => setChoice('launchWindowId', window.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-start transition ${active ? 'border-gold-400/50 bg-gold-400/[0.06]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold text-slate-200">{fmtDate(window.dateISO, design.choices.language)}</span>
                      <span className="block text-[9px] text-slate-500">{l(window.label)}</span>
                    </span>
                    <span className={`shrink-0 text-[9px] font-bold ${window.penalty > 0.1 ? 'text-warn' : window.penalty > 0 ? 'text-slate-300' : 'text-good'}`}>
                      {window.penalty === 0 ? t('بلا عقوبة', 'No penalty') : `+${fmtPct(window.penalty, 0)}`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[9px] leading-relaxed text-slate-600">
              {t('العقوبة ترفع C3 ودلتا-في المطلوبة. التواريخ توضيحية وليست نافذة إطلاق محسوبة رقميًا.', 'Penalty raises C3 and required Δv. Dates are illustrative, not numerically optimised launch opportunities.')}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-2">
            <Stat label={t('عقوبة النافذة', 'Window penalty')} value={fmtPct(orbit.windowPenalty)} tone={orbit.windowPenalty > 0.1 ? 'warn' : 'default'} />
            <Stat label={t('حمولة الصاروخ', 'Launcher payload')} value={<>{fmt(design.mass.launcherCapacityKg)} <span className="text-[10px]">kg</span></>} tone={design.mass.massMargin < 0 ? 'danger' : 'good'} />
            <Stat label={t('الالتقاط', 'Capture')} value={<>{fmt(orbit.breakdown.insertion)} <span className="text-[10px]">m/s</span></>} />
            <Stat label={t('الهبوط', 'Landing')} value={<>{fmt(orbit.breakdown.landing)} <span className="text-[10px]">m/s</span></>} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataSourceBadges sources={['horizons', 'sbdb', 'basics', 'game']} />
            <StatusPill tone={orbit.dvMargin < 0 ? 'danger' : orbit.dvMargin < 0.1 ? 'warn' : 'good'}>
              <Orbit className="h-3 w-3" aria-hidden="true" />
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
