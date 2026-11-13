import type {
  LocalizedText,
  SimulationEventDef,
  SimulationEventLog,
  SimulationPhase,
  SimulationPhaseResult,
  SimulationResult,
} from '../data/types';
import { EVENTS } from '../data/events';
import { createRng } from './rng';
import type { DesignResult } from './model';
import { SECONDS_PER_DAY } from './constants';

const t = (ar: string, en: string): LocalizedText => ({ ar, en });
const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));
const round1 = (n: number): number => Math.round(n * 10) / 10;

interface EffectAccumulator {
  scienceLossPct: number;
  scienceBonusPct: number;
  dataLossPct: number;
  rawOverrunM: number;
  linkHoursLost: number;
  safeModeDays: number;
  delayDays: number;
}

const emptyAccumulator = (): EffectAccumulator => ({
  scienceLossPct: 0,
  scienceBonusPct: 0,
  dataLossPct: 0,
  rawOverrunM: 0,
  linkHoursLost: 0,
  safeModeDays: 0,
  delayDays: 0,
});

function meetsRequirements(event: SimulationEventDef, design: DesignResult): boolean {
  const req = event.requires;
  if (!req) return true;
  if (req.targetKind && !req.targetKind.includes(design.target.kind)) return false;
  if (req.missionType && !req.missionType.includes(design.missionType.id)) return false;
  if (req.transferType && !req.transferType.includes(design.choices.transferType)) return false;
  if (req.hasInstrument && !design.choices.instruments.includes(req.hasInstrument)) return false;
  if (req.missingInstrument && design.choices.instruments.includes(req.missingInstrument)) return false;
  return true;
}

/** Probability for one event before the RNG draw. */
export function eventProbability(
  event: SimulationEventDef,
  design: DesignResult,
  difficultyMultiplier: number,
): number {
  const lowPowerMargin =
    Math.min(
      design.power.modes.cruise.margin,
      design.power.modes.science.margin,
      design.power.modes.safe.margin,
    ) < 0.1;
  const lowDvMargin = design.orbit.dvMargin < 0.1;
  const hasRedundancy = design.choices.redundancy !== 'none';
  let probability = event.baseProbability * difficultyMultiplier;

  for (const modifier of event.probabilityModifiers ?? []) {
    const active =
      (modifier.when === 'lowPowerMargin' && lowPowerMargin) ||
      (modifier.when === 'lowDvMargin' && lowDvMargin) ||
      (modifier.when === 'noRadHard' && !design.choices.radHard) ||
      (modifier.when === 'redundancy' && hasRedundancy) ||
      (modifier.when === 'safeModeRisk' &&
        design.power.modes.science.margin < 0.05) ||
      (modifier.when === 'comet' && design.target.kind === 'comet') ||
      (modifier.when === 'gasGiant' && design.target.kind === 'gasGiant');
    if (active) probability *= modifier.multiplier;
  }

  // Instrument-specific mitigation, kept explicit so the link to the chosen
  // payload is visible in the design.
  if (event.id === 'surfaceSurprise') {
    if (design.choices.instruments.includes('gpr')) probability *= 0.55;
    if (design.choices.instruments.includes('nac')) probability *= 0.8;
  }
  if (event.id === 'cometOutgassing' && design.choices.instruments.includes('dust')) {
    probability *= 0.6;
  }
  return clamp(probability, 0, 0.85);
}

function effectLabels(
  event: SimulationEventDef,
  design: DesignResult,
  linkHoursPerDay: number,
): LocalizedText[] {
  const labels: LocalizedText[] = [];
  const e = event.effects;
  if (e.delayDays) {
    labels.push(t(`تأخير ${e.delayDays} يوم`, `+${e.delayDays} day delay`));
  }
  if (e.scienceLossPct) {
    labels.push(t(`خسارة علم ${e.scienceLossPct}%`, `−${e.scienceLossPct}% science`));
  }
  if (e.scienceBonusPct) {
    labels.push(t(`مكافأة علم +${e.scienceBonusPct}%`, `+${e.scienceBonusPct}% science`));
  }
  if (e.dataLossPct) {
    labels.push(t(`فقدان بيانات ${e.dataLossPct}%`, `−${e.dataLossPct}% data`));
  }
  if (e.linkHoursFactor) {
    const lost = linkHoursPerDay * (1 - e.linkHoursFactor);
    labels.push(
      t(
        `ساعات اتصال أقل بنسبة ${Math.round((1 - e.linkHoursFactor) * 100)}% لمدة ${e.linkHoursDays ?? 1} يوم`,
        `Link hours down ${Math.round((1 - e.linkHoursFactor) * 100)}% for ${e.linkHoursDays ?? 1} days`,
      ),
    );
    if (!Number.isFinite(lost)) labels.pop();
  }
  if (e.budgetOverrunPct) {
    const amount = design.cost.subtotalM * e.budgetOverrunPct;
    labels.push(
      t(
        `تكلفة إضافية ≈ ${amount.toFixed(1)} مليون دولار`,
        `≈$${amount.toFixed(1)}M additional cost`,
      ),
    );
  }
  if (e.missionLossRisk) {
    labels.push(
      t(`خطر فقدان المهمة ${Math.round(e.missionLossRisk * 100)}%`, `${Math.round(e.missionLossRisk * 100)}% mission-loss risk`),
    );
  }
  if (e.safeMode) {
    labels.push(t('دخول النمط الآمن', 'Safe-mode entry'));
  }
  return labels;
}

function eventLog(
  event: SimulationEventDef,
  phase: SimulationPhase,
  day: number,
  design: DesignResult,
): SimulationEventLog {
  return {
    id: event.id,
    phase,
    day: Math.max(0, Math.round(day * 10) / 10),
    name: event.name,
    description: event.description,
    severity: event.severity,
    effects: effectLabels(event, design, design.comms.linkHoursPerDay),
    learnKey: event.learnKey,
  };
}

function applyEffects(event: SimulationEventDef, design: DesignResult, acc: EffectAccumulator): void {
  const e = event.effects;
  if (e.delayDays) acc.delayDays += e.delayDays;
  if (e.scienceLossPct) acc.scienceLossPct += e.scienceLossPct;
  if (e.scienceBonusPct) acc.scienceBonusPct += e.scienceBonusPct;
  if (e.dataLossPct) acc.dataLossPct += e.dataLossPct;
  if (e.budgetOverrunPct) acc.rawOverrunM += design.cost.subtotalM * e.budgetOverrunPct;
  if (e.linkHoursFactor && e.linkHoursDays) {
    acc.linkHoursLost += design.comms.linkHoursPerDay * e.linkHoursDays * (1 - e.linkHoursFactor);
  }
  if (e.safeMode) acc.safeModeDays += 4;
}

function makeFailureLog(
  id: string,
  phase: SimulationPhase,
  day: number,
  name: LocalizedText,
  description: LocalizedText,
  effects: LocalizedText[],
  learnKey: string,
): SimulationEventLog {
  return { id, phase, day, name, description, severity: 'error', effects, learnKey };
}

/**
 * Deterministic mission simulation. It consumes the derived design and a seed;
 * the same pair always yields the same phase outcomes, events and science.
 */
export function runSimulation(
  design: DesignResult,
  seed: string,
  createdAt = new Date().toISOString(),
): SimulationResult {
  const rng = createRng(seed);
  const acc = emptyAccumulator();
  const events: SimulationEventLog[] = [];
  const phases: SimulationPhaseResult[] = [];

  const transferDays = Math.max(1, design.orbit.transferDays);
  const opsDays = Math.max(1, design.choices.opsDays);
  const returnDays =
    design.missionType.requiresSampleReturn && design.target.sampleReturnCapable
      ? Math.max(4, transferDays * 0.75)
      : 0;

  let failurePhase: SimulationPhase | null = null;
  let failureReason: LocalizedText | null = null;
  let missionLost = false;
  let totalDays = 1;
  let launchEnd = 1;
  let cruiseEnd = launchEnd + transferDays;
  let arrivalEnd = cruiseEnd + 1;
  let opsEnd = arrivalEnd + opsDays;
  let returnEnd = opsEnd + returnDays;
  let operationsReached = false;

  phases.push({
    phase: 'launch',
    label: t('الإطلاق', 'Launch'),
    startDay: 0,
    endDay: 1,
    outcome: 'nominal',
    note: t('إطلاق ناجح', 'Successful launch'),
  });

  // ---- 1. Launch -------------------------------------------------------
  const launchSuccess = rng.chance(design.launcher.reliability);
  if (!launchSuccess) {
    missionLost = true;
    failurePhase = 'launch';
    failureReason = t(
      `فشل الإطلاق: احتمال نجاح ${design.launcher.name.ar} ${(design.launcher.reliability * 100).toFixed(0)}% في هذه اللقطة.`,
      `Launch failure: ${design.launcher.name.en} has a ${(design.launcher.reliability * 100).toFixed(0)}% success probability in this model.`,
    );
    phases[0].outcome = 'failed';
    phases[0].note = failureReason;
    events.push(
      makeFailureLog(
        'launchFailure',
        'launch',
        0.5,
        t('فشل الإطلاق', 'Launch Failure'),
        failureReason,
        [t('فقدان المهمة قبل الإبحار', 'Mission lost before cruise')],
        'launch',
      ),
    );
  }

  // ---- 2. Cruise -------------------------------------------------------
  if (!missionLost) {
    const cruiseEvents = EVENTS.filter(
      (e) => e.phases.includes('cruise') && meetsRequirements(e, design),
    );
    let cruiseDelay = 0;
    for (const event of cruiseEvents) {
      const p = eventProbability(event, design, design.difficulty.eventMultiplier);
      if (!rng.chance(p)) continue;
      const day = launchEnd + rng.next() * transferDays;
      const log = eventLog(event, 'cruise', day, design);
      events.push(log);
      applyEffects(event, design, acc);
      cruiseDelay += event.effects.delayDays ?? 0;
      if (event.effects.missionLossRisk) {
        const risk = clamp(
          event.effects.missionLossRisk * (design.orbit.dvMargin < 0.05 ? 2 : 1),
          0,
          0.5,
        );
        if (rng.chance(risk)) {
          missionLost = true;
          failurePhase = 'cruise';
          failureReason = t(
            `فقدت المهمة أثناء الإبحار بعد «${event.name.ar}»: المناورة تجاوزت هامش دلتا-في.`,
            `Mission lost during cruise after “${event.name.en}”: the manoeuvre exceeded the Δv margin.`,
          );
          phases.push({
            phase: 'cruise',
            label: t('الإبحار', 'Cruise'),
            startDay: launchEnd,
            endDay: day,
            outcome: 'failed',
            note: failureReason,
          });
          break;
        }
      }
    }
    if (!missionLost) {
      cruiseEnd = launchEnd + transferDays + cruiseDelay;
      phases.push({
        phase: 'cruise',
        label: t('الإبحار', 'Cruise'),
        startDay: launchEnd,
        endDay: cruiseEnd,
        outcome: acc.safeModeDays > 0 ? 'degraded' : 'nominal',
        note:
          acc.safeModeDays > 0
            ? t('اكتمل الإبحار مع دخول النمط الآمن', 'Cruise completed with a safe-mode period')
            : t('اكتمل الإبحار', 'Cruise completed'),
      });
      totalDays = cruiseEnd;
    }
  }

  // ---- 3. Arrival ------------------------------------------------------
  if (!missionLost) {
    let arrivalDelay = 0;
    const arrivalEvents = EVENTS.filter(
      (e) => e.phases.includes('arrival') && meetsRequirements(e, design),
    );
    for (const event of arrivalEvents) {
      const p = eventProbability(event, design, design.difficulty.eventMultiplier);
      if (!rng.chance(p)) continue;
      const day = cruiseEnd + rng.next();
      events.push(eventLog(event, 'arrival', day, design));
      applyEffects(event, design, acc);
      arrivalDelay += event.effects.delayDays ?? 0;
      if (event.effects.missionLossRisk) {
        const risk = clamp(
          event.effects.missionLossRisk * (design.orbit.dvMargin < 0.05 ? 2 : 1),
          0,
          0.5,
        );
        if (rng.chance(risk)) {
          missionLost = true;
          failurePhase = 'arrival';
          failureReason = t(
            `فشل الالتقاط: «${event.name.ar}» أثناء مرحلة الوصول مع هامش دلتا-في ${(design.orbit.dvMargin * 100).toFixed(1)}%.`,
            `Capture failed: “${event.name.en}” during arrival with a ${(design.orbit.dvMargin * 100).toFixed(1)}% Δv margin.`,
          );
          phases.push({
            phase: 'arrival',
            label: t('الوصول والالتقاط', 'Arrival & capture'),
            startDay: cruiseEnd,
            endDay: day,
            outcome: 'failed',
            note: failureReason,
          });
          break;
        }
      }
    }

    if (!missionLost) {
      const redundancyRelief =
        design.choices.redundancy === 'dualFault' ? 0.02 : design.choices.redundancy === 'singleFault' ? 0.01 : 0;
      const radRelief = design.choices.radHard && design.target.kind === 'gasGiant' ? 0.01 : 0;
      const arrivalRisk = clamp(
        0.015 +
          design.target.hazardFactor * 0.03 +
          (design.missionType.complexity - 0.8) * 0.012 +
          Math.max(0, 0.1 - design.orbit.dvMargin) * 1.2 +
          (design.choices.transferType === 'assist' ? 0.015 : design.choices.transferType === 'fast' ? 0.008 : 0) +
          (design.missionType.requiresLanding ? 0.02 : 0) -
          redundancyRelief -
          radRelief,
        0.005,
        0.5,
      );
      if (!rng.chance(1 - arrivalRisk)) {
        missionLost = true;
        failurePhase = 'arrival';
        failureReason = t(
          `فشل الالتقاط/الهبوط. خطر المرحلة ${(arrivalRisk * 100).toFixed(1)}% بسبب بيئة ${design.target.name.ar} وهامش دلتا-في ${(design.orbit.dvMargin * 100).toFixed(1)}%.`,
          `Capture/landing failed. Phase risk was ${(arrivalRisk * 100).toFixed(1)}% due to the ${design.target.name.en} environment and a ${(design.orbit.dvMargin * 100).toFixed(1)}% Δv margin.`,
        );
        events.push(
          makeFailureLog(
            'arrivalFailure',
            'arrival',
            cruiseEnd + 1 + arrivalDelay,
            t('فشل الالتقاط المداري', 'Capture Failure'),
            failureReason,
            [t('فقدان المهمة عند الوصول', 'Mission lost at arrival')],
            'arrival',
          ),
        );
        phases.push({
          phase: 'arrival',
          label: t('الوصول والالتقاط', 'Arrival & capture'),
          startDay: cruiseEnd,
          endDay: cruiseEnd + 1 + arrivalDelay,
          outcome: 'failed',
          note: failureReason,
        });
      } else {
        arrivalEnd = cruiseEnd + 1 + arrivalDelay;
        phases.push({
          phase: 'arrival',
          label: t('الوصول والالتقاط', 'Arrival & capture'),
          startDay: cruiseEnd,
          endDay: arrivalEnd,
          outcome: arrivalDelay > 0 ? 'degraded' : 'nominal',
          note: t(
            `نجح الالتقاط. خطر المرحلة ${(arrivalRisk * 100).toFixed(1)}%.`,
            `Capture succeeded. Phase risk was ${(arrivalRisk * 100).toFixed(1)}%.`,
          ),
        });
        totalDays = arrivalEnd;
        operationsReached = true;
      }
    }
  }

  // ---- 4. Science operations ------------------------------------------
  let scienceAchieved = 0;
  let producedGb = 0;
  let sentGb = 0;
  let lostGb = 0;
  if (!missionLost && operationsReached) {
    const opsEvents = EVENTS.filter(
      (e) => e.phases.includes('operations') && meetsRequirements(e, design),
    );
    let opsDelay = 0;
    for (const event of opsEvents) {
      const p = eventProbability(event, design, design.difficulty.eventMultiplier);
      if (!rng.chance(p)) continue;
      const day = arrivalEnd + rng.next() * opsDays;
      events.push(eventLog(event, 'operations', day, design));
      applyEffects(event, design, acc);
      opsDelay += event.effects.delayDays ?? 0;
    }

    producedGb = design.comms.producedTotalGb * (1 - clamp(acc.dataLossPct, 0, 90) / 100);
    const totalLinkHours = Math.max(
      0,
      design.comms.linkHoursPerDay * opsDays - acc.linkHoursLost,
    );
    const downlinkGb = (design.comms.dataRateKbps * totalLinkHours * 3600) / 8 / 1e6;
    const capacityGb = downlinkGb + design.comms.memoryGb;
    sentGb = Math.min(producedGb, capacityGb);
    lostGb = Math.max(0, producedGb - sentGb);

    const safeModeFraction = clamp(acc.safeModeDays / Math.max(1, opsDays), 0, 1) * 0.5;
    const dataLossFraction = producedGb > 0 ? lostGb / producedGb : 0;
    const totalLossPct = clamp(
      acc.scienceLossPct + dataLossFraction * 50 + safeModeFraction * 100,
      0,
      85,
    );
    scienceAchieved =
      design.science.raw * (1 - totalLossPct / 100) * (1 + acc.scienceBonusPct / 100);

    opsEnd = arrivalEnd + opsDays + opsDelay;
    phases.push({
      phase: 'operations',
      label: t('العمليات العلمية', 'Science operations'),
      startDay: arrivalEnd,
      endDay: opsEnd,
      outcome: lostGb > 0.05 || acc.safeModeDays > 0 ? 'degraded' : 'nominal',
      note: t(
        `علم ${round1(scienceAchieved)} نقطة وإرسال ${sentGb.toFixed(2)} GB من ${producedGb.toFixed(2)} GB.`,
        `${round1(scienceAchieved)} science points and ${sentGb.toFixed(2)} GB sent of ${producedGb.toFixed(2)} GB.`,
      ),
    });
    totalDays = opsEnd;
  }

  // ---- 5. Return leg (sample return only) -----------------------------
  if (!missionLost && operationsReached && returnDays > 0) {
    const returnRisk = clamp(
      0.015 +
        design.target.hazardFactor * 0.02 +
        Math.max(0, 0.1 - design.orbit.dvMargin) * 0.8 -
        (design.choices.redundancy !== 'none' ? 0.005 : 0),
      0.005,
      0.35,
    );
    const returnSuccess = rng.chance(1 - returnRisk);
    returnEnd = opsEnd + returnDays;
    totalDays = returnEnd;
    if (returnSuccess) {
      scienceAchieved *= 1.07; // returned material is worth more than remote data
      phases.push({
        phase: 'return',
        label: t('رحلة الإرجاع', 'Return leg'),
        startDay: opsEnd,
        endDay: returnEnd,
        outcome: 'nominal',
        note: t(
          `عادت الكبسولة بنجاح. خطر الإرجاع ${(returnRisk * 100).toFixed(1)}%.`,
          `The capsule returned safely. Return risk was ${(returnRisk * 100).toFixed(1)}%.`,
        ),
      });
    } else {
      missionLost = true;
      failurePhase = 'return';
      failureReason = t(
        `فُقدت العينة أثناء الإرجاع. خطر المرحلة ${(returnRisk * 100).toFixed(1)}%؛ بقي العلم عن بُعد.`,
        `The sample was lost during return. Phase risk was ${(returnRisk * 100).toFixed(1)}%; remote science remains.`,
      );
      scienceAchieved *= 0.35;
      events.push(
        makeFailureLog(
          'returnFailure',
          'return',
          returnEnd,
          t('فشل إرجاع العينة', 'Sample Return Failure'),
          failureReason,
          [t('خسارة العينة، مع بقاء البيانات عن بُعد', 'Sample lost; remote-sensing data remains')],
          'return',
        ),
      );
      phases.push({
        phase: 'return',
        label: t('رحلة الإرجاع', 'Return leg'),
        startDay: opsEnd,
        endDay: returnEnd,
        outcome: 'failed',
        note: failureReason,
      });
    }
  }

  if (missionLost && failurePhase && !operationsReached) {
    // Remaining phases are explicitly skipped so the UI can explain the stop.
    const labels: Record<SimulationPhase, LocalizedText> = {
      launch: t('الإطلاق', 'Launch'),
      cruise: t('الإبحار', 'Cruise'),
      arrival: t('الوصول والالتقاط', 'Arrival & capture'),
      operations: t('العمليات العلمية', 'Science operations'),
      return: t('رحلة الإرجاع', 'Return leg'),
    };
    (['cruise', 'arrival', 'operations', 'return'] as SimulationPhase[]).forEach((phase) => {
      if (phases.some((p) => p.phase === phase)) return;
      if (phase === 'return' && returnDays === 0) return;
      phases.push({
        phase,
        label: labels[phase],
        startDay: totalDays,
        endDay: totalDays,
        outcome: 'skipped',
        note: t('لم تُنفّذ بسبب فقدان المهمة', 'Not executed because the mission was lost'),
      });
    });
  }

  phases.sort((a, b) => a.startDay - b.startDay);
  events.sort((a, b) => a.day - b.day);

  const reserveUsed = Math.min(acc.rawOverrunM, design.cost.reserveM);
  const budgetOverrun = Math.max(0, acc.rawOverrunM - design.cost.reserveM);
  const eventPenalty = events.reduce(
    (sum, e) => sum + (e.severity === 'error' ? 0.05 : e.severity === 'warning' ? 0.015 : 0),
    0,
  );
  const reliability =
    failurePhase === 'return'
      ? clamp(0.55 - eventPenalty, 0.2, 0.7)
      : missionLost
        ? clamp(0.12 - eventPenalty * 0.2, 0.02, 0.2)
        : clamp(0.92 - eventPenalty, 0.45, 0.99);

  const success = !missionLost && operationsReached;

  return {
    seed,
    runId: `${seed}-${design.target.id}-${Math.round(design.orbit.requiredDvMS)}-${Math.round(design.mass.wetMassKg)}`,
    createdAt,
    phases,
    events,
    success,
    failurePhase,
    failureReason,
    scienceRaw: round1(design.science.raw),
    scienceAchieved: round1(Math.max(0, scienceAchieved)),
    sciencePossible: round1(design.science.raw),
    dataProducedGb: Number(producedGb.toFixed(3)),
    dataSentGb: Number(sentGb.toFixed(3)),
    dataLostGb: Number(lostGb.toFixed(3)),
    budgetOverrunM: Number(budgetOverrun.toFixed(2)),
    reserveUsedM: Number(reserveUsed.toFixed(2)),
    totalDays: Math.round(totalDays * 10) / 10,
    reliability,
    safeModeDays: acc.safeModeDays,
    linkHoursLost: Math.round(acc.linkHoursLost * 10) / 10,
  };
}

/** CSV-friendly phase label helper for the report. */
export const phaseLabelsInOrder: SimulationPhase[] = [
  'launch',
  'cruise',
  'arrival',
  'operations',
  'return',
];

export const linkGb = (kbps: number, hours: number): number =>
  (kbps * hours * 3600) / 8 / 1e6;

export const secondsInDay = SECONDS_PER_DAY;
