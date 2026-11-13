import { G0 } from '../engine/rocket';
import { propellantMassFraction } from '../engine/rocket';
import { useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, Stat } from '../components/StepBits';
import { IconAlert, IconCheck, IconFuel, IconWeight } from '../components/Icons';

const showNumber = (value: number, digits = 0): string => (Number.isFinite(value) ? fmt(value, digits) : '∞');

export function Step07Mass() {
  const design = useDesign();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const mass = design.mass;
  const orbit = design.orbit;
  const capacityRatio = mass.launcherCapacityKg > 0 ? mass.wetMassKg / mass.launcherCapacityKg : 1;
  const x = orbit.requiredDvMS / (design.propulsion.ispS * G0);
  const expX = x <= 50 ? Math.exp(x) : Infinity;
  const propFraction = propellantMassFraction(mass.propellantKg, mass.wetMassKg);
  const dryRows = [
    { label: t('المنصة', 'Spacecraft bus'), value: design.bus.dryMassKg },
    { label: t('الأجهزة العلمية', 'Instruments'), value: design.instrumentMassKg },
    { label: t('منظومة الطاقة', 'Power system'), value: design.power.powerMassKg },
    { label: t('الاتصالات', 'Communications'), value: design.commsMassKg },
    { label: t('نظام الدفع', 'Propulsion'), value: design.propulsion.dryMassKg },
    { label: t('التكرار الوقائي', 'Redundancy'), value: design.redundancyMassKg },
    { label: t('الحماية من الإشعاع', 'Radiation hardening'), value: design.radHardMassKg },
    { label: t('الهيكل والهوامش (15%)', 'Structure and margins (15%)'), value: design.structuralMassKg },
  ].filter((row) => row.value > 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-4">
        <Stat
          label={t('الكتلة الرطبة', 'Wet mass')}
          value={<>{fmt(mass.wetMassKg)} <span className="text-[11px]">kg</span></>}
          hint={t(`السعة ${fmt(mass.launcherCapacityKg)} كغ`, `Capacity ${fmt(mass.launcherCapacityKg)} kg`)}
          tone={mass.massMargin < 0 ? 'danger' : mass.massMargin < 0.1 ? 'warn' : 'good'}
        />
        <Stat
          label={t('الوقود', 'Propellant')}
          value={<>{fmt(mass.propellantKg)} <span className="text-[11px]">kg</span></>}
          hint={`${fmtPct(propFraction)} ${t('من الكتلة', 'of wet mass')}`}
          tone="gold"
        />
        <Stat
          label={t('هامش الكتلة', 'Mass margin')}
          value={fmtPct(mass.massMargin)}
          hint={t('النطاق الأمثل 10–30%', 'Ideal band 10–30%')}
          tone={mass.massMargin < 0 ? 'danger' : mass.massMargin < 0.1 ? 'warn' : mass.massMargin > 0.3 ? 'warn' : 'good'}
        />
        <Stat
          label={t('هامش Δv', 'Δv margin')}
          value={fmtPct(orbit.dvMargin)}
          hint={`${fmt(orbit.availableDvMS)} / ${fmt(orbit.requiredDvMS)} m/s`}
          tone={orbit.dvMargin < 0 ? 'danger' : orbit.dvMargin < 0.1 ? 'warn' : 'good'}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          title={t('شلال الكتلة', 'Mass waterfall')}
          description={t(
            'من مكونات المركبة إلى الكتلة الجافة ثم الوقود والخزان والكتلة الرطبة.',
            'From spacecraft components to dry mass, then propellant, tank and wet mass.',
          )}
          action={<GameBadge />}
        >
          <div>
            {dryRows.map((row) => (
              <div key={row.label} className="border-b border-royal-700 py-1.5">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="text-xs text-limestone-300">{row.label}</span>
                  <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
                    {fmt(row.value)} kg
                  </span>
                </div>
                <Bar ratio={row.value / Math.max(mass.wetMassKg, 1)} tone="royal" className="h-1" />
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-royal-700 pt-2">
            <div className="flex items-baseline justify-between gap-3 py-1">
              <span className="text-sm text-limestone-100">{t('الكتلة الجافة الأساسية', 'Base dry mass')}</span>
              <span className="font-latin text-sm tabular-nums text-limestone-50" dir="ltr">{fmt(mass.baseDryMassKg)} kg</span>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-royal-700 py-1">
              <span className="text-xs text-limestone-300">
                {t('خزان الوقود', 'Propellant tank')} ({fmt(mass.tankFraction * 100, 1)}%)
              </span>
              <span className="font-latin text-xs tabular-nums text-limestone-200" dir="ltr">{fmt(mass.tankMassKg)} kg</span>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-royal-700 py-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-ochre-300">
                <IconFuel className="h-3.5 w-3.5" />
                {t('الوقود المحمّل', 'Propellant loaded')}
              </span>
              <span className="font-latin text-xs tabular-nums text-ochre-300" dir="ltr">{fmt(mass.propellantKg)} kg</span>
            </div>
          </div>

          <div className="mt-3 border border-royal-700 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-limestone-50">
                <IconWeight className="h-4 w-4 text-royal-300" />
                {t('الكتلة عند الإطلاق', 'Launch mass')}
              </span>
              <span className="font-latin text-sm tabular-nums text-limestone-50" dir="ltr">{fmt(mass.wetMassKg)} kg</span>
            </div>
            <Bar
              ratio={capacityRatio}
              tone={mass.massMargin < 0 ? 'danger' : mass.massMargin < 0.1 ? 'warn' : 'good'}
              className="h-2.5"
            />
            <div className="mt-1 flex items-center justify-between font-latin text-[11px] tabular-nums text-limestone-400" dir="ltr">
              <span>{fmt(mass.wetMassKg)} kg</span>
              <span>{fmt(mass.launcherCapacityKg)} kg</span>
            </div>
          </div>
        </Section>

        <div className="space-y-5">
          <Section
            title={t('معادلة الصاروخ', 'Rocket equation')}
            action={<FormulaBadge label="Δv = Isp × g₀ × ln(m₀/m_f)" />}
          >
            <div>
              {[
                { label: 'Isp', value: `${fmt(design.propulsion.ispS)} s` },
                { label: t('نسبة الكتلة x', 'Mass ratio exponent x'), value: fmt(x, 3) },
                { label: 'e^x', value: showNumber(expX, 2) },
                { label: t('نسبة الخزان', 'Tank fraction'), value: fmtPct(mass.tankFraction) },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-royal-700 py-2">
                  <span className="text-xs text-limestone-300">{row.label}</span>
                  <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">{row.value}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-xs text-limestone-300">{t('حالة المعادلة', 'Equation status')}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs ${mass.equationClosed ? 'text-malachite' : 'text-carnelian-300'}`}>
                  {mass.equationClosed ? <IconCheck className="h-3.5 w-3.5" /> : <IconAlert className="h-3.5 w-3.5" />}
                  {mass.equationClosed ? t('مغلقة', 'Closed') : t('لا تُغلق', 'Does not close')}
                </span>
              </div>
            </div>
            <div className="mt-2 border-s border-royal-600 py-1 ps-3 text-xs leading-relaxed text-limestone-300">
              {t(
                'الحل المغلق يحسب الوقود مع كتلة الخزان: m_prop = m_dry(e^x − 1) / (1 − k(e^x − 1)).',
                'The closed form solves propellant including tank mass: m_prop = m_dry(e^x − 1) / (1 − k(e^x − 1)).',
              )}
            </div>
          </Section>

          <Section
            title={t('احتياطي الوقود', 'Propellant reserve')}
            action={<StatusPill tone={orbit.dvMargin >= 0.1 ? 'good' : 'warn'}>{fmtPct(orbit.dvMargin)}</StatusPill>}
          >
            <RangeControl
              id="prop-reserve"
              label={t('احتياطي دلتا-في', 'Δv reserve')}
              value={design.choices.propellantReservePercent}
              min={0}
              max={40}
              step={1}
              unit="%"
              onChange={(value) => setChoice('propellantReservePercent', value)}
              hint={t(
                'وقود إضافي لتصحيح المسار والمناورات غير المتوقعة. يزيد الكتلة.',
                'Extra propellant for trajectory correction and unexpected manoeuvres. It adds mass.',
              )}
            />
            <div className="mt-3 grid grid-cols-2 gap-x-4">
              <Stat label={t('المطلوب', 'Required')} value={<>{fmt(orbit.requiredDvMS)} <span className="text-[11px]">m/s</span></>} />
              <Stat
                label={t('المتاح', 'Available')}
                value={<>{fmt(orbit.availableDvMS)} <span className="text-[11px]">m/s</span></>}
                tone={orbit.dvMargin >= 0.1 ? 'good' : 'warn'}
              />
              <Stat label={t('الوقود المرغوب', 'Desired propellant')} value={<>{showNumber(mass.desiredPropellantKg)} <span className="text-[11px]">kg</span></>} />
              <Stat label={t('الوقود المحمّل', 'Loaded propellant')} value={<>{fmt(mass.propellantKg)} <span className="text-[11px]">kg</span></>} tone="gold" />
            </div>
            {mass.propellantLimited ? (
              <InlineNote tone="warn" className="mt-3">
                <IconAlert className="me-1 inline h-3.5 w-3.5" />
                {t(
                  'سعة الصاروخ تقيّد الوقود، لذا هامش Δv أقل من الاحتياطي المطلوب.',
                  'Launcher capacity limits propellant, so the Δv margin is below the requested reserve.',
                )}
              </InlineNote>
            ) : (
              <InlineNote tone={orbit.dvMargin < 0.1 ? 'warn' : 'good'} className="mt-3">
                {orbit.dvMargin < 0.1
                  ? t('هامش أقل من 10% يجعل تصحيح المسار والالتقاط أكثر خطورة.', 'A margin below 10% makes trajectory correction and capture riskier.')
                  : t('الوقود المحمّل يغطي المطلوب مع هامش صحي.', 'Loaded propellant covers the requirement with a healthy margin.')}
              </InlineNote>
            )}
          </Section>

          <SimplifiedNote>
            {t(
              'الحساب يستخدم Isp ثابتًا ولا يمثل تغير الكفاءة مع الارتفاع أو درجة الحرارة. تكلفة الوقود رمزية.',
              'The calculation uses a constant Isp and ignores efficiency changes with altitude or temperature. Propellant cost is symbolic.',
            )}
          </SimplifiedNote>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataSourceBadges sources={['ntrs', 'basics', 'game']} />
            <span className="text-[11px] text-limestone-400">
              {t('الوقود', 'Propellant')}: {fmtMoney(design.cost.propellantCostM)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
