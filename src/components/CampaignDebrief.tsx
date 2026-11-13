import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Dices,
  Flag,
  Lock,
  Radio,
  RotateCcw,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { CAMPAIGN_CHAPTERS, campaignProgress, nextCampaignChapter } from '../data/campaign';
import { evaluateCampaignChapter } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { useActiveChapter } from '../store/useCampaign';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch, SignalRings } from './CampaignArt';
import { StatusPill } from './Badges';

/**
 * Campaign payoff for the evaluation step: the chapter ending, the objectives
 * that earned the stars, and the road to the next chapter. In freeplay this
 * component renders nothing.
 */
export function CampaignDebrief({ onOpenCampaign }: { onOpenCampaign: () => void }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const chapter = useActiveChapter();
  const design = useDesign();
  const simulation = useMissionStore((state) => state.simulation);
  const score = useMissionStore((state) => state.score);
  const campaign = useMissionStore((state) => state.campaign);
  const replaySameChoices = useMissionStore((state) => state.replaySameChoices);
  const replaySameSeed = useMissionStore((state) => state.replaySameSeed);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);

  if (!chapter || !simulation || !score) return null;

  const accent = CAMPAIGN_ACCENTS[chapter.accent];
  const evaluation = evaluateCampaignChapter(chapter, design, simulation, score);
  const record = campaign.completed[chapter.id];
  const next = nextCampaignChapter(chapter.id);
  const progress = campaignProgress(campaign.completed);
  const stars = evaluation.stars;
  const bestStars = record?.stars ?? stars;
  const completedEver = record !== undefined;

  const advance = () => {
    if (next && startCampaignChapter(next.id)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onOpenCampaign();
  };

  const retrySameDesign = () => {
    replaySameChoices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retryReference = () => {
    replaySameSeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scienceGap = Math.max(0, design.tier.minScience - simulation.scienceAchieved);
  const dataGap = Math.max(0, design.tier.minDataGb - simulation.dataSentGb);
  const headline = evaluation.completed
    ? next
      ? t('اكتمل الفصل — والطريق يتوسّع', 'Chapter complete — and the road widens')
      : t('نهاية الحملة — الأفق مفتوح', 'Campaign complete — the horizon is open')
    : completedEver
      ? t('هذه الجولة لم تكتمل، لكن الفصل محفوظ', 'This run fell short, but the chapter remains complete')
      : t('لم يكتمل الفصل بعد', 'The chapter is not complete yet');

  return (
    <section className={`relative overflow-hidden rounded-3xl border ${accent.border} bg-gradient-to-br ${accent.gradient}`}>
      <div className="campaign-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-20 -top-24 h-72 w-72 opacity-70" aria-hidden="true">
        <SignalRings className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-28 -start-16 h-64 w-64 rounded-full bg-royal-600/10 blur-3xl" aria-hidden="true" />

      <div className="relative p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ChapterPatch chapter={chapter} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`font-latin text-[9px] font-bold tracking-[0.18em] ${accent.text}`} dir="ltr">
                  CHAPTER {String(chapter.number).padStart(2, '0')} · {chapter.code}
                </span>
                {evaluation.completed ? (
                  <StatusPill tone="good">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {t('مكتمل', 'Complete')}
                  </StatusPill>
                ) : (
                  <StatusPill tone="danger">
                    <XCircle className="h-3 w-3" aria-hidden="true" />
                    {t('غير مكتمل', 'Not complete')}
                  </StatusPill>
                )}
                {completedEver ? (
                  <span className="chip !px-2 !py-0.5 !text-[9px]">
                    <Sparkles className="h-2.5 w-2.5 text-gold-300" aria-hidden="true" />
                    {t('أفضل سجل', 'Best record')}: <span className="font-latin" dir="ltr">{fmt(record.bestScore, 1)}</span>
                  </span>
                ) : null}
              </div>
              <h2 className="mt-0.5 text-lg font-black leading-tight text-white sm:text-xl">
                {l(chapter.title)}
              </h2>
              <p className="text-[10px] font-semibold text-slate-400">{l(chapter.subtitle)}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <CampaignStarRating
              stars={bestStars}
              size="lg"
              label={t(`أفضل تقييم ${bestStars} من 3 نجوم`, `Best rating ${bestStars} of 3 stars`)}
            />
            <span className="text-[9px] text-slate-500">
              {t(
                `هذه الجولة ${stars}/3 · الأفضل ${bestStars}/3`,
                `This run ${stars}/3 · best ${bestStars}/3`,
              )}
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-black leading-snug text-white sm:text-lg">{headline}</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-slate-300">{l(chapter.objective)}</p>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-2">
            <div className="grid gap-1.5 sm:grid-cols-3">
              <Requirement
                met={simulation.success}
                label={t('المهمة', 'Mission')}
                detail={simulation.success ? t('سالمة حتى العمليات', 'Alive through operations') : t('فُقدت أو توقفت', 'Lost or stopped')}
              />
              <Requirement
                met={evaluation.tierMet.science}
                label={t('العلم', 'Science')}
                detail={
                  evaluation.tierMet.science
                    ? `${fmt(simulation.scienceAchieved, 1)} / ${fmt(design.tier.minScience, 0)}`
                    : t(`فجوة ${fmt(scienceGap, 1)}`, `${fmt(scienceGap, 1)} short`)
                }
              />
              <Requirement
                met={evaluation.tierMet.data}
                label={t('البيانات', 'Data')}
                detail={
                  evaluation.tierMet.data
                    ? `${fmt(simulation.dataSentGb, 2)} GB / ${fmt(design.tier.minDataGb, 1)} GB`
                    : t(`فجوة ${fmt(dataGap, 2)} GB`, `${fmt(dataGap, 2)} GB short`)
                }
              />
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-void-950/30 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-200">
                  <Trophy className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                  {t('أهداف الفصل ونجومها', 'Chapter objectives & stars')}
                </span>
                <span className="font-latin text-[9px] font-bold text-gold-200" dir="ltr">
                  {evaluation.stars}/3 ★
                </span>
              </div>
              <div className="space-y-1.5">
                <ObjectiveRow
                  met
                  title={t('إتمام الفصل', 'Chapter completion')}
                  description={t(
                    'مهمة ناجحة تحقق معياري العلم والبيانات.',
                    'A successful mission meeting both the science and data tiers.',
                  )}
                  star
                />
                {chapter.bonusObjectives.map((objective) => {
                  const met = Boolean(evaluation.objectives.find((entry) => entry.id === objective.id)?.met);
                  const saved = Boolean(record?.objectives[objective.id]);
                  return (
                    <ObjectiveRow
                      key={objective.id}
                      met={met}
                      saved={saved && !met}
                      title={l(objective.title)}
                      description={l(objective.description)}
                      star
                    />
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-royal-400/15 bg-royal-500/[0.045] p-3">
              <div className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-royal-300" aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-royal-300/80">
                  {t('إشارة معترضة', 'Intercepted transmission')}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-200">{l(chapter.transmission)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-950/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="eyebrow text-gold-200">{t('نهاية الفصل', 'Chapter ending')}</span>
                {completedEver ? (
                  <span className="font-latin text-[9px] text-slate-500" dir="ltr">
                    {fmtDateTime(record.completedAt, lang)}
                  </span>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                )}
              </div>
              <p className={`mt-1.5 text-[11px] leading-relaxed ${completedEver ? 'text-slate-300' : 'text-slate-500'}`}>
                {completedEver
                  ? l(chapter.epilogue)
                  : t(
                      'تفتح نهاية الفصل عندما تنجح المهمة ويصل العلم والبيانات إلى المعيار. القصة لا تمنح نفسها مجانًا.',
                      'The chapter ending unlocks when the mission succeeds and science and data reach the tier. The story does not give itself away for free.',
                    )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-void-950/35 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-300">{t('تقدم الحملة', 'Campaign progress')}</span>
                <span className="font-latin text-[9px] font-bold text-gold-200" dir="ltr">
                  {progress.completedCount}/{CAMPAIGN_CHAPTERS.length} · {progress.totalStars}/{progress.maxStars} ★
                </span>
              </div>
              <div className="flex gap-1" aria-hidden="true">
                {CAMPAIGN_CHAPTERS.map((entry, index) => {
                  const done = Boolean(campaign.completed[entry.id]);
                  const active = entry.id === chapter.id;
                  return (
                    <span
                      key={entry.id}
                      className={`h-1.5 flex-1 rounded-full ${
                        active ? 'bg-gold-300' : done ? 'bg-good/60' : index < chapter.number - 1 ? 'bg-white/20' : 'bg-white/[0.08]'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                {t(
                  'النجوم تُحفظ لأفضل جولة. إعادة الفصل لا تمحو نجومك أو نهايته.',
                  'Stars keep the best run. Replaying a chapter never erases your stars or its ending.',
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {evaluation.completed || completedEver ? (
                <button type="button" onClick={advance} className="btn-primary flex-1 !px-3 !py-2 text-[11px]">
                  <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
                  {next
                    ? t(
                        `افتح الفصل ${next.number}: ${l(next.title)}`,
                        `Open chapter ${next.number}: ${l(next.title)}`,
                      )
                    : t('اعرض شهادة الحملة', 'View the campaign record')}
                  {lang === 'ar' ? (
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              ) : null}
              <button type="button" onClick={retrySameDesign} className="btn-secondary flex-1 !px-3 !py-2 text-[11px]">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {t('أعد بتصميمك', 'Retry your design')}
              </button>
              <button type="button" onClick={retryReference} className="btn-ghost !px-3 !py-2 text-[11px]">
                <Dices className="h-3.5 w-3.5" aria-hidden="true" />
                {t('التصميم المرجعي', 'Reference design')}
              </button>
              <button type="button" onClick={onOpenCampaign} className="btn-ghost !px-3 !py-2 text-[11px]">
                <Flag className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                {t('خريطة الحملة', 'Campaign map')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="chip !px-2 !py-0.5 !text-[9px]">
                <Target className="h-2.5 w-2.5 text-royal-300" aria-hidden="true" />
                {l(chapter.title)}
              </span>
              <span className="chip !px-2 !py-0.5 !text-[9px] font-latin" dir="ltr">
                <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
                {chapter.seed}
              </span>
              <span className="chip !px-2 !py-0.5 !text-[9px]">
                {t('بذرة ثابتة طوال الفصل', 'Seed fixed for the chapter')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Requirement({ met, label, detail }: { met: boolean; label: string; detail: string }) {
  return (
    <div className={`rounded-xl border px-2.5 py-2 ${met ? 'border-good/25 bg-good/[0.05]' : 'border-danger/25 bg-danger/[0.05]'}`}>
      <div className="flex items-center gap-1.5">
        {met ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-good" aria-hidden="true" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
        )}
        <span className="text-[10px] font-bold text-slate-200">{label}</span>
      </div>
      <div className={`mt-0.5 truncate font-latin text-[9px] ${met ? 'text-good/90' : 'text-danger/90'}`} dir="ltr">
        {detail}
      </div>
    </div>
  );
}

function ObjectiveRow({
  met,
  saved = false,
  title,
  description,
  star = false,
}: {
  met: boolean;
  saved?: boolean;
  title: string;
  description: string;
  star?: boolean;
}) {
  const t = useT();
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-2.5 py-1.5 ${met ? 'border-good/20 bg-good/[0.045]' : 'border-white/[0.06] bg-white/[0.015]'}`}>
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          met ? 'bg-good/15 text-good' : saved ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-500'
        }`}
      >
        {met ? (
          <Check className="h-2.5 w-2.5" aria-hidden="true" />
        ) : saved ? (
          <Star className="h-2.5 w-2.5" aria-hidden="true" />
        ) : (
          <Lock className="h-2.5 w-2.5" aria-hidden="true" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-bold ${met ? 'text-slate-100' : 'text-slate-300'}`}>{title}</span>
          {met && star ? <span className="text-[9px] font-bold text-gold-300">+★</span> : null}
          {saved && !met ? (
            <span className="rounded bg-gold-400/10 px-1 py-0.5 text-[8px] font-bold text-gold-200">
              {t('محفوظ من جولة سابقة', 'saved from an earlier run')}
            </span>
          ) : null}
        </div>
        <p className="text-[9px] leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}
