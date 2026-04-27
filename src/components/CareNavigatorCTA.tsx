import { ArrowRight, MessageCircle, Stethoscope } from 'lucide-react';
import { CATEGORIES, FLEC_LINKS } from '../constants';
import { withUtm } from '../lib/utm';
import { cn } from '../lib/utils';

// CareNavigatorCTA — outbound link to PBC's care navigator scheduling
// surface, with UTM attribution for downstream Salesforce capture.
//
// Two variants:
//   banner — full-width, lives at the top of a CategoryResources panel
//            above the provider list. Highest visibility.
//   inline — compact, intended to be slipped between provider cards
//            (typically after the 3rd) so it stays visible without
//            interrupting the top results.
//
// All variants render as <a target="_blank" rel="noopener noreferrer">
// — the user keeps their ElderHub session, PBC opens fresh.

type Variant = 'banner' | 'inline';

interface CareNavigatorCTAProps {
  variant: Variant;
  /** FLEC category id of the panel this CTA appears within */
  categoryId?: string;
  /** ZIP or city the user is searching, for utm_term */
  searchTerm?: string;
}

const utmContent = (variant: Variant) =>
  variant === 'banner' ? 'cta-banner' : 'cta-inline';

const buildHref = (variant: Variant, categoryId?: string, searchTerm?: string) =>
  withUtm(FLEC_LINKS.scheduleCareNavigator, {
    campaign: categoryId,
    term: searchTerm,
    content: utmContent(variant),
  });

const ariaLabelFor = (categoryName?: string) =>
  categoryName
    ? `Schedule a free 15-minute call with a FLEC Care Navigator about ${categoryName}`
    : 'Schedule a free 15-minute call with a FLEC Care Navigator';

export function CareNavigatorCTA({
  variant,
  categoryId,
  searchTerm,
}: CareNavigatorCTAProps) {
  const category = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : undefined;
  const href = buildHref(variant, categoryId, searchTerm);
  const ariaLabel = ariaLabelFor(category?.name);

  if (variant === 'inline') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="block rounded-xl border border-elder-accent/30 bg-elder-accent/5 hover:bg-elder-accent/10 transition-colors p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-elder-accent/15 flex items-center justify-center">
            <MessageCircle size={16} className="text-elder-accent" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-elder-text leading-tight">
              Need a clinician's perspective?
            </p>
            <p className="text-[11px] text-elder-text-dim mt-0.5">
              Free 15-minute call with a FLEC Care Navigator
            </p>
          </div>
          <ArrowRight size={16} className="text-elder-accent flex-shrink-0" aria-hidden />
        </div>
      </a>
    );
  }

  // banner
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        'block rounded-xl bg-gradient-to-br from-elder-accent to-elder-accent/85',
        'hover:from-elder-accent/95 hover:to-elder-accent/80 transition-all',
        'p-4 sm:p-5 shadow-sm'
      )}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <Stethoscope size={18} className="text-white" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white leading-tight">
            Not sure where to start?
          </p>
          <p className="text-[11px] text-white/85 mt-0.5 leading-snug">
            {category
              ? `Talk to a FLEC Care Navigator about ${category.name}. `
              : 'Talk to a FLEC Care Navigator. '}
            Free 15-min call. No obligation.
          </p>
          <p className="text-[9px] text-white/65 mt-1 uppercase tracking-widest font-bold">
            FLEC Geriatric Medicine · Board-certified physician care
          </p>
        </div>
        <span
          className={cn(
            'flex-shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-4',
            'rounded-lg bg-white text-elder-accent text-[12px] font-bold',
            'hover:bg-white/95 transition-colors'
          )}
        >
          Schedule
          <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </a>
  );
}
