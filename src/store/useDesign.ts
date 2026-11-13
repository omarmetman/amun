import { useMemo } from 'react';
import { deriveDesign } from '../engine/derive';
import { useMissionStore } from './useMissionStore';

/** All UI reads from the same pure derived design. */
export function useDesign() {
  const choices = useMissionStore((state) => state.choices);
  return useMemo(() => deriveDesign(choices), [choices]);
}
