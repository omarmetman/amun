import { Check, Radiation, Rocket, Satellite, ShieldCheck } from 'lucide-react';
import { BUSES } from '../data/buses';
import { PROPULSION } from '../data/propulsion';
import type { LocalizedText, Redundancy } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, Stat } from '../components/StepBits';

const REDUNDANCY: Array<{
  id: Redundancy;
  name: LocalizedText;
  detail: LocalizedText;
  risk: LocalizedText;
}> = [
  {
    id: 'none',
    name: { ar: 'بلا تكرار', en: 'No redundancy' },
    detail: {
      ar: 'مكونات فردية. أخف وأرخص، لكن أي عطل قد ينهي الوظيفة.',
      en: 'Single-string components. Lightest and cheapest, but one fault can end a function.',
    },
    risk: { ar: 'مخاطرة عالية', en: 'High risk' },
  },
  {
    id: 'singleFault',
    name: { ar: 'احتياطي أحادي', en: 'Single-fault tolerant' },
    detail: {
      ar: 'نسخة احتياطية للأنظمة الحيوية. كتلة وكلفة معتدلة مقابل موثوقية أعلى.',
      en: 'One backup for critical systems. Moderate mass and cost for higher reliability.',
    },
    risk: { ar: 'مخاطرة متوسطة', en: 'Moderate risk' },
  },
  {
    id: 'dualFault',
    name: { ar: 'احتياطي مزدوج', en: 'Dual-fault tolerant' },
    detail: {
      ar: 'مساران احتياطيان للوظائف الحرجة. الأثقل والأغلى، لكنه يقلل خطر فقدان المهمة.',
      en: 'Two backup paths for critical functions. Heaviest and most expensive, but cuts mission-loss risk.',
    },
    risk: { ar: 'مخاطرة منخفضة', en: 'Lower risk' },
  },
];

export function Step02Spacecraft() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const minPower = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );
  const payloadUse =
    design.bus.payloadCapacityKg > 0 ? design.instrumentMassKg / design.bus.payloadCapacityKg : 0;
  const reliability = design.bus.reliability * design.propulsion.reliability * design.launcher.reliability;

  return (
    <div className="space-y-4">
      <Section
        title={t('منصة المركبة', 'Spacecraft bus')}
        description={t(
          'المنصة تحدد الكتلة الجافة وسعة الحمولة والطاقة الأساسية والذاكرة. الترقية تفتح أجهزة أكثر لكنها تستهلك ميزانية الصاروخ.',
          'The bus sets dry mass, payload capacity, housekeeping power and storage. Upgrading unlocks more instruments but consumes launcher capacity and budget.',
        )}
        action={<GameBadge />}
      >
        <div className="grid gap-2 md:grid-cols-3">
          {BUSES.map((bus) => {
            const active = design.choices.busId === bus.id;
            return (
              <button
                key={bus.id}
                type="button"
                onClick={() => setChoice('busId', bus.id)}
                aria-pressed={active}
                className={`selectable p-3.5 text-start ${active ? 'selectable-on' : ''}`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                    <Satellite className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {active ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-void-950">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  ) : null}
                </div>
                <div className="text-sm font-bold text-white">{l(bus.name)}</div>
                <p className="mt-1 min-h-[3.2rem] text-[10px] leading-relaxed text-slate-400">{l(bus.description)}</p>
                <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-slate-400">
                    {t('جافة', 'Dry')}: <span className="num font-bold text-slate-200">{fmt(bus.dryMassKg)}</span> kg
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-slate-400">
                    {t('حمولة', 'Payload')}: <span className="num font-bold text-slate-200">{fmt(bus.payloadCapacityKg)}</span> kg
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-slate-400">
                    <span className="num font-bold text-slate-200">{fmt(bus.basePowerW)}</span> W
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-slate-400">
                    <span className="num font-bold text-slate-200">{fmt(bus.storageGb)}</span> GB
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-gold-300">{fmtMoney(bus.costM)}</span>
                  <span className="text-slate-500">
                    {t('موثوقية', 'Reliability')} <span className="num text-slate-300">{fmtPct(bus.reliability, 1)}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Section
          title={t('نظام الدفع', 'Propulsion system')}
          description={t(
            'Isp يحدد كفاءة استهلاك الوقود. الدفع الأيوني ممتاز كتلةً لكنه يستهلك طاقة كبيرة ويطيل الرحلة.',
            'Isp sets propellant efficiency. Ion propulsion is excellent on mass but draws significant power and lengthens the cruise.',
          )}
          action={<GameBadge />}
        >
          <div className="space-y-2">
            {PROPULSION.map((system) => {
              const active = design.choices.propulsionId === system.id;
              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => setChoice('propulsionId', system.id)}
                  aria-pressed={active}
                  className={`selectable flex w-full items-start gap-3 p-3 text-start ${active ? 'selectable-on' : ''}`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                    <Rocket className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{l(system.name)}</span>
                      <span className="font-latin text-[10px] font-bold text-gold-300" dir="ltr">
                        Isp {fmt(system.ispS)} s
                      </span>
                    </span>
                    <span className="mt-1 block text-[10px] leading-relaxed text-slate-400">{l(system.description)}</span>
                    <span className="mt-2 flex flex-wrap gap-1">
                      <span className="chip !px-2 !py-0.5 !text-[9px]">{fmt(system.dryMassKg)} kg</span>
                      <span className="chip !px-2 !py-0.5 !text-[9px]">{fmt(system.powerW)} W</span>
                      <span className="chip !px-2 !py-0.5 !text-[9px]">{fmtMoney(system.costM)}</span>
                      <span className="chip !px-2 !py-0.5 !text-[9px]">
                        {t('زمن ×', 'time ×')}
                        <span className="num">{fmt(system.tripTimeFactor, 2)}</span>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <div className="space-y-4">
          <Section title={t('مستوى التكرار', 'Redundancy')} action={<GameBadge />}>
            <div className="space-y-2">
              {REDUNDANCY.map((option) => {
                const active = design.choices.redundancy === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setChoice('redundancy', option.id)}
                    aria-pressed={active}
                    className={`selectable flex w-full items-start gap-2.5 p-2.5 text-start ${active ? 'selectable-on' : ''}`}
                  >
                    <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-gold-300' : 'text-slate-500'}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-white">{l(option.name)}</span>
                        <span className={`text-[9px] font-bold ${option.id === 'none' ? 'text-danger' : option.id === 'singleFault' ? 'text-warn' : 'text-good'}`}>
                          {l(option.risk)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">{l(option.detail)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setChoice('radHard', !design.choices.radHard)}
              aria-pressed={design.choices.radHard}
              className={`selectable mt-3 flex w-full items-start gap-2.5 p-2.5 text-start ${design.choices.radHard ? 'selectable-on' : ''}`}
            >
              <Radiation className={`mt-0.5 h-4 w-4 shrink-0 ${design.choices.radHard ? 'text-gold-300' : 'text-slate-500'}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-white">{t('إلكترونيات مقاومة للإشعاع', 'Radiation-hard electronics')}</span>
                  <span className={`text-[9px] font-bold ${design.choices.radHard ? 'text-good' : 'text-slate-500'}`}>
                    {design.choices.radHard ? t('مفعّلة', 'Enabled') : t('معطلة', 'Off')}
                  </span>
                </span>
                <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">
                  {t('تضيف كتلة وكلفة، لكنها تخفض أثر العواصف الشمسية وإشعاع المشتري.', 'Adds mass and cost, but reduces solar-storm and Jovian radiation effects.')}
                </span>
              </span>
            </button>
          </Section>

          <Section title={t('أثر الاختيار الحالي', 'Current choice impact')} action={<StatusPill tone="info">{t('حي', 'Live')}</StatusPill>}>
            <div className="grid grid-cols-2 gap-2">
              <Stat label={t('الكتلة الجافة', 'Dry mass')} value={<>{fmt(design.mass.dryMassKg)} <span className="text-[10px]">kg</span></>} />
              <Stat label={t('الكتلة الرطبة', 'Wet mass')} value={<>{fmt(design.mass.wetMassKg)} <span className="text-[10px]">kg</span></>} />
              <Stat
                label={t('أدنى هامش طاقة', 'Lowest power margin')}
                value={fmtPct(minPower)}
                tone={minPower < 0 ? 'danger' : minPower < 0.1 ? 'warn' : 'good'}
              />
              <Stat label={t('موثوقية تقريبية', 'Approx. reliability')} value={fmtPct(reliability)} tone="royal" />
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="mb-1 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{t('استخدام سعة الحمولة', 'Payload capacity used')}</span>
                  <span className="num text-slate-300">{fmtPct(payloadUse)}</span>
                </div>
                <Bar ratio={payloadUse} tone={payloadUse > 1 ? 'danger' : payloadUse > 0.85 ? 'warn' : 'good'} />
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="chip !px-2 !py-0.5 !text-[10px]">
                  {t('تكرار', 'Redundancy')} <span className="num">{fmt(design.redundancyMassKg)} kg</span>
                </span>
                <span className="chip !px-2 !py-0.5 !text-[10px]">
                  {t('إشعاع', 'Rad-hard')} <span className="num">{fmt(design.radHardMassKg)} kg</span>
                </span>
                <span className="chip !px-2 !py-0.5 !text-[10px]">
                  <span className="num">{fmtMoney(design.redundancyCostM + design.radHardCostM)}</span>
                </span>
              </div>
            </div>
            {payloadUse > 1 ? (
              <InlineNote tone="danger" className="mt-3">
                {t('كتلة الأجهزة تتجاوز سعة هذه المنصة. اختر منصة أكبر أو احذف أجهزة.', 'Instrument mass exceeds this bus’s capacity. Choose a larger bus or remove instruments.')}
              </InlineNote>
            ) : (
              <InlineNote tone="royal" className="mt-3">
                {t('المنصة المتوسطة هي نقطة التوازن الافتراضية. الصغيرة تغري بالميزانية لكنها تخنق الحمولة.', 'The medium bus is the default balance point. The small bus tempts with budget but strangles payload.')}
              </InlineNote>
            )}
          </Section>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <DataSourceBadges sources={['ntrs', 'launchApprox', 'game']} />
        <SimplifiedNote className="max-w-2xl">
          {t(
            'قيم الكتلة والكلفة والموثوقية مبسطة للعبة. أنظمة الدفع الحقيقية تُختار بعد تحليل مفصل للمهمة والبيئة.',
            'Bus mass, cost and reliability values are game-simplified. Real propulsion choices follow a detailed mission and environment analysis.',
          )}
        </SimplifiedNote>
      </div>
    </div>
  );
}
