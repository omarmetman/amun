import type { ReactNode } from 'react';
import { Frieze } from './Ornament';

/**
 * Full-page frame for the public dossier pages. It keeps the same frieze,
 * gutters and maximum measure as the mission workspace.
 */
export function PageShell({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-lapis-950 text-limestone-100">
      <Frieze className="text-royal-500" />
      {header}
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">{children}</main>
    </div>
  );
}
