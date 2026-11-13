import { beforeEach, describe, expect, it } from 'vitest';
import { useMissionStore } from './useMissionStore';

const store = () => useMissionStore.getState();

describe('design export and import', () => {
  beforeEach(() => {
    store().resetAll();
  });

  it('round-trips every exported choice and restarts the wizard', () => {
    store().startGame();
    const before = store().choices;
    const json = store().exportDesign();
    const parsed = JSON.parse(json) as { version: number; exportedAt: string; choices: unknown };

    expect(parsed.version).toBe(3);
    expect(typeof parsed.exportedAt).toBe('string');
    expect(parsed.choices).toEqual(before);

    store().resetAll();
    expect(store().started).toBe(false);

    expect(store().importDesign(json)).toEqual({ ok: true });
    expect(store().choices).toEqual(before);
    expect(store().started).toBe(true);
    expect(store().step).toBe(1);
    expect(store().simulation).toBeNull();
    expect(store().score).toBeNull();
  });

  it('rejects malformed JSON, missing choices and unknown targets', () => {
    expect(store().importDesign('{')).toEqual({ ok: false, error: 'parse' });
    expect(store().importDesign('{}')).toEqual({ ok: false, error: 'invalid' });

    const parsed = JSON.parse(store().exportDesign()) as {
      choices: Record<string, unknown>;
    };
    parsed.choices.targetId = 'not-a-target';
    expect(store().importDesign(JSON.stringify(parsed))).toEqual({ ok: false, error: 'target' });
  });

  it('sanitises out-of-range values and removes incompatible instruments', () => {
    const parsed = JSON.parse(store().exportDesign()) as {
      choices: Record<string, unknown>;
    };
    parsed.choices.opsDays = 9999;
    parsed.choices.reservePercent = -20;
    parsed.choices.missionType = 'flyby';
    parsed.choices.instruments = ['nac', 'sampleCapsule'];

    expect(store().importDesign(JSON.stringify(parsed))).toEqual({ ok: true });
    expect(store().choices.opsDays).toBe(180);
    expect(store().choices.reservePercent).toBe(0);
    expect(store().choices.instruments).toContain('nac');
    expect(store().choices.instruments).not.toContain('sampleCapsule');
  });
});

describe('pilot profile', () => {
  beforeEach(() => {
    store().resetAll();
  });

  it('records a unique run once and keeps the profile across new missions', () => {
    store().startGame();
    expect(store().runSimulation()).toBe(true);

    const runId = store().simulation?.runId;
    expect(store().profile.stats.runs).toBe(1);
    expect(store().profile.recordedRuns).toContain(runId);
    expect(store().lastUnlocked.length).toBeGreaterThan(0);

    // Repeated simulation with the same seed/choices is the same run id.
    expect(store().runSimulation()).toBe(true);
    expect(store().profile.stats.runs).toBe(1);

    store().startGame();
    expect(store().profile.stats.runs).toBe(1);

    store().resetAll();
    expect(store().profile.stats.runs).toBe(0);
    expect(store().profile.recordedRuns).toEqual([]);
    expect(store().lastUnlocked).toEqual([]);
  });
});

describe('campaign flow', () => {
  beforeEach(() => {
    store().resetAll();
  });

  it('locks directives, completes chapter one and unlocks chapter two', () => {
    expect(store().startCampaignChapter('mars-dust')).toBe(false);
    expect(store().startCampaignChapter('moon-echo')).toBe(true);
    expect(store().started).toBe(true);
    expect(store().step).toBe(1);
    expect(store().choices.targetId).toBe('moon');
    expect(store().choices.missionType).toBe('orbiter');
    expect(store().choices.difficulty).toBe('beginner');
    expect(store().choices.successTier).toBe('basic');
    expect(store().choices.seed).toBe('NILE-2041');

    // Campaign directives are immutable.
    store().setTarget('mars');
    store().setMissionType('lander');
    store().setDifficulty('expert');
    store().setSeed('MUTATED');
    store().setChoice('successTier', 'ambitious');
    expect(store().choices.targetId).toBe('moon');
    expect(store().choices.missionType).toBe('orbiter');
    expect(store().choices.difficulty).toBe('beginner');
    expect(store().choices.successTier).toBe('basic');
    expect(store().choices.seed).toBe('NILE-2041');

    expect(store().runSimulation()).toBe(true);
    const record = store().campaign.completed['moon-echo'];
    expect(record).toBeDefined();
    expect(record.stars).toBe(3);
    expect(record.bestGrade).toBe('S');
    expect(store().campaign.activeChapterId).toBe('moon-echo');

    expect(store().startCampaignChapter('mars-dust')).toBe(true);
    expect(store().choices.targetId).toBe('mars');
    expect(store().choices.seed).toBe('6KC5N8MD');
    expect(store().campaign.activeChapterId).toBe('mars-dust');
  });

  it('keeps campaign directives through import and replays the reference design', () => {
    store().startCampaignChapter('moon-echo');
    store().setChoice('opsDays', 60);
    expect(store().choices.opsDays).toBe(60);

    const snapshot = JSON.parse(store().exportDesign()) as {
      choices: Record<string, unknown>;
    };
    snapshot.choices.targetId = 'mars';
    snapshot.choices.missionType = 'lander';
    snapshot.choices.difficulty = 'expert';
    snapshot.choices.successTier = 'ambitious';
    snapshot.choices.seed = 'HACKED';

    expect(store().importDesign(JSON.stringify(snapshot))).toEqual({ ok: true });
    expect(store().choices.targetId).toBe('moon');
    expect(store().choices.missionType).toBe('orbiter');
    expect(store().choices.difficulty).toBe('beginner');
    expect(store().choices.successTier).toBe('basic');
    expect(store().choices.seed).toBe('NILE-2041');

    // same design: keep opsDays; reference design: restore the chapter preset.
    store().replaySameChoices();
    expect(store().choices.opsDays).toBe(60);
    expect(store().choices.seed).toBe('NILE-2041');
    expect(store().step).toBe(1);

    store().setChoice('opsDays', 45);
    store().replaySameSeed();
    expect(store().choices.opsDays).toBe(30);
    expect(store().choices.seed).toBe('NILE-2041');
    expect(store().campaign.activeChapterId).toBe('moon-echo');
  });

  it('leaves the campaign without erasing completed chapters', () => {
    store().startCampaignChapter('moon-echo');
    expect(store().runSimulation()).toBe(true);
    expect(store().campaign.completed['moon-echo']).toBeDefined();

    store().exitCampaign();
    expect(store().started).toBe(false);
    expect(store().campaign.activeChapterId).toBeNull();
    expect(store().campaign.completed['moon-echo']).toBeDefined();
    expect(store().startCampaignChapter('moon-echo')).toBe(true);
  });
});
