import { campaignChapterById, campaignProgress } from '../data/campaign';
import { useMissionStore } from './useMissionStore';

/** The chapter currently played, or null in freeplay. */
export function useActiveChapter() {
  const activeId = useMissionStore((state) => state.campaign.activeChapterId);
  return activeId ? campaignChapterById[activeId] ?? null : null;
}

/** Live campaign progress derived from persisted completions. */
export function useCampaignProgress() {
  const completed = useMissionStore((state) => state.campaign.completed);
  return campaignProgress(completed);
}
