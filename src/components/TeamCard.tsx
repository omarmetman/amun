import type { LocalizedText } from '../data/types';
import { useL, useT } from '../i18n';
import { IconCheck, IconExternal, IconLinkedIn } from './Icons';

export interface TeamMember {
  name: LocalizedText;
  role: LocalizedText;
  tag: LocalizedText;
  image: string;
  linkedin: string;
  bio: LocalizedText;
  contributions: LocalizedText[];
}

/**
 * One crew dossier card. The portrait, identity and role sit on the same
 * baseline row; contributions stay inside the card as a compact numbered list.
 */
export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const l = useL();
  const t = useT();

  return (
    <article className="flex h-full min-w-0 flex-col border border-royal-700 bg-lapis-900/50">
      <div className="flex items-center justify-between gap-3 border-b border-royal-700 px-4 py-2.5">
        <span className="font-latin text-[10px] tabular-nums tracking-[0.16em] text-limestone-400" dir="ltr">
          CREW / {String(index + 1).padStart(2, '0')}
        </span>
        <span className="border border-ochre-400/40 bg-ochre-400/10 px-2 py-0.5 text-[10px] font-medium text-ochre-200">
          {l(member.tag)}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <img
            src={member.image}
            alt={l(member.name)}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 shrink-0 border border-royal-600 object-cover object-top"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg leading-snug text-limestone-50">{l(member.name)}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ochre-200">{l(member.role)}</p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 border-b border-royal-600 text-[11px] font-medium text-limestone-300 transition-colors hover:border-ochre-400 hover:text-ochre-200"
            >
              <IconLinkedIn className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
              <IconExternal className="h-3 w-3" />
            </a>
          </div>
        </div>

        <p className="mt-4 text-sm leading-[1.85] text-limestone-300">{l(member.bio)}</p>

        <div className="mt-4 border-t border-royal-700 pt-3">
          <div className="text-[10px] font-semibold tracking-wide text-limestone-400">
            {t('أبرز الإسهامات الهندسية', 'Core technical contributions')}
          </div>
          <ul className="mt-2 space-y-1.5">
            {member.contributions.map((contribution, contributionIndex) => (
              <li
                key={`${member.name.en}-${contributionIndex}`}
                className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-x-2"
              >
                <IconCheck className="mt-[5px] h-3.5 w-3.5 text-malachite" />
                <span className="min-w-0 text-xs leading-relaxed text-limestone-300">{l(contribution)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
