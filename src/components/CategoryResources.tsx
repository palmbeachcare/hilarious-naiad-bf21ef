import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Shield, MapPin } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { getResourcesForCategory } from '../data/flResources';
import { cn } from '../lib/utils';

interface CategoryResourcesProps {
  categoryId: string | null;
}

export function CategoryResources({ categoryId }: CategoryResourcesProps) {
  if (!categoryId) return null;

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const entry = getResourcesForCategory(categoryId);

  if (!category || !entry) return null;

  const tierStyles = {
    A: { label: 'Verified', color: '#2d6a4f', bg: 'bg-elder-accent/10' },
    B: { label: 'Partial coverage', color: '#0077B6', bg: 'bg-blue-50' },
    C: { label: 'Coming soon', color: '#9CA3AF', bg: 'bg-gray-100' },
  } as const;

  const tier = tierStyles[entry.tier];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={categoryId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-elder-border p-6 space-y-4"
        aria-live="polite"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {category.icon}
            </span>
            <div>
              <h3 className="text-sm font-black text-elder-text flex items-center gap-2">
                {category.name}
                <Shield size={14} className="text-elder-accent" aria-hidden="true" />
              </h3>
              <p className="text-[10px] text-elder-text-dim mt-0.5 flex items-center gap-1.5">
                <MapPin size={10} aria-hidden="true" />
                Florida statewide resources
              </p>
            </div>
          </div>

          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full',
              tier.bg
            )}
            style={{ color: tier.color }}
          >
            {tier.label}
          </span>
        </header>

        {entry.resources.length > 0 ? (
          <ul className="space-y-3">
            {entry.resources.map((resource, idx) => (
              <li key={`${resource.url}-${idx}`}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-elder-border hover:border-elder-accent/40 hover:bg-gray-50 transition-all min-h-[44px] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-elder-text flex items-center gap-1.5 group-hover:text-elder-accent transition-colors">
                        {resource.name}
                        <ExternalLink
                          size={12}
                          className="text-gray-400 group-hover:text-elder-accent transition-colors shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-[11px] text-elder-text-dim mt-1 leading-relaxed">
                        {resource.description}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {resource.agency}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 rounded-xl bg-gray-50 border border-dashed border-elder-border text-center">
            <p className="text-xs text-elder-text-dim leading-relaxed">
              {entry.note || 'Community-contributed resources coming soon.'}
            </p>
            <p className="text-[10px] text-gray-400 mt-2">
              Want to add a verified resource? Join as a contributor.
            </p>
          </div>
        )}

        <footer className="pt-2 border-t border-elder-border/50">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Links verified April 2026. Government and nonprofit sources only — no referral fees.
            Report a broken link by opening an issue on the repository.
          </p>
        </footer>
      </motion.section>
    </AnimatePresence>
  );
}
