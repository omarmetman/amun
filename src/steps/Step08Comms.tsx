import { ANTENNAS, GROUND_STATIONS } from '../data/comms';
import type { AntennaId, GroundStationId } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, SpecTable, Stat } from '../components/StepBits';
import { IconAlert, IconAntenna, IconDatabase } from '../components/Icons';

export function Step08Comms() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setComms = useMissionStore((state) => state.setComms);
  const comms = design.comms;
  const delivered = comms.producedTotalGb > 0 ? comms.sentTotalGb / comms.producedTotalGb : 1;
  const lost = comms.lostTotalGb > 0.05;
  const memoryRatio = comms.producedTotalGb > 0 ? comms.memoryGb / Math.max(comms.producedTotalGb, 0.01) : 0;
  const dsnCost = design.ground.costPerHourM * comms.linkHoursPerDay * design.choices.opsDays;

  const antennaOptions = ANTENNAS.map((antenna) => ({
    id: antenna.id,
    title: l(antenna.name),
    icon: <IconAntenna className="h-4 w-4" />,
    note: l(antenna.description),
    cells: {
      diameter: `${fmt(antenna.diameterM, 1)} m`,
      mass: `${fmt(antenna.massKg)} kg`,
      cost: fmtMoney(antenna.costM),
    },
  }));

  const stationOptions = GROUND_STATIONS.map((station) => ({
    id: station.id,
    title: l(station.name),
    icon: <IconDatabase className="h-4 w-4" />,
    note: l(station.description),
    cells: {
      gain: `×${fmt(station.gainFactor, 1)}`,
      hours: `${fmt(station.linkHoursPerDay)} h`,
      cost: `${fmtMoney(station.costPerHourM, 2)}/h`,
    },
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-4">
        <Stat
          label={t('معدل الإرسال', 'Downlink rate')}
          value={<>{fmt(comms.dataRateKbps, 1)} <span className="text-[11px]">kbit/s</span></>}
          hint={`${fmt(comms.distanceAU, 3)} AU ${t('إلى الأرض', 'to Earth')}`}
          tone={comms.dataRateKbps < 1 ? 'danger' : 'royal'}
        />
        <Stat
          label={t('ساعات الاتصال', 'Link hours')}
          value={<>{fmt(comms.linkHoursPerDay, 1)} <span className="text-[11px]">h/${t('يوم', 'day')}</span></>}
          hint={l(design.ground.name)}
        />
        <Stat
          label={t('البيانات المنتجة', 'Data produced')}
          value={<>{fmt(comms.producedTotalGb, 2)} <span className="text-[11px]">GB</span></>}
          hint={`${fmt(comms.producedGbPerDay, 2)} GB/${t('يوم', 'day')}`}
          tone="gold"
        />
        <Stat
          label={t('البيانات المرسلة', 'Data returned')}
          value={<>{fmt(comms.sentTotalGb, 2)} <span className="text-[11px]">GB</span></>}
          hint={lost ? `${fmt(comms.lostTotalGb, 2)} GB ${t('مفقودة', 'lost')}` : t('كل البيانات تصل', 'All data arrives')}
          tone={lost ? 'warn' : 'good'}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Section
          title={t('هوائي المركبة', 'Spacecraft antenna')}
          description={t(
            'قطر الهوائي يرفع الكسب تربيعيًا، لكنه يضيف كتلة. الهوائي الصغير قد يمنع إرسال بيانات كافية من مسافة بعيدة.',
            'Antenna diameter raises gain quadratically but adds mass. A small dish may fail to return enough data from a distant target.',
          )}
          action={<GameBadge />}
        >
          <SpecTable
            label={t('الهوائي', 'Antenna')}
            columns={[
              { key: 'diameter', label: t('القطر', 'Diameter') },
              { key: 'mass', label: t('الكتلة', 'Mass') },
              { key: 'cost', label: t('الكلفة', 'Cost') },
            ]}
            options={antennaOptions}
            selectedId={design.choices.comms.antennaId}
            onSelect={(id) => setComms({ antennaId: id as AntennaId })}
          />

          <div className="mt-4 border-t border-royal-700 pt-3">
            <div className="mb-1.5 text-xs text-limestone-300">{t('النطاق', 'Band')}</div>
            <div className="grid grid-cols-2 gap-2">
              {(['X', 'Ka'] as const).map((band) => {
                const active = design.choices.comms.band === band;
                return (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setComms({ band })}
                    aria-pressed={active}
                    className={`selectable px-3 py-2 text-start ${active ? 'selectable-on' : ''}`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-latin text-sm text-limestone-50" dir="ltr">{band}</span>
                      <span className={`text-[11px] ${active ? 'text-ochre-300' : 'text-limestone-400'}`}>
                        {active ? t('مختار', 'Selected') : ''}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-limestone-400">
                      {band === 'Ka' ? t('كسب أعلى، كلفة أعلى', 'Higher gain, higher cost') : t('النطاق القياسي', 'The standard band')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-royal-700 pt-3">
            <RangeControl
              id="tx-power"
              label={t('قدرة الإرسال', 'Transmit power')}
              value={design.choices.comms.txPowerW}
              min={10}
              max={200}
              step={5}
              unit="W"
              onChange={(value) => setComms({ txPowerW: value })}
              hint={t('قدرة أعلى ترفع المعدل، لكنها تستهلك طاقة المركبة.', 'More power raises the rate but draws more spacecraft power.')}
            />
          </div>
        </Section>

        <div className="space-y-5">
          <Section
            title={t('محطة الأرض', 'Ground station')}
            action={<IconAntenna className="h-5 w-5 text-royal-300" />}
          >
            <SpecTable
              label={t('المحطة', 'Station')}
              columns={[
                { key: 'gain', label: t('الكسب', 'Gain') },
                { key: 'hours', label: t('الساعات', 'Hours') },
                { key: 'cost', label: t('الكلفة', 'Cost') },
              ]}
              options={stationOptions}
              selectedId={design.choices.comms.groundStation}
              onSelect={(id) => setComms({ groundStation: id as GroundStationId })}
            />
            <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-royal-700 pt-2">
              <span className="text-xs text-limestone-300">{t('كلفة وقت الشبكة', 'Network time cost')}</span>
              <span className="font-latin text-sm tabular-nums text-ochre-300" dir="ltr">{fmtMoney(dsnCost)}</span>
            </div>
          </Section>

          <Section
            title={t('ميزان البيانات', 'Data balance')}
            action={<StatusPill tone={lost ? 'warn' : 'good'}>{lost ? t('فقدان', 'Loss') : t('مكتمل', 'Complete')}</StatusPill>}
          >
            <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
              <span className="font-latin text-lg tabular-nums text-limestone-50" dir="ltr">
                {fmt(comms.sentTotalGb, 2)} <span className="text-[11px] text-limestone-400">GB</span>
              </span>
              <span className="text-[11px] text-limestone-400">
                {t('من', 'of')}{' '}
                <span className="font-latin tabular-nums" dir="ltr">{fmt(comms.producedTotalGb, 2)}</span> GB
              </span>
            </div>
            <Bar ratio={delivered} tone={lost ? 'warn' : 'good'} className="h-2.5" />
            <div className="mt-3 grid grid-cols-2 gap-x-4">
              <Stat label={t('معدل الإنتاج اليومي', 'Produced per day')} value={<>{fmt(comms.producedGbPerDay, 2)} <span className="text-[11px]">GB</span></>} />
              <Stat label={t('معدل الإرسال اليومي', 'Downlink per day')} value={<>{fmt(comms.downlinkGbPerDay, 2)} <span className="text-[11px]">GB</span></>} tone="royal" />
              <Stat label={t('الذاكرة', 'Memory')} value={<>{fmt(comms.memoryGb)} <span className="text-[11px]">GB</span></>} hint={t('منصة المركبة', 'Bus storage')} />
              <Stat label={t('المفقود', 'Lost')} value={<>{fmt(comms.lostTotalGb, 2)} <span className="text-[11px]">GB</span></>} tone={lost ? 'warn' : 'good'} />
            </div>
            <div className="mt-2 flex items-start gap-2">
              <IconDatabase className="mt-1 h-3.5 w-3.5 shrink-0 text-limestone-400" />
              <span className="text-[11px] leading-relaxed text-limestone-400">
                {t('الذاكرة تحتفظ بالبيانات إذا تأخر الاتصال، لكنها محدودة.', 'Memory buffers data when the link is delayed, but it is finite.')}
              </span>
            </div>
            {memoryRatio > 1 ? (
              <InlineNote tone="warn" className="mt-3">
                <IconAlert className="me-1 inline h-3.5 w-3.5" />
                {t('البيانات المنتجة تتجاوز الذاكرة؛ البيانات الزائدة قد تضيع.', 'Produced data exceeds memory; excess may be lost.')}
              </InlineNote>
            ) : null}
            {lost ? (
              <InlineNote tone="warn" className="mt-2">
                {t(
                  `سينتج العلم ${fmt(comms.producedTotalGb, 2)} GB لكن ${fmt(comms.lostTotalGb, 2)} GB لن تصل. ارفع الهوائي أو القدرة أو استخدم محطة 70 م.`,
                  `Science produces ${fmt(comms.producedTotalGb, 2)} GB but ${fmt(comms.lostTotalGb, 2)} GB never arrives. Use a larger antenna, more power or the 70 m station.`,
                )}
              </InlineNote>
            ) : null}
          </Section>

          <Section title={t('ميزانية الوصلة', 'Link budget')} action={<FormulaBadge label="R ∝ P × D² / d²" />}>
            <div className="grid grid-cols-2 gap-x-4">
              <Stat label={t('كسب الوصلة', 'Link gain')} value={`×${fmt(comms.linkBudgetGain, 2)}`} tone="royal" />
              <Stat label={t('قدرة الإرسال DC', 'TX DC power')} value={<>{fmt(comms.txDcPowerW)} <span className="text-[11px]">W</span></>} />
              <Stat label={t('كلفة الاتصالات', 'Comms cost')} value={fmtMoney(comms.commsCostM)} tone="gold" />
              <Stat label={t('كتلة الهوائي', 'Antenna mass')} value={<>{fmt(comms.antennaMassKg)} <span className="text-[11px]">kg</span></>} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-royal-700 pt-2">
              <DataSourceBadges sources={['dsn', 'game']} />
              <span className="text-[11px] text-limestone-400">
                {fmtPct(delivered)} {t('من البيانات تصل', 'of data returned')}
              </span>
            </div>
          </Section>

          <SimplifiedNote>
            {t(
              'هذا نموذج تخطيطي وليس حساب وصلة اتصالات هندسيًا. المطر والارتفاع والتشفير وفقدان الهوائي غير مشمولة.',
              'This is a planning model, not an engineering telecom link budget. Rain, elevation, coding and antenna losses are excluded.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
