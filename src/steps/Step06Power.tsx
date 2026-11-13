import { BatteryCharging, Radiation, Sun, TriangleAlert, Zap } from 'lucide-react';
import { POWER_COMPONENTS } from '../data/power';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, Stat } from '../components/StepBits';

const modeTone = (margin: number): 'danger' | 'warn' | 'good' =>
  margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good';

export function Step06Power() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setPower = useMissionStore((state) => state.setPower);
  const power = design.power;
  const minMargin = Math.min(power.modes.cruise.margin, power.modes.science.margin, power.modes.safe.margin);
  const modes = [
    { key: 'cruise', label: t('الإبحار', 'Cruise'), data: power.modes.cruise },
    { key: 'science', label: t('العمليات العلمية', 'Science ops'), data: power.modes.science },
    { key: 'safe', label: t('النمط الآمن', 'Safe mode'), data: power.modes.safe },
  ];
  const batteryRatio = power.batteryCapacityWh > 0 ? power.batteryRequiredWh / power.batteryCapacityWh : 1;

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t('التدفق الشمسي عند الهدف', 'Solar flux at target')}
          value={<>{fmt(power.solarFluxTargetWM2, 1)} <span className="text-[10px]">W/m²</span></>}
          hint={`${fmt(design.target.sunDistanceAU, 3)} AU ${t('من الشمس', 'from the Sun')}`}
          tone={power.solarFluxTargetWM2 < 100 ? 'warn' : 'gold'}
        />
        <Stat
          label={t('التوليد العلمي', 'Science generation')}
          value={<>{fmt(power.modes.science.generatedW)} <span className="text-[10px]">W</span></>}
          hint={t(`حمل ${fmt(power.modes.science.loadW)} واط`, `${fmt(power.modes.science.loadW)} W load`)}
          tone="royal"
        />
        <Stat
          label={t('أدنى هامش طاقة', 'Lowest power margin')}
          value={fmtPct(minMargin)}
          hint={t('عبر الأنماط الثلاثة', 'Across all three modes')}
          tone={modeTone(minMargin)}
        />
        <Stat
          label={t('كتلة منظومة الطاقة', 'Power system mass')}
          value={<>{fmt(power.powerMassKg)} <span className="text-[10px]">kg</span></>}
          hint={fmtMoney(power.powerCostM)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Section
          title={t('مصادر الطاقة', 'Power sources')}
          description={t(
            'الألواح تعمل بقانون التربيع العكسي، وRTG يناسب المسافات البعيدة، والبطارية تغطي الكسوف. كل كيلوغرام هنا لا يذهب للعلم.',
            'Arrays follow the inverse-square law, RTGs suit distant targets, and the battery covers eclipse. Every kilogram here is unavailable to science.',
          )}
          action={<GameBadge />}
        >
          <div className="space-y-5">
            <RangeControl
              id="solar-area"
              label={t('مساحة الألواح الشمسية', 'Solar array area')}
              value={design.choices.power.solarAreaM2}
              min={0}
              max={60}
              step={0.5}
              unit="m²"
              onChange={(value) => setPower({ solarAreaM2: value })}
              hint={t(
                `≈ ${fmt(power.solarGeneratedTargetW, 0)} واط عند الهدف بعد التدهور، و${fmt(power.solarGeneratedCruiseW, 0)} واط أثناء الإبحار.`,
                `≈${fmt(power.solarGeneratedTargetW, 0)} W at target after degradation, and ${fmt(power.solarGeneratedCruiseW, 0)} W during cruise.`,
              )}
            />
            <RangeControl
              id="rtg-count"
              label={t('وحدات RTG', 'RTG units')}
              value={design.choices.power.rtgCount}
              min={0}
              max={6}
              step={1}
              unit={t('وحدة', 'units')}
              onChange={(value) => setPower({ rtgCount: value })}
              hint={t(
                `≈ ${fmt(power.rtgGeneratedW, 0)} واط بعد التدهور. كل وحدة ≈ 45 كغ و290 واط بداية العمر.`,
                `≈${fmt(power.rtgGeneratedW, 0)} W after decay. Each unit is ≈45 kg and 290 W beginning-of-life.`,
              )}
            />
            <RangeControl
              id="battery"
              label={t('كتلة البطارية', 'Battery mass')}
              value={design.choices.power.batteryKg}
              min={0}
              max={300}
              step={5}
              unit="kg"
              onChange={(value) => setPower({ batteryKg: value })}
              hint={t(
                `سعة ${fmt(power.batteryCapacityWh)} واط-ساعة، والاحتياج ${fmt(power.batteryRequiredWh)} واط-ساعة خلال كسوف ${fmt(power.eclipseHours, 1)} ساعة.`,
                `${fmt(power.batteryCapacityWh)} Wh capacity versus ${fmt(power.batteryRequiredWh)} Wh needed across ${fmt(power.eclipseHours, 1)} h of eclipse.`,
              )}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <FormulaBadge label="S = 1361 / r²" />
            <DataSourceBadges sources={['nasaFact', 'game']} />
          </div>
        </Section>

        <div className="space-y-4">
          <Section title={t('موازنة الأنماط الثلاثة', 'Three-mode balance')} action={<StatusPill tone={modeTone(minMargin)}>{fmtPct(minMargin)}</StatusPill>}>
            <div className="space-y-3">
              {modes.map((mode) => (
                <div key={mode.key}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-300">{mode.label}</span>
                    <span className="font-latin text-[10px] text-slate-500" dir="ltr">
                      {fmt(mode.data.generatedW)} W / {fmt(mode.data.loadW)} W
                    </span>
                  </div>
                  <Bar
                    ratio={mode.data.loadW > 0 ? mode.data.generatedW / mode.data.loadW : 1}
                    tone={modeTone(mode.data.margin)}
                    aria-label={`${mode.label}: ${fmtPct(mode.data.margin)}`}
                  />
                  <div className="mt-0.5 flex items-center justify-between text-[9px]">
                    <span className="text-slate-600">{t('توليد / حمل', 'generation / load')}</span>
                    <span className={`num font-bold ${modeTone(mode.data.margin) === 'danger' ? 'text-danger' : modeTone(mode.data.margin) === 'warn' ? 'text-warn' : 'text-good'}`}>
                      {fmtPct(mode.data.margin)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="rounded-lg border border-white/[0.06] bg-void-900/40 px-2 py-1.5">
                <div className="text-[9px] text-slate-500">{t('شمسي إبحار', 'Solar cruise')}</div>
                <div className="num text-[11px] font-bold text-slate-200">{fmt(power.solarGeneratedCruiseW)} W</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-void-900/40 px-2 py-1.5">
                <div className="text-[9px] text-slate-500">{t('شمسي هدف', 'Solar target')}</div>
                <div className="num text-[11px] font-bold text-slate-200">{fmt(power.solarGeneratedTargetW)} W</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-void-900/40 px-2 py-1.5">
                <div className="text-[9px] text-slate-500">RTG</div>
                <div className="num text-[11px] font-bold text-slate-200">{fmt(power.rtgGeneratedW)} W</div>
              </div>
            </div>
          </Section>

          <Section title={t('البطارية والكسوف', 'Battery & eclipse')} action={<BatteryCharging className="h-4 w-4 text-royal-300" aria-hidden="true" />}>
            <div className="mb-1 flex items-end justify-between gap-2">
              <span className="font-latin text-lg font-extrabold text-white">{fmt(power.batteryCapacityWh)} <span className="text-[10px] text-slate-500">Wh</span></span>
              <span className="text-[10px] text-slate-500">{t('الاحتياج', 'Need')} <span className="num">{fmt(power.batteryRequiredWh)}</span> Wh</span>
            </div>
            <Bar ratio={batteryRatio} tone={batteryRatio > 1 ? 'danger' : batteryRatio > 0.85 ? 'warn' : 'good'} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Stat label={t('فترة المدار', 'Orbit period')} value={<>{fmt(power.orbitPeriodHours, 1)} <span className="text-[10px]">h</span></>} />
              <Stat label={t('الكسوف', 'Eclipse')} value={<>{fmt(power.eclipseHours, 1)} <span className="text-[10px]">h</span></>} />
            </div>
            {batteryRatio > 1 ? (
              <InlineNote tone="danger" className="mt-3">
                <TriangleAlert className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {t('البطارية لا تكفي أثناء الكسوف. أضف كتلة بطارية أو خفّض حمل العمليات.', 'The battery cannot cover eclipse. Add battery mass or reduce the operations load.')}
              </InlineNote>
            ) : (
              <InlineNote tone="good" className="mt-3">
                {t('البطارية تغطي الكسوف الحالي.', 'The battery covers the current eclipse.')}
              </InlineNote>
            )}
          </Section>

          {design.target.sunDistanceAU > 2.5 && design.choices.power.solarAreaM2 > 0 ? (
            <InlineNote tone="warn">
              <Sun className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t(
                'الشمس ضعيفة عند هذا الهدف؛ الألواح تحتاج مساحة كبيرة وقد لا تكون عملية. RTG خيار واقعي.',
                'Sunlight is weak at this target; arrays need a large area and may be impractical. RTGs are the realistic option.',
              )}
            </InlineNote>
          ) : null}
          {design.choices.propulsionId === 'ion' ? (
            <InlineNote tone={power.modes.cruise.margin < 0.2 ? 'warn' : 'royal'}>
              <Zap className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t('الدفع الأيوني يضيف 1200 واط إلى حمل الإبحار.', 'Ion propulsion adds 1200 W to the cruise load.')}
            </InlineNote>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {POWER_COMPONENTS.map((component) => (
                <span key={component.id} className="chip !px-2 !py-0.5 !text-[9px]">
                  {component.id === 'solar' ? <Sun className="h-3 w-3 text-gold-300" aria-hidden="true" /> : component.id === 'rtg' ? <Radiation className="h-3 w-3 text-warn" aria-hidden="true" /> : <BatteryCharging className="h-3 w-3 text-good" aria-hidden="true" />}
                  {l(component.name)}
                </span>
              ))}
            </div>
            <StatusPill tone={minMargin < 0 ? 'danger' : minMargin < 0.1 ? 'warn' : 'good'}>
              {minMargin < 0 ? t('طاقة غير كافية', 'Insufficient') : minMargin < 0.1 ? t('هامش ضيق', 'Tight') : t('متوازن', 'Balanced')}
            </StatusPill>
          </div>
          <SimplifiedNote>
            {t(
              'كفاءة الألواح 28% وتدهور 2.5% سنويًا وRTG 290 واط/وحدة هي قيم تخطيطية مبسطة. التدفق الشمسي 1361 واط/م² قيمة مرجعية.',
              'Array efficiency 28%, 2.5%/yr degradation and 290 W per RTG are simplified planning values. The 1361 W/m² solar constant is a reference value.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
