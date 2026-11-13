import { INSTRUMENTS, instrumentAffinity } from '../data/instruments';
import type { TargetKind } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, SpecTable, Stat } from '../components/StepBits';
import { IconMicroscope } from '../components/Icons';

const CATEGORY: Record<string, { ar: string; en: string }> = {
  imaging: { ar: 'تصوير', en: 'Imaging' },
  spectroscopy: { ar: 'تحليل طيفي', en: 'Spectroscopy' },
  geodesy: { ar: 'جيوديسيا', en: 'Geodesy' },
  fields: { ar: 'حقول', en: 'Fields' },
  geophysics: { ar: 'جيوفيزياء', en: 'Geophysics' },
  composition: { ar: 'تركيب', en: 'Composition' },
  sample: { ar: 'عينات', en: 'Sample' },
};

export function Step03Instruments() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const toggleInstrument = useMissionStore((state) => state.toggleInstrument);
  const scienceRatio = design.tier.minScience > 0 ? design.science.raw / design.tier.minScience : 0;
  const payloadRatio = design.bus.payloadCapacityKg > 0 ? design.instrumentMassKg / design.bus.payloadCapacityKg : 0;
  const totalDataRate = design.instruments.reduce((sum, instrument) => sum + instrument.dataRateKbps, 0);
  const instrumentPower = design.instruments.reduce((sum, instrument) => sum + instrument.powerW, 0);

  const instrumentOptions = INSTRUMENTS.map((instrument) => {
    const missionLock = Boolean(
      instrument.requiresSampleReturn &&
        (design.missionType.id !== 'sampleReturn' || !design.target.sampleReturnCapable),
    );
    const landingLock = Boolean(instrument.requiresLanding && !design.target.landingCapable);
    const locked = missionLock || landingLock;
    const affinity = instrumentAffinity(instrument, design.target.id, design.target.kind as TargetKind);
    const potential =
      instrument.scienceBase * affinity * design.missionType.scienceMultiplier * design.science.opsFactor;
    return {
      id: instrument.id,
      title: l(instrument.name),
      icon: <IconMicroscope className="h-4 w-4" />,
      note: (
        <>
          <span className="block text-[10px] text-royal-300">
            {l(CATEGORY[instrument.category] ?? { ar: instrument.category, en: instrument.category })}
          </span>
          {l(instrument.description)}
          <span className="mt-0.5 block font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
            affinity ×{fmt(affinity, 2)}
          </span>
          {locked ? (
            <span className="mt-0.5 block text-[10px] text-amber">
              {missionLock
                ? t('متاح فقط في مهام إرجاع العينات على هدف مؤهل.', 'Only on a sample-return mission to a capable target.')
                : t('يتطلب هدفًا يمكن الهبوط عليه.', 'Requires a landing-capable target.')}
            </span>
          ) : null}
        </>
      ),
      disabled: locked,
      cells: {
        mass: `${fmt(instrument.massKg)} kg`,
        power: `${fmt(instrument.powerW)} W`,
        data: `${fmt(instrument.dataRateKbps)} kbit/s`,
        cost: `$${fmt(instrument.costM)}M`,
        yield: `+${fmt(potential, 1)}`,
      },
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 xl:grid-cols-5">
        <Stat
          label={t('الأجهزة المختارة', 'Instruments selected')}
          value={<>{design.instruments.length} <span className="text-[10px]">/ {INSTRUMENTS.length}</span></>}
          hint={t('واحد على الأقل شرط للمهمة', 'At least one is required')}
        />
        <Stat
          label={t('كتلة الحمولة', 'Payload mass')}
          value={<>{fmt(design.instrumentMassKg)} <span className="text-[10px]">kg</span></>}
          hint={t(`من ${fmt(design.bus.payloadCapacityKg)} كغ متاحة`, `of ${fmt(design.bus.payloadCapacityKg)} kg available`)}
          tone={payloadRatio > 1 ? 'danger' : payloadRatio > 0.85 ? 'warn' : 'good'}
        />
        <Stat
          label={t('العائد العلمي', 'Science output')}
          value={fmt(design.science.raw, 1)}
          hint={t(`المعيار ${design.tier.minScience} نقطة`, `Tier requires ${design.tier.minScience}`)}
          tone={scienceRatio >= 1 ? 'good' : 'warn'}
        />
        <Stat
          label={t('الطاقة العلمية', 'Science power')}
          value={<>{fmt(instrumentPower)} <span className="text-[10px]">W</span></>}
          hint={t('تُضاف إلى حمل العمليات', 'Added to the operations load')}
        />
        <Stat
          label={t('تدفق البيانات', 'Data rate')}
          value={<>{fmt(totalDataRate)} <span className="text-[10px]">kbit/s</span></>}
          hint={t(`إنتاج ≈ ${fmt(design.comms.producedGbPerDay, 2)} GB/يوم`, `≈${fmt(design.comms.producedGbPerDay, 2)} GB/day produced`)}
          tone="royal"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Section
          title={t('حزمة القياسات', 'Measurement suite')}
          description={t(
            'اختر أجهزة تناسب بيئة الهدف. معامل التوافق يضاعف قيمتها العلمية، لكن كل جهاز يضيف كتلة وطاقة وكلفة وبيانات.',
            'Choose instruments matched to the target. Affinity multiplies science value, but every instrument adds mass, power, cost and data.',
          )}
          action={<GameBadge />}
        >
          <SpecTable
            label={t('الجهاز', 'Instrument')}
            columns={[
              { key: 'mass', label: t('كتلة', 'Mass') },
              { key: 'power', label: t('طاقة', 'Power') },
              { key: 'data', label: t('بيانات', 'Data') },
              { key: 'cost', label: t('كلفة', 'Cost') },
              { key: 'yield', label: t('عائد', 'Yield') },
            ]}
            options={instrumentOptions}
            selectedIds={design.choices.instruments}
            onSelect={toggleInstrument}
          />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-2">
            <DataSourceBadges sources={['nasaFact', 'game']} />
            <span className="text-[10px] text-limestone-400">
              {t('القيم الهندسية تقديرية للفئات، والتوافق معامل لعب.', 'Engineering values are class estimates; affinity is a game coefficient.')}
            </span>
          </div>
        </Section>

        <div className="space-y-5">
          <Section
            title={t('الميزان العلمي', 'Science balance')}
            action={
              <StatusPill tone={scienceRatio >= 1 ? 'good' : 'warn'}>
                {scienceRatio >= 1 ? t('يحقق', 'Met') : t('أقل', 'Short')}
              </StatusPill>
            }
          >
            <div className="flex items-end justify-between gap-2">
              <span className="font-latin text-2xl leading-none tabular-nums text-limestone-50" dir="ltr">
                {fmt(design.science.raw, 1)}
              </span>
              <span className="text-[10px] text-limestone-400">
                {t('من', 'of')}{' '}
                <span className="font-latin tabular-nums" dir="ltr">{design.tier.minScience}</span>{' '}
                {t('مطلوبة', 'required')}
              </span>
            </div>
            <Bar
              className="mt-1.5"
              ratio={scienceRatio}
              tone={scienceRatio >= 1 ? 'good' : scienceRatio >= 0.75 ? 'warn' : 'danger'}
            />
            <div className="mt-2">
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('متوسط التوافق', 'Average affinity')}</span>
                <span className={`font-latin text-xs tabular-nums ${design.science.averageAffinity >= 1 ? 'text-malachite' : 'text-amber'}`} dir="ltr">
                  ×{fmt(design.science.averageAffinity, 2)}
                </span>
              </div>
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('عامل مدة العمليات', 'Ops-duration factor')}</span>
                <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
                  ×{fmt(design.science.opsFactor, 2)}
                </span>
              </div>
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('مضاعف نوع المهمة', 'Mission multiplier')}</span>
                <span className="font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
                  ×{fmt(design.missionType.scienceMultiplier, 2)}
                </span>
              </div>
              <div className="table-row">
                <span className="text-xs text-limestone-300">{t('كتلة الحمولة', 'Payload mass')}</span>
                <span className={`font-latin text-xs tabular-nums ${payloadRatio > 1 ? 'text-carnelian-300' : 'text-limestone-100'}`} dir="ltr">
                  {fmtPct(payloadRatio)}
                </span>
              </div>
            </div>
            <Bar
              className="mt-1"
              ratio={payloadRatio}
              tone={payloadRatio > 1 ? 'danger' : payloadRatio > 0.85 ? 'warn' : 'good'}
            />
          </Section>

          <Section title={t('الأجهزة المختارة', 'Selected instruments')}>
            {design.instruments.length === 0 ? (
              <InlineNote tone="danger">
                {t('لا توجد أجهزة. المهمة لن تنتج علمًا ولن تُقبل المحاكاة.', 'No instruments. The mission produces no science and cannot be simulated.')}
              </InlineNote>
            ) : (
              <div>
                {design.instruments.map((instrument) => {
                  const entry = design.science.byInstrument.find((item) => item.id === instrument.id);
                  return (
                    <div
                      key={instrument.id}
                      className="flex items-baseline justify-between gap-2 border-t border-royal-700 py-1.5 first:border-t-0"
                    >
                      <span className="min-w-0 truncate text-xs text-limestone-200">{l(instrument.name)}</span>
                      <span className="shrink-0 font-latin text-xs tabular-nums text-ochre-300" dir="ltr">
                        +{fmt(entry?.value ?? 0, 1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-3 border-s-2 border-royal-500 py-1 ps-3 text-[11px] leading-relaxed text-limestone-300">
              {t(
                'جهاز واحد عالي التوافق أفضل من ثلاثة ضعيفة. ابدأ بالتصوير ثم أضف ما يقيس البيئة نفسها.',
                'One high-affinity instrument beats three weak ones. Start with imaging, then add what measures the environment itself.',
              )}
            </p>
          </Section>

          <SimplifiedNote>
            {t(
              'الكتلة والطاقة ومعدلات البيانات تقديرات لفئات الأجهزة. الاستشعار الحقيقي يعتمد على تصميم الجهاز نفسه.',
              'Mass, power and data rates are class estimates. Real sensing depends on the instrument’s detailed design.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
