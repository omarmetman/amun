import { BUSES } from '../data/buses';
import { PROPULSION } from '../data/propulsion';
import type { LocalizedText, Redundancy } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, SpecTable, Stat } from '../components/StepBits';
import {
  IconBus,
  IconLock,
  IconRadiation,
  IconShield,
  IconThruster,
} from '../components/Icons';

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

  const busOptions = BUSES.map((bus) => ({
    id: bus.id,
    title: l(bus.name),
    icon: <IconBus className="h-4 w-4" />,
    note: (
      <>
        {l(bus.description)}
        <span className="mt-0.5 block text-[10px] text-limestone-400">
          {t('موثوقية', 'Reliability')}{' '}
          <span className="font-latin tabular-nums" dir="ltr">{fmtPct(bus.reliability, 1)}</span>
        </span>
      </>
    ),
    cells: {
      dry: `${fmt(bus.dryMassKg)} kg`,
      payload: `${fmt(bus.payloadCapacityKg)} kg`,
      power: `${fmt(bus.basePowerW)} W`,
      storage: `${fmt(bus.storageGb)} GB`,
      cost: fmtMoney(bus.costM),
    },
  }));

  const propulsionOptions = PROPULSION.map((system) => ({
    id: system.id,
    title: l(system.name),
    icon: <IconThruster className="h-4 w-4" />,
    note: l(system.description),
    cells: {
      isp: `${fmt(system.ispS)} s`,
      dry: `${fmt(system.dryMassKg)} kg`,
      power: `${fmt(system.powerW)} W`,
      time: `×${fmt(system.tripTimeFactor, 2)}`,
      cost: fmtMoney(system.costM),
    },
  }));

  const redundancyOptions = REDUNDANCY.map((option) => ({
    id: option.id,
    title: l(option.name),
    icon: <IconShield className="h-4 w-4" />,
    note: l(option.detail),
    cells: { risk: l(option.risk) },
  }));

  return (
    <div className="space-y-5">
      <Section
        title={t('منصة المركبة', 'Spacecraft bus')}
        description={t(
          'المنصة تحدد الكتلة الجافة وسعة الحمولة والطاقة الأساسية والذاكرة. الترقية تفتح أجهزة أكثر لكنها تستهلك ميزانية الصاروخ.',
          'The bus sets dry mass, payload capacity, housekeeping power and storage. Upgrading unlocks more instruments but consumes launcher capacity and budget.',
        )}
        action={<GameBadge />}
      >
        <SpecTable
          label={t('المنصة', 'Bus')}
          columns={[
            { key: 'dry', label: t('جافة', 'Dry') },
            { key: 'payload', label: t('حمولة', 'Payload') },
            { key: 'power', label: t('طاقة', 'Power') },
            { key: 'storage', label: t('ذاكرة', 'Storage') },
            { key: 'cost', label: t('الكلفة', 'Cost') },
          ]}
          options={busOptions}
          selectedId={design.choices.busId}
          onSelect={(id) => {
            const bus = BUSES.find((entry) => entry.id === id);
            if (bus) setChoice('busId', bus.id);
          }}
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-2">
          <DataSourceBadges sources={['ntrs', 'launchApprox', 'game']} />
          <span className="text-[10px] text-limestone-400">
            {t('قيم الفئة تقديرية للعبة.', 'Class values are game estimates.')}
          </span>
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Section
          title={t('نظام الدفع', 'Propulsion system')}
          description={t(
            'Isp يحدد كفاءة استهلاك الوقود. الدفع الأيوني ممتاز كتلةً لكنه يستهلك طاقة كبيرة ويطيل الرحلة.',
            'Isp sets propellant efficiency. Ion propulsion is excellent on mass but draws significant power and lengthens the cruise.',
          )}
          action={<GameBadge />}
        >
          <SpecTable
            label={t('نظام الدفع', 'Propulsion')}
            columns={[
              { key: 'isp', label: 'Isp' },
              { key: 'dry', label: t('كتلة', 'Mass') },
              { key: 'power', label: t('طاقة', 'Power') },
              { key: 'time', label: t('الزمن', 'Time') },
              { key: 'cost', label: t('الكلفة', 'Cost') },
            ]}
            options={propulsionOptions}
            selectedId={design.choices.propulsionId}
            onSelect={(id) => {
              const system = PROPULSION.find((entry) => entry.id === id);
              if (system) setChoice('propulsionId', system.id);
            }}
          />
          <InlineNote tone="royal" className="mt-3">
            {t(
              'الدفع الكيميائي يحسم الرحلة سريعًا. الأيوني يوفّر الكتلة لكنه يحوّل الطاقة إلى وقت.',
              'Chemical propulsion settles the trip quickly. Ion saves mass but turns power into time.',
            )}
          </InlineNote>
        </Section>

        <div className="space-y-5">
          <Section title={t('مستوى التكرار', 'Redundancy')} action={<GameBadge />}>
            <SpecTable
              label={t('مستوى التكرار', 'Redundancy level')}
              columns={[{ key: 'risk', label: t('المخاطرة', 'Risk'), numeric: false }]}
              options={redundancyOptions}
              selectedId={design.choices.redundancy}
              onSelect={(id) => {
                const option = REDUNDANCY.find((entry) => entry.id === id);
                if (option) setChoice('redundancy', option.id);
              }}
            />

            <button
              type="button"
              onClick={() => setChoice('radHard', !design.choices.radHard)}
              aria-pressed={design.choices.radHard}
              className={`mt-3 flex w-full items-start gap-2.5 border border-royal-700 p-2.5 text-start transition-colors hover:bg-royal-700/20 ${
                design.choices.radHard ? 'selectable-on' : ''
              }`}
            >
              <IconRadiation
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  design.choices.radHard ? 'text-ochre-300' : 'text-limestone-400'
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs text-limestone-50">
                    {t('إلكترونيات مقاومة للإشعاع', 'Radiation-hard electronics')}
                  </span>
                  <span className={`text-[10px] ${design.choices.radHard ? 'text-malachite' : 'text-limestone-400'}`}>
                    {design.choices.radHard ? t('مفعّلة', 'Enabled') : t('معطلة', 'Off')}
                  </span>
                </span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-limestone-300">
                  {t(
                    'تضيف كتلة وكلفة، لكنها تخفض أثر العواصف الشمسية وإشعاع المشتري.',
                    'Adds mass and cost, but reduces solar-storm and Jovian radiation effects.',
                  )}
                </span>
              </span>
            </button>
          </Section>

          <Section
            title={t('أثر الاختيار الحالي', 'Current choice impact')}
            action={<StatusPill tone="info">{t('حي', 'Live')}</StatusPill>}
          >
            <div className="grid grid-cols-2 gap-x-4">
              <Stat label={t('الكتلة الجافة', 'Dry mass')} value={<>{fmt(design.mass.dryMassKg)} <span className="text-[10px]">kg</span></>} />
              <Stat label={t('الكتلة الرطبة', 'Wet mass')} value={<>{fmt(design.mass.wetMassKg)} <span className="text-[10px]">kg</span></>} />
              <Stat
                label={t('أدنى هامش طاقة', 'Lowest power margin')}
                value={fmtPct(minPower)}
                tone={minPower < 0 ? 'danger' : minPower < 0.1 ? 'warn' : 'good'}
              />
              <Stat label={t('موثوقية تقريبية', 'Approx. reliability')} value={fmtPct(reliability)} tone="royal" />
            </div>

            <div className="mt-3 border-t border-royal-700 pt-2">
              <div className="mb-1 flex items-baseline justify-between gap-2 text-[10px]">
                <span className="text-limestone-400">{t('استخدام سعة الحمولة', 'Payload capacity used')}</span>
                <span className="font-latin tabular-nums text-limestone-200" dir="ltr">{fmtPct(payloadUse)}</span>
              </div>
              <Bar ratio={payloadUse} tone={payloadUse > 1 ? 'danger' : payloadUse > 0.85 ? 'warn' : 'good'} />
            </div>

            <div className="mt-2">
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('كتلة التكرار', 'Redundancy mass')}</span>
                <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">{fmt(design.redundancyMassKg)} kg</span>
              </div>
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('كتلة الحصانة الإشعاعية', 'Rad-hard mass')}</span>
                <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">{fmt(design.radHardMassKg)} kg</span>
              </div>
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('كلفة التكرار والحصانة', 'Redundancy and hardening cost')}</span>
                <span className="font-latin text-xs tabular-nums text-ochre-300" dir="ltr">
                  {fmtMoney(design.redundancyCostM + design.radHardCostM)}
                </span>
              </div>
            </div>

            {payloadUse > 1 ? (
              <InlineNote tone="danger" className="mt-3">
                <IconLock className="me-1 inline h-3.5 w-3.5" />
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

      <div className="flex flex-col gap-2 border-t border-royal-700 pt-3">
        <SimplifiedNote>
          {t(
            'قيم الكتلة والكلفة والموثوقية مبسطة للعبة. أنظمة الدفع الحقيقية تُختار بعد تحليل مفصل للمهمة والبيئة.',
            'Bus mass, cost and reliability values are game-simplified. Real propulsion choices follow a detailed mission and environment analysis.',
          )}
        </SimplifiedNote>
      </div>
    </div>
  );
}
