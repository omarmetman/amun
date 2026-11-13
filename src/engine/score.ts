import type {
  DecisionImpact,
  LocalizedText,
  ScoreBreakdown,
  ScoreResult,
} from '../data/types';
import { INSTRUMENTS, instrumentAffinity } from '../data/instruments';
import type { DesignResult, ScoreContext } from './model';
import type { SimulationResult } from '../data/types';

const t = (ar: string, en: string): LocalizedText => ({ ar, en });
const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));
const pct = (n: number): string => `${(n * 100).toFixed(1)}%`;
const num = (n: number, d = 0): string => (Number.isFinite(n) ? n.toFixed(d) : '∞');
const round1 = (n: number): number => Math.round(n * 10) / 10;

/** Ideal engineering margin band. Above 30% is treated as unused/wasted mass. */
export function marginUtility(margin: number): number {
  if (!Number.isFinite(margin)) return 0;
  if (margin < 0) return 0;
  if (margin < 0.1) return 0.2 + 0.8 * (margin / 0.1);
  if (margin <= 0.3) return 1;
  return Math.max(0.3, 1 - (margin - 0.3) * 1.4);
}

export function computeScore(
  design: DesignResult,
  simulation: SimulationResult,
  createdAt = new Date().toISOString(),
): ScoreResult {
  const { tier } = design;
  const tierMetScience = simulation.scienceAchieved >= tier.minScience;
  const tierMetData = simulation.dataSentGb >= tier.minDataGb;
  const isSuccess = simulation.success;

  // 1) Science return — 35 points.
  const scienceTarget = Math.max(1, tier.minScience * 1.25);
  const scienceScore = 35 * clamp(simulation.scienceAchieved / scienceTarget, 0, 1);

  // 2) Budget efficiency — 20 points. Unused reserve is rewarded; overspend hurts.
  const reserveUnusedRatio =
    design.cost.reserveM > 0
      ? clamp(1 - simulation.reserveUsedM / design.cost.reserveM, 0, 1)
      : 1;
  let budgetFactor = 0.6 + 0.4 * reserveUnusedRatio;
  if (simulation.budgetOverrunM > 0) {
    budgetFactor *= clamp(1 - simulation.budgetOverrunM / Math.max(1, design.cost.budgetM) * 8, 0.05, 1);
  }
  const budgetScore = 20 * clamp(budgetFactor, 0, 1);

  // 3) Engineering margins — 20 points.
  const massUtility = marginUtility(design.mass.massMargin);
  const powerUtility = marginUtility(
    Math.min(
      design.power.modes.cruise.margin,
      design.power.modes.science.margin,
      design.power.modes.safe.margin,
    ),
  );
  const dvUtility = marginUtility(design.orbit.dvMargin);
  const marginScore = ((massUtility + powerUtility + dvUtility) / 3) * 20;

  // 4) Reliability & execution — 25 points.
  const executionFactor = isSuccess
    ? 0.75 + 0.25 * clamp(simulation.reliability, 0, 1)
    : simulation.failurePhase === 'return'
      ? 0.35
      : 0.08;
  const reliabilityScore = 25 * executionFactor;

  const breakdown: ScoreBreakdown = {
    science: round1(scienceScore),
    budget: round1(budgetScore),
    margins: round1(marginScore),
    reliability: round1(reliabilityScore),
    total: round1(scienceScore + budgetScore + marginScore + reliabilityScore),
  };

  let outcome: ScoreResult['outcome'];
  if (!isSuccess) {
    const partial = simulation.failurePhase === 'return' || simulation.scienceAchieved >= tier.minScience * 0.4;
    outcome = partial ? 'partial' : 'failure';
  } else {
    outcome = tierMetScience && tierMetData ? 'full' : 'partial';
  }

  const grade: ScoreResult['grade'] =
    breakdown.total >= 90
      ? 'S'
      : breakdown.total >= 80
        ? 'A'
        : breakdown.total >= 70
          ? 'B'
          : breakdown.total >= 60
            ? 'C'
            : breakdown.total >= 50
              ? 'D'
              : 'F';

  // ---------- Causal "why" narrative ----------
  const reasons: LocalizedText[] = [];
  if (simulation.failureReason) reasons.push(simulation.failureReason);

  const massUseRatio =
    design.mass.launcherCapacityKg > 0
      ? design.mass.wetMassKg / design.mass.launcherCapacityKg
      : 1;
  if (design.mass.massMargin < 0.1) {
    reasons.push(
      t(
        `وصلت الكتلة إلى ${pct(massUseRatio)} من سعة الصاروخ (${num(design.mass.wetMassKg)} من ${num(design.mass.launcherCapacityKg)} كغ). الهامش ${pct(design.mass.massMargin)} فقط، لذا لم يبق مجال لوقود إضافي عند الحاجة إلى تصحيح مسار.`,
        `Launch mass reached ${pct(massUseRatio)} of launcher capacity (${num(design.mass.wetMassKg)} of ${num(design.mass.launcherCapacityKg)} kg). With only a ${pct(design.mass.massMargin)} margin there was little room for extra propellant when a trajectory correction was needed.`,
      ),
    );
  } else if (design.mass.massMargin > 0.3) {
    reasons.push(
      t(
        `هامش الكتلة ${pct(design.mass.massMargin)} أكبر من النطاق الأمثل (10–30%)؛ تحمل المركبة كتلة كانت يمكن استثمارها في وقود أو أجهزة بدلًا من تركها كوزن ميت.`,
        `The ${pct(design.mass.massMargin)} mass margin is above the 10–30% sweet spot; the vehicle carries mass that could have been traded for propellant or instruments instead of acting as dead weight.`,
      ),
    );
  }

  const minPowerMargin = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );
  if (minPowerMargin < 0.1) {
    reasons.push(
      t(
        `أدنى هامش طاقة كان ${pct(minPowerMargin)} في نمط العمليات. مع أي حدث إضافي (عاصفة شمسية أو تعارض DSN) يقترب النظام من النمط الآمن، فيتوقف العلم وتُفقد بيانات.`,
        `The lowest power margin was ${pct(minPowerMargin)} in the operations mode. Any additional event (solar storm or DSN conflict) pushes the system toward safe mode, pausing science and losing data.`,
      ),
    );
  }

  if (design.orbit.dvMargin < 0.1) {
    reasons.push(
      t(
        `هامش دلتا-في ${pct(design.orbit.dvMargin)} فقط: المتاح ${num(design.orbit.availableDvMS)} م/ث مقابل مطلوب ${num(design.orbit.requiredDvMS)} م/ث. هذا رفع خطر الالتقاط وقلّل قدرة المركبة على تعويض أي شذوذ في مناورة.`,
        `The Δv margin was only ${pct(design.orbit.dvMargin)}: ${num(design.orbit.availableDvMS)} m/s available versus ${num(design.orbit.requiredDvMS)} m/s required. That increased capture risk and left little ability to recover from a manoeuvre anomaly.`,
      ),
    );
  }

  if (simulation.dataLostGb > 0.05) {
    reasons.push(
      t(
        `أنتجت الأجهزة ${simulation.dataProducedGb.toFixed(2)} GB لكن ${simulation.dataLostGb.toFixed(2)} GB لم تُرسل بسبب سعة الاتصال/الذاكرة. البيانات المفقودة خفّضت العائد العلمي لأن جزءًا من القياسات لم يصل إلى الأرض.`,
        `The instruments produced ${simulation.dataProducedGb.toFixed(2)} GB but ${simulation.dataLostGb.toFixed(2)} GB never reached Earth due to link/memory limits. The lost data reduced science return because some measurements never arrived.`,
      ),
    );
  }

  if (simulation.reserveUsedM > 0) {
    reasons.push(
      t(
        `استهلكت أحداث تضخم التكلفة ${simulation.reserveUsedM.toFixed(1)} مليون دولار من احتياطي ${design.cost.reserveM.toFixed(1)} مليون. ${simulation.budgetOverrunM > 0 ? `تجاوزت المهمة الميزانية بـ ${simulation.budgetOverrunM.toFixed(1)} مليون دولار.` : 'بقي الاحتياطي قادرًا على استيعاب الصدمة، لكن كفاءة الميزانية انخفضت.'}`,
        `Cost-overrun events consumed $${simulation.reserveUsedM.toFixed(1)}M of a $${design.cost.reserveM.toFixed(1)}M reserve. ${simulation.budgetOverrunM > 0 ? `The mission exceeded its budget by $${simulation.budgetOverrunM.toFixed(1)}M.` : 'The reserve absorbed the shock, but budget efficiency fell.'}`,
      ),
    );
  }

  if (tierMetScience && tierMetData) {
    reasons.push(
      t(
        `تحقق معيار «${tier.name.ar}»: علم ${num(simulation.scienceAchieved, 1)} من ${tier.minScience} نقطة، وبيانات ${simulation.dataSentGb.toFixed(2)} من ${tier.minDataGb} GB.`,
        `The “${tier.name.en}” tier was met: ${num(simulation.scienceAchieved, 1)} of ${tier.minScience} science points and ${simulation.dataSentGb.toFixed(2)} of ${tier.minDataGb} GB returned.`,
      ),
    );
  } else if (isSuccess) {
    reasons.push(
      t(
        `أكملت المهمة لكنها لم تحقق معيار «${tier.name.ar}»: ${tierMetScience ? 'العلم كافٍ' : `العلم ${num(simulation.scienceAchieved, 1)}/${tier.minScience}`} و${tierMetData ? 'البيانات كافية' : `البيانات ${simulation.dataSentGb.toFixed(2)}/${tier.minDataGb} GB`}.`,
        `The mission completed but missed the “${tier.name.en}” tier: ${tierMetScience ? 'science was sufficient' : `science ${num(simulation.scienceAchieved, 1)}/${tier.minScience}`} and ${tierMetData ? 'data was sufficient' : `data ${simulation.dataSentGb.toFixed(2)}/${tier.minDataGb} GB`}.`,
      ),
    );
  }

  // ---------- Decision impacts ----------
  const positives: Array<{ weight: number; item: DecisionImpact }> = [];
  const negatives: Array<{ weight: number; item: DecisionImpact }> = [];

  if (tierMetScience) {
    positives.push({
      weight: 10,
      item: {
        id: 'science-met',
        positive: true,
        step: 3,
        title: t('حزمة أجهزة تحقق الهدف العلمي', 'Instrument suite met the science target'),
        detail: t(
          `أنتجت ${num(simulation.scienceAchieved, 1)} نقطة علم مقابل ${tier.minScience} مطلوبة. متوسط التوافق ${design.science.averageAffinity.toFixed(2)}.`,
          `${num(simulation.scienceAchieved, 1)} science points versus a ${tier.minScience} requirement. Average affinity was ${design.science.averageAffinity.toFixed(2)}.`,
        ),
      },
    });
  }
  if (tierMetData) {
    positives.push({
      weight: 9,
      item: {
        id: 'data-met',
        positive: true,
        step: 8,
        title: t('اتصالات كافية لإعادة البيانات', 'Communications returned the required data'),
        detail: t(
          `أُرسل ${simulation.dataSentGb.toFixed(2)} GB من ${simulation.dataProducedGb.toFixed(2)} GB بمعدل ${num(design.comms.dataRateKbps, 1)} كيلوبت/ث.`,
          `${simulation.dataSentGb.toFixed(2)} GB of ${simulation.dataProducedGb.toFixed(2)} GB was returned at ${num(design.comms.dataRateKbps, 1)} kbit/s.`,
        ),
      },
    });
  }
  if (design.mass.massMargin >= 0.1 && design.mass.massMargin <= 0.3) {
    positives.push({
      weight: 8,
      item: {
        id: 'mass-margin',
        positive: true,
        step: 7,
        title: t('هامش كتلة في النطاق الأمثل', 'Mass margin inside the ideal band'),
        detail: t(
          `الهامش ${pct(design.mass.massMargin)} ضمن 10–30%، ما يوازن بين القدرة على التصحيح وهدر الكتلة.`,
          `A ${pct(design.mass.massMargin)} margin sits in the 10–30% band, balancing correction capability against wasted mass.`,
        ),
      },
    });
  }
  if (minPowerMargin >= 0.1 && minPowerMargin <= 0.3) {
    positives.push({
      weight: 7,
      item: {
        id: 'power-margin',
        positive: true,
        step: 6,
        title: t('طاقة متوازنة في الأنماط الثلاثة', 'Balanced power in all three modes'),
        detail: t(
          `أدنى هامش طاقة ${pct(minPowerMargin)}؛ يكفي للأحداث دون ألواح زائدة تستهلك الكتلة.`,
          `The lowest power margin is ${pct(minPowerMargin)}; enough for events without oversized arrays that consume mass.`,
        ),
      },
    });
  }
  if (design.orbit.dvMargin >= 0.1 && design.orbit.dvMargin <= 0.3) {
    positives.push({
      weight: 7,
      item: {
        id: 'dv-margin',
        positive: true,
        step: 9,
        title: t('هامش دلتا-في صحي', 'Healthy Δv margin'),
        detail: t(
          `هامش ${pct(design.orbit.dvMargin)} يغطي تصحيح المسار والالتقاط مع بقاء الوقود ضمن حدود الكتلة.`,
          `A ${pct(design.orbit.dvMargin)} margin covers trajectory correction and capture while keeping propellant within the mass limit.`,
        ),
      },
    });
  }
  if (simulation.success) {
    positives.push({
      weight: 12,
      item: {
        id: 'mission-success',
        positive: true,
        step: 10,
        title: t('تنفيذ المهمة حتى نهايتها', 'Mission executed end to end'),
        detail: t(
          `نجحت جميع المراحل حتى العمليات العلمية${simulation.failurePhase === 'return' ? ' (فشل الإرجاع فقط)' : ''}.`,
          `All phases through science operations succeeded${simulation.failurePhase === 'return' ? ' (only the return leg failed)' : ''}.`,
        ),
      },
    });
  }
  if (simulation.budgetOverrunM === 0 && simulation.reserveUsedM <= design.cost.reserveM * 0.5) {
    positives.push({
      weight: 6,
      item: {
        id: 'reserve-health',
        positive: true,
        step: 5,
        title: t('احتياطي ميزانية فعّال', 'Effective budget reserve'),
        detail: t(
          `استُخدم ${simulation.reserveUsedM.toFixed(1)} فقط من ${design.cost.reserveM.toFixed(1)} مليون دولار، ما يرفع كفاءة الميزانية.`,
          `Only $${simulation.reserveUsedM.toFixed(1)}M of the $${design.cost.reserveM.toFixed(1)}M reserve was used, improving budget efficiency.`,
        ),
      },
    });
  }
  if (design.choices.redundancy !== 'none' && design.target.hazardFactor >= 0.35) {
    positives.push({
      weight: 5,
      item: {
        id: 'redundancy',
        positive: true,
        step: 2,
        title: t('تكرار الأنظمة في بيئة خطرة', 'Redundancy in a hazardous environment'),
        detail: t(
          `خفض التكرار احتمال أعطال الأجهزة والملاحة عند هدف بخطورة ${design.target.hazardFactor.toFixed(2)}.`,
          `Redundancy reduced instrument/navigation failure probability at a target with hazard ${design.target.hazardFactor.toFixed(2)}.`,
        ),
      },
    });
  }

  if (!isSuccess) {
    negatives.push({
      weight: 20,
      item: {
        id: 'mission-failure',
        positive: false,
        step: simulation.failurePhase === 'launch' ? 4 : simulation.failurePhase === 'return' ? 7 : 9,
        title: t('فقدان المهمة', 'Mission lost'),
        detail:
          simulation.failureReason ??
          t('لم تكتمل المهمة، لذا فقدت النتيجة العلمية والتنفيذية.', 'The mission did not complete, costing science and execution score.'),
      },
    });
  }
  if (design.mass.massMargin < 0.1) {
    negatives.push({
      weight: 14,
      item: {
        id: 'mass-tight',
        positive: false,
        step: 7,
        title: t('هامش كتلة ضيق', 'Tight mass margin'),
        detail: t(
          `الهامش ${pct(design.mass.massMargin)}؛ الكتلة ${num(design.mass.wetMassKg)} كغ من أصل ${num(design.mass.launcherCapacityKg)} كغ متاحة. لا مساحة لوقود احتياطي أو نمو.`,
          `Margin ${pct(design.mass.massMargin)}; ${num(design.mass.wetMassKg)} kg of ${num(design.mass.launcherCapacityKg)} kg available. No room for reserve propellant or growth.`,
        ),
      },
    });
  }
  if (design.mass.massMargin > 0.3) {
    negatives.push({
      weight: 8,
      item: {
        id: 'mass-waste',
        positive: false,
        step: 7,
        title: t('كتلة غير مستثمرة', 'Unused mass'),
        detail: t(
          `هامش ${pct(design.mass.massMargin)} فوق 30% يعني كتلة كان يمكن تحويلها إلى وقود أو علم.`,
          `A ${pct(design.mass.massMargin)} margin above 30% represents mass that could have become propellant or science.`,
        ),
      },
    });
  }
  if (minPowerMargin < 0.1) {
    negatives.push({
      weight: 13,
      item: {
        id: 'power-tight',
        positive: false,
        step: 6,
        title: t('طاقة بلا هامش كافٍ', 'Insufficient power margin'),
        detail: t(
          `أدنى هامش ${pct(minPowerMargin)}. أي حدث إضافي يدفع المركبة إلى النمط الآمن ويوقف العلم.`,
          `Lowest margin ${pct(minPowerMargin)}. Any additional event pushes the spacecraft into safe mode and pauses science.`,
        ),
      },
    });
  }
  if (design.orbit.dvMargin < 0.1) {
    negatives.push({
      weight: 13,
      item: {
        id: 'dv-tight',
        positive: false,
        step: 9,
        title: t('هامش دلتا-في ضيق', 'Tight Δv margin'),
        detail: t(
          `المتاح ${num(design.orbit.availableDvMS)} م/ث مقابل مطلوب ${num(design.orbit.requiredDvMS)} م/ث؛ الهامش ${pct(design.orbit.dvMargin)} فقط.`,
          `${num(design.orbit.availableDvMS)} m/s available versus ${num(design.orbit.requiredDvMS)} m/s required; margin only ${pct(design.orbit.dvMargin)}.`,
        ),
      },
    });
  }
  if (simulation.dataLostGb > 0.05) {
    negatives.push({
      weight: 10,
      item: {
        id: 'data-loss',
        positive: false,
        step: 8,
        title: t('بيانات مفقودة', 'Data lost'),
        detail: t(
          `ضاع ${simulation.dataLostGb.toFixed(2)} GB. معدل الإرسال ${num(design.comms.dataRateKbps, 1)} كيلوبت/ث مع ${design.comms.linkHoursPerDay.toFixed(1)} ساعة اتصال يوميًا.`,
          `${simulation.dataLostGb.toFixed(2)} GB was lost. Downlink ${num(design.comms.dataRateKbps, 1)} kbit/s with ${design.comms.linkHoursPerDay.toFixed(1)} link hours/day.`,
        ),
      },
    });
  }
  if (simulation.budgetOverrunM > 0) {
    negatives.push({
      weight: 11,
      item: {
        id: 'budget-overrun',
        positive: false,
        step: 5,
        title: t('تجاوز الميزانية', 'Budget overrun'),
        detail: t(
          `تجاوزت التكلفة الميزانية بـ ${simulation.budgetOverrunM.toFixed(1)} مليون دولار بعد استهلاك الاحتياطي.`,
          `Costs exceeded the budget by $${simulation.budgetOverrunM.toFixed(1)}M after the reserve was exhausted.`,
        ),
      },
    });
  }
  if (design.science.averageAffinity < 0.85) {
    negatives.push({
      weight: 9,
      item: {
        id: 'affinity-low',
        positive: false,
        step: 3,
        title: t('توافق ضعيف مع الهدف', 'Weak target affinity'),
        detail: t(
          `متوسط معامل التوافق ${design.science.averageAffinity.toFixed(2)}؛ الأجهزة لا تستفيد من بيئة ${design.target.name.ar}.`,
          `Average affinity ${design.science.averageAffinity.toFixed(2)}; the instruments do not exploit the ${design.target.name.en} environment.`,
        ),
      },
    });
  }
  if (!tierMetScience && isSuccess) {
    negatives.push({
      weight: 8,
      item: {
        id: 'science-short',
        positive: false,
        step: 3,
        title: t('العلم أقل من معيار النجاح', 'Science below success tier'),
        detail: t(
          `تحقق ${num(simulation.scienceAchieved, 1)} نقطة من ${tier.minScience} مطلوبة لـ«${tier.name.ar}».`,
          `${num(simulation.scienceAchieved, 1)} points versus ${tier.minScience} required for “${tier.name.en}”.`,
        ),
      },
    });
  }
  if (design.choices.reservePercent < 10) {
    negatives.push({
      weight: 5,
      item: {
        id: 'reserve-low',
        positive: false,
        step: 5,
        title: t('احتياطي ميزانية منخفض', 'Low budget reserve'),
        detail: t(
          `احتياطي ${design.choices.reservePercent}% فقط؛ أي تضخم تكلفة قد يخرق الميزانية.`,
          `Only a ${design.choices.reservePercent}% reserve; any cost growth can break the budget.`,
        ),
      },
    });
  }
  if (design.cost.launchCostM / Math.max(1, design.cost.totalM) > 0.45) {
    negatives.push({
      weight: 6,
      item: {
        id: 'launch-cost',
        positive: false,
        step: 4,
        title: t('الإطلاق يستهلك معظم الميزانية', 'Launch dominates the budget'),
        detail: t(
          `كلفة الإطلاق ${design.cost.launchCostM.toFixed(0)} مليون = ${pct(design.cost.launchCostM / design.cost.totalM)} من إجمالي التكلفة.`,
          `Launch costs $${design.cost.launchCostM.toFixed(0)}M = ${pct(design.cost.launchCostM / design.cost.totalM)} of the total.`,
        ),
      },
    });
  }
  if (design.target.kind === 'gasGiant' && !design.choices.radHard) {
    negatives.push({
      weight: 6,
      item: {
        id: 'no-radhard',
        positive: false,
        step: 2,
        title: t('لا حماية من الإشعاع عند المشتري', 'No radiation hardening at Jupiter'),
        detail: t(
          'بيئة المشتري الإشعاعية قاسية؛ غياب الإلكترونيات المقاومة يرفع احتمال الأعطال بشكل ملموس.',
          'Jupiter’s radiation environment is severe; without rad-hard electronics the failure probability rises noticeably.',
        ),
      },
    });
  }

  const topPositives = positives.sort((a, b) => b.weight - a.weight).slice(0, 3).map((p) => p.item);
  const topNegatives = negatives.sort((a, b) => b.weight - a.weight).slice(0, 3).map((n) => n.item);

  // ---------- Concrete improvements ----------
  const improvements: LocalizedText[] = [];
  if (design.mass.massMargin < 0.1) {
    const targetMass = design.mass.launcherCapacityKg * 0.85;
    improvements.push(
      t(
        `خفّض كتلة الإطلاق بمقدار ${num(Math.max(0, design.mass.wetMassKg - targetMass))} كغ (إلى ${num(targetMass)} كغ) أو استخدم صاروخًا أكبر. هذا يعيد هامش الكتلة إلى 15% تقريبًا.`,
        `Cut launch mass by ${num(Math.max(0, design.mass.wetMassKg - targetMass))} kg (to ${num(targetMass)} kg) or use a larger launcher, restoring a ~15% mass margin.`,
      ),
    );
  } else if (design.mass.massMargin > 0.3) {
    improvements.push(
      t(
        `لديك ${num(design.mass.wetMassKg * (design.mass.massMargin - 0.2))} كغ كتلة زائدة فوق هامش 20%. استثمر جزءًا منها في وقود احتياطي أو جهاز علمي إضافي بدلًا من تركه وزنًا ميتًا.`,
        `You carry ${num(design.mass.wetMassKg * (design.mass.massMargin - 0.2))} kg above a 20% margin. Spend some on reserve propellant or an extra instrument instead of dead weight.`,
      ),
    );
  }
  if (minPowerMargin < 0.1) {
    const scienceLoad = design.power.modes.science.loadW;
    const needed = Math.max(0, scienceLoad * 1.15 - design.power.modes.science.generatedW);
    const flux = Math.max(1, design.power.solarFluxTargetWM2);
    const areaNeeded = needed / (flux * 0.28 * 0.9);
    improvements.push(
      t(
        `أضف ≈ ${areaNeeded.toFixed(1)} م² ألواح شمسية أو ${Math.max(1, Math.ceil(needed / design.power.rtgGeneratedW || 1))} وحدة RTG لتغطية عجز ${num(needed)} واط والوصول بهامش 15%.`,
        `Add ≈${areaNeeded.toFixed(1)} m² of arrays or ${Math.max(1, Math.ceil(needed / Math.max(1, design.power.rtgGeneratedW)))} RTG unit(s) to cover ${num(needed)} W and reach a 15% margin.`,
      ),
    );
  }
  if (design.orbit.dvMargin < 0.1) {
    const neededProp = design.mass.propellantKg * (1.15 / Math.max(0.01, 1 + design.orbit.dvMargin) - 1);
    improvements.push(
      t(
        `ارفع احتياطي الوقود إلى 20% (أو أضف ≈ ${num(Math.max(0, neededProp))} كغ وقود) لرفع هامش دلتا-في من ${pct(design.orbit.dvMargin)} إلى 20% تقريبًا، أو قلّل دلتا-في المطلوب بمقدار ${num(Math.max(0, design.orbit.requiredDvMS * 0.05))} م/ث.`,
        `Raise the propellant reserve to 20% (≈${num(Math.max(0, neededProp))} kg more propellant) to lift the Δv margin from ${pct(design.orbit.dvMargin)} to ~20%, or cut required Δv by ${num(Math.max(0, design.orbit.requiredDvMS * 0.05))} m/s.`,
      ),
    );
  }
  if (simulation.dataLostGb > 0.05) {
    const needed = simulation.dataLostGb;
    improvements.push(
      t(
        `لتقليل ضياع ${needed.toFixed(2)} GB: ارفع قدرة الإرسال اليومية بمقدار ${(needed / Math.max(1, design.choices.opsDays)).toFixed(2)} GB/يوم، عبر هوائي أكبر أو نطاق Ka أو محطة 70 م، أو زد الذاكرة.`,
        `To recover the ${needed.toFixed(2)} GB lost: add ${(needed / Math.max(1, design.choices.opsDays)).toFixed(2)} GB/day of downlink via a larger antenna, Ka band or 70 m station, or increase memory.`,
      ),
    );
  }
  improvements.push(
    t(
      `أعد تشغيل المحاكاة بنفس البذرة (${design.choices.seed}) بعد التعديل لمقارنة النتيجة دون تغيير سلسلة الأحداث العشوائية.`,
      `Re-run the simulation with the same seed (${design.choices.seed}) after changes to compare outcomes without changing the random event sequence.`,
    ),
  );
  if (!tierMetScience) {
    improvements.push(
      t(
        `تحتاج ${num(Math.max(0, tier.minScience - simulation.scienceAchieved), 1)} نقطة علم إضافية. أضف جهازًا عالي التوافق: ${bestInstrumentSuggestion(design).ar}.`,
        `You need ${num(Math.max(0, tier.minScience - simulation.scienceAchieved), 1)} more science points. Add a high-affinity instrument: ${bestInstrumentSuggestion(design).en}.`,
      ),
    );
  }
  if (simulation.budgetOverrunM > 0 || design.cost.remainingM < 0) {
    improvements.push(
      t(
        `خفّض التكلفة بمقدار ${num(Math.max(simulation.budgetOverrunM, -design.cost.remainingM), 1)} مليون دولار: صاروخ أصغر أو مدة عمليات أقصر أو احتياطي أقل.`,
        `Cut costs by $${num(Math.max(simulation.budgetOverrunM, -design.cost.remainingM), 1)}M: a smaller launcher, fewer ops days, or a smaller reserve.`,
      ),
    );
  }

  const headline =
    outcome === 'full'
      ? grade === 'S' || grade === 'A'
        ? t('مهمة استثنائية: نجاح كامل وتصميم متوازن.', 'Exceptional mission: full success and a balanced design.')
        : t('نجاح كامل: تحقق معيار المهمة.', 'Full success: the mission tier was met.')
      : outcome === 'partial'
        ? t(
            isSuccess ? 'نجاح جزئي: اكتملت المهمة لكن المعيار المختار لم يتحقق بالكامل.' : 'نجاح جزئي: بقي عائد علمي رغم فقدان المهمة.',
            isSuccess ? 'Partial success: the mission completed but the chosen tier was not fully met.' : 'Partial success: some science survived even though the mission was lost.',
          )
        : t(
            `فشل المهمة${simulation.failurePhase ? ` في مرحلة ${phaseName(simulation.failurePhase).ar}` : ''}.`,
            `Mission failure${simulation.failurePhase ? ` during ${phaseName(simulation.failurePhase).en}` : ''}.`,
          );

  return {
    breakdown,
    grade,
    outcome,
    headline,
    reasons,
    positives: topPositives,
    negatives: topNegatives,
    improvements,
    tierMet: { science: tierMetScience, data: tierMetData },
    createdAt,
  };
}

function phaseName(phase: string): LocalizedText {
  switch (phase) {
    case 'launch':
      return t('الإطلاق', 'launch');
    case 'cruise':
      return t('الإبحار', 'cruise');
    case 'arrival':
      return t('الوصول والالتقاط', 'arrival');
    case 'operations':
      return t('العمليات العلمية', 'science operations');
    case 'return':
      return t('الإرجاع', 'return');
    default:
      return t('مرحلة غير معروفة', 'unknown phase');
  }
}

function bestInstrumentSuggestion(design: DesignResult): LocalizedText {
  const chosen = new Set(design.choices.instruments);
  const candidates = INSTRUMENTS.filter(
    (i) =>
      !chosen.has(i.id) &&
      !(i.requiresSampleReturn && design.missionType.id !== 'sampleReturn'),
  )
    .map((i) => ({
      instrument: i,
      score: i.scienceBase * instrumentAffinity(i, design.target.id, design.target.kind),
    }))
    .sort((a, b) => b.score - a.score);
  const top = candidates[0];
  if (!top) return t('لا يوجد جهاز إضافي متاح', 'no additional instrument available');
  return {
    ar: `${top.instrument.name.ar} (+${top.score.toFixed(0)} نقطة محتملة)`,
    en: `${top.instrument.name.en} (+${top.score.toFixed(0)} potential points)`,
  };
}

export const scoreFromContext = ({ design, simulation }: ScoreContext): ScoreResult =>
  computeScore(design, simulation);
