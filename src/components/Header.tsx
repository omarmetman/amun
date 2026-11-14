import { ACHIEVEMENT_COUNT } from '../data/achievements';
import { CAMPAIGN_CHAPTERS } from '../data/campaign';
import { GITHUB, LIVE_LAB } from '../data/links';
import { STEPS } from '../data/steps';
import { useL, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { useCampaignProgress } from '../store/useCampaign';
import {
  IconBook,
  IconDownload,
  IconExit,
  IconFlag,
  IconMedal,
  IconPlus,
  IconReset,
  IconRocket,
  IconTarget,
  IconUpload,
} from './Icons';
import { SiteHeader, type HeaderMenuGroup } from './SiteHeader';

interface HeaderProps {
  onLearn: () => void;
  onProfile: () => void;
  onCampaign: () => void;
  onProject?: () => void;
  onNasaData?: () => void;
  onNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export function Header({
  onLearn,
  onProfile,
  onCampaign,
  onProject,
  onNasaData,
  onNew,
  onExport,
  onImport,
  onReset,
}: HeaderProps) {
  const t = useT();
  const l = useL();
  const step = useMissionStore((state) => state.step);
  const profile = useMissionStore((state) => state.profile);
  const activeChapterId = useMissionStore((state) => state.campaign.activeChapterId);
  const exitCampaign = useMissionStore((state) => state.exitCampaign);
  const campaignProgress = useCampaignProgress();
  const unlockedCount = Object.keys(profile.unlocked).length;
  const meta = STEPS[step - 1] ?? STEPS[0];

  const groups: HeaderMenuGroup[] = [
    {
      title: t('إدارة المهمة', 'Mission control'),
      items: [
        {
          key: 'campaign',
          label: t('حملة أفق آمون', 'AMUN Horizon campaign'),
          hint: `${campaignProgress.completedCount}/${CAMPAIGN_CHAPTERS.length}`,
          icon: <IconFlag className="h-4 w-4 text-ochre-300" />,
          onClick: onCampaign,
        },
        {
          key: 'learn',
          label: t('لوحة تعلّم', 'Learn panel'),
          icon: <IconBook className="h-4 w-4" />,
          onClick: onLearn,
        },
        {
          key: 'profile',
          label: t('ملف القائد', 'Commander profile'),
          hint: `${unlockedCount}/${ACHIEVEMENT_COUNT}`,
          icon: <IconMedal className="h-4 w-4 text-ochre-300" />,
          onClick: onProfile,
        },
        ...(activeChapterId
          ? [
              {
                key: 'exit-campaign',
                label: t('الخروج من الحملة', 'Exit campaign'),
                icon: <IconExit className="h-4 w-4" />,
                onClick: exitCampaign,
              },
            ]
          : []),
      ],
    },
    ...(onProject || onNasaData
      ? [
          {
            title: t('صفحات المشروع', 'Project pages'),
            items: [
              ...(onProject
                ? [
                    {
                      key: 'project',
                      label: t('مشروع آمون وطاقم العمل', 'Project AMUN & crew'),
                      icon: <IconRocket className="h-4 w-4 text-ochre-300" />,
                      onClick: onProject,
                    },
                  ]
                : []),
              ...(onNasaData
                ? [
                    {
                      key: 'nasa',
                      label: t('معلومات ناسا الحقيقية', 'NASA real science'),
                      icon: <IconTarget className="h-4 w-4 text-malachite" />,
                      onClick: onNasaData,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),
    {
      title: t('التصميم والبيانات', 'Design & data'),
      items: [
        {
          key: 'new',
          label: t('مهمة جديدة', 'New mission'),
          icon: <IconPlus className="h-4 w-4" />,
          onClick: onNew,
        },
        {
          key: 'export',
          label: t('تصدير التصميم', 'Export design'),
          icon: <IconDownload className="h-4 w-4" />,
          onClick: onExport,
        },
        {
          key: 'import',
          label: t('استيراد تصميم', 'Import design'),
          icon: <IconUpload className="h-4 w-4" />,
          onClick: onImport,
        },
        {
          key: 'reset',
          label: t('تصفير كل شيء', 'Full reset'),
          icon: <IconReset className="h-4 w-4" />,
          onClick: onReset,
          tone: 'danger' as const,
        },
      ],
    },
    {
      title: t('المعمل والكود', 'Lab & code'),
      items: [
        { key: 'lab', label: t('المعمل التفاعلي الحي', 'Live interactive lab'), href: LIVE_LAB },
        { key: 'github', label: 'GitHub', href: GITHUB },
      ],
    },
  ];

  return (
    <SiteHeader
      context={
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] leading-none text-limestone-400">{t('سجل المهمة', 'Mission log')}</span>
            <span className="font-latin text-[10px] leading-none tabular-nums text-ochre-300" dir="ltr">
              {String(step).padStart(2, '0')}/11
            </span>
          </div>
          <h1 className="mt-1 truncate font-display text-sm leading-none text-limestone-50">{l(meta.title)}</h1>
        </div>
      }
      nav={[
        { key: 'campaign', label: t('الحملة', 'Campaign'), onClick: onCampaign },
        { key: 'learn', label: t('تعلّم', 'Learn'), onClick: onLearn },
        { key: 'profile', label: t('الملف', 'Profile'), onClick: onProfile },
      ]}
      menuGroups={groups}
      primaryAction={
        onProject
          ? {
              label: t('المشروع', 'Project'),
              onClick: onProject,
              icon: <IconRocket className="h-4 w-4" />,
            }
          : undefined
      }
      menuLabel={t('قائمة المهمة', 'Mission menu')}
    />
  );
}
