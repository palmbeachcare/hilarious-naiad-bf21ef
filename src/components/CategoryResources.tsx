import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  Star,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { searchProviders, getBrowserLocation } from '../services/providerSearch';
import { CareNavigatorCTA } from './CareNavigatorCTA';
import type { Provider, ProviderSearchResult, SearchContext } from '../types';

interface CategoryResourcesProps {
  categoryId: string | null;
}

// Tracks the lifecycle of the geolocation request that fires when a
// category is opened. UI branches off this state to show the right
// affordance (request prompt -> loading -> results, or denied -> ZIP form).
type LocationStatus = 'initial' | 'requesting' | 'granted' | 'denied' | 'manual';

const DEFAULT_RADIUS_MILES = 25;
const EXPANDED_RADIUS_MILES = 50;

export function CategoryResources({ categoryId }: CategoryResourcesProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId);

  const [locationStatus, setLocationStatus] = useState<LocationStatus>('initial');
  const [searchContext, setSearchContext] = useState<SearchContext | null>(null);
  const [result, setResult] = useState<ProviderSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputCity, setInputCity] = useState('');
  const [inputZip, setInputZip] = useState('');
  const [showSearchForm, setShowSearchForm] = useState(false);

  // Tracks the most recent search "request id" so a slow response from a
  // stale request can't overwrite a faster fresh one. Plain ref counter,
  // simpler than threading AbortControllers through.
  const requestIdRef = useRef(0);

  // --- Effects ---

  // When categoryId changes (or on mount), reset everything and try
  // geolocation. The component is keyed by categoryId in App.tsx so this
  // effectively runs on each new category selection.
  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setLocationStatus('requesting');
    setResult(null);
    setSearchContext(null);
    setShowSearchForm(false);

    getBrowserLocation().then((coords) => {
      if (cancelled) return;
      if (coords) {
        setLocationStatus('granted');
        setSearchContext({
          categoryId,
          lat: coords.lat,
          lon: coords.lon,
          radiusMiles: DEFAULT_RADIUS_MILES,
        });
      } else {
        setLocationStatus('denied');
        setShowSearchForm(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  // Run the actual provider search whenever searchContext changes.
  useEffect(() => {
    if (!searchContext) return;
    const myRequestId = ++requestIdRef.current;
    setIsLoading(true);

    searchProviders(searchContext).then((res) => {
      // Stale-response guard
      if (myRequestId !== requestIdRef.current) return;
      setResult(res);
      setIsLoading(false);
    });
  }, [searchContext]);

  // --- Handlers ---

  const handleManualSearch = useCallback(() => {
    if (!categoryId) return;
    const city = inputCity.trim();
    const zip = inputZip.trim();
    if (!city && !zip) return;
    setLocationStatus('manual');
    setSearchContext({
      categoryId,
      city: city || undefined,
      zip: zip || undefined,
      radiusMiles: DEFAULT_RADIUS_MILES,
    });
    setShowSearchForm(false);
  }, [categoryId, inputCity, inputZip]);

  const handleUseMyLocation = useCallback(async () => {
    if (!categoryId) return;
    setLocationStatus('requesting');
    const coords = await getBrowserLocation();
    if (coords) {
      setLocationStatus('granted');
      setSearchContext({
        categoryId,
        lat: coords.lat,
        lon: coords.lon,
        radiusMiles: DEFAULT_RADIUS_MILES,
      });
      setShowSearchForm(false);
    } else {
      setLocationStatus('denied');
    }
  }, [categoryId]);

  const handleExpandRadius = useCallback(() => {
    if (!searchContext) return;
    setSearchContext({ ...searchContext, radiusMiles: EXPANDED_RADIUS_MILES });
  }, [searchContext]);

  // Early exits
  if (!categoryId) return null;
  if (!category) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={categoryId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-2xl border border-elder-border overflow-hidden"
        aria-labelledby={`category-resources-${categoryId}`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-elder-border bg-gradient-to-br from-elder-accent/5 to-transparent">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">{category.icon}</span>
              <div className="min-w-0">
                <h3
                  id={`category-resources-${categoryId}`}
                  className="text-sm font-bold text-elder-text leading-tight"
                >
                  Find {category.name} near you
                </h3>
                <LocationLabel
                  status={locationStatus}
                  ctx={searchContext}
                  searchedNear={result?.searchedNear}
                />
              </div>
            </div>
            <button
              onClick={() => setShowSearchForm((v) => !v)}
              className="text-[10px] font-bold text-elder-accent hover:underline min-h-[32px] px-2"
            >
              {showSearchForm ? 'Hide' : 'Change location'}
            </button>
          </div>
        </div>

        {/* Search form (collapsed by default after a successful auto-search) */}
        <AnimatePresence initial={false}>
          {showSearchForm && (
            <motion.div
              key="form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-b border-elder-border"
            >
              <div className="px-5 py-4 bg-gray-50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      City
                    </span>
                    <input
                      type="text"
                      value={inputCity}
                      onChange={(e) => setInputCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      placeholder="e.g., Wellington"
                      className="mt-1 w-full min-h-[44px] px-3 py-2 rounded-lg border border-elder-border text-[13px] focus:outline-none focus:ring-2 focus:ring-elder-accent/30 focus:border-elder-accent"
                      aria-label="City"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      ZIP
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={5}
                      value={inputZip}
                      onChange={(e) => setInputZip(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      placeholder="e.g., 33470"
                      className="mt-1 w-full min-h-[44px] px-3 py-2 rounded-lg border border-elder-border text-[13px] focus:outline-none focus:ring-2 focus:ring-elder-accent/30 focus:border-elder-accent"
                      aria-label="ZIP code"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleManualSearch}
                    disabled={!inputCity.trim() && !inputZip.trim()}
                    className="min-h-[44px] px-4 rounded-lg bg-elder-accent text-white text-[12px] font-bold hover:bg-elder-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Search size={14} />
                    Search
                  </button>
                  <button
                    onClick={handleUseMyLocation}
                    className="min-h-[44px] px-4 rounded-lg border border-elder-border text-elder-text text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Navigation size={14} />
                    Use my location
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status / results zone */}
        <div className="px-5 py-4 min-h-[120px] space-y-4">
          {/* Banner CTA — visible whenever a search result has loaded
              (ok / empty / error). Hidden during initial loading and the
              geolocation prompt to avoid distracting from the primary
              flow. categoryId is always set here since we early-return
              if it is null, so passing as non-null. */}
          {!isLoading && result && (
            <CareNavigatorCTA
              variant="banner"
              categoryId={categoryId}
              searchTerm={searchContext?.zip ?? searchContext?.city}
            />
          )}

          {isLoading && <LoadingState />}

          {!isLoading && locationStatus === 'requesting' && !searchContext && (
            <RequestingLocationState />
          )}

          {!isLoading && result && result.status === 'ok' && (
            <ResultsList
              providers={result.providers}
              categoryId={categoryId}
              searchTerm={searchContext?.zip ?? searchContext?.city}
              onExpand={
                searchContext &&
                (searchContext.radiusMiles ?? DEFAULT_RADIUS_MILES) < EXPANDED_RADIUS_MILES
                  ? handleExpandRadius
                  : undefined
              }
            />
          )}

          {!isLoading && result && result.status === 'empty' && (
            <EmptyState
              message={result.errorMessage ?? 'No providers found in this area.'}
              onExpand={
                searchContext &&
                (searchContext.radiusMiles ?? DEFAULT_RADIUS_MILES) < EXPANDED_RADIUS_MILES
                  ? handleExpandRadius
                  : undefined
              }
              onChangeLocation={() => setShowSearchForm(true)}
            />
          )}

          {!isLoading && result && result.status === 'error' && (
            <ErrorState
              message={result.errorMessage ?? 'Something went wrong.'}
              onRetry={() => searchContext && setSearchContext({ ...searchContext })}
            />
          )}
        </div>

        {/* Footer attribution */}
        <div className="px-5 py-3 border-t border-elder-border bg-gray-50">
          <p className="text-[9px] text-gray-500 leading-relaxed">
            Listings powered by Google Places. ElderHub does not endorse or verify
            individual providers — please call ahead and confirm services, hours,
            and Medicare/insurance acceptance before scheduling.
          </p>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

// --- Subcomponents ---

function LocationLabel({
  status,
  ctx,
  searchedNear,
}: {
  status: LocationStatus;
  ctx: SearchContext | null;
  searchedNear?: string;
}) {
  let text = '';
  if (searchedNear) text = searchedNear;
  else if (status === 'requesting') text = 'finding your location…';
  else if (status === 'denied' && !ctx) text = 'enter a ZIP or city below';
  else if (ctx?.zip && ctx?.city) text = `near ${ctx.city}, FL ${ctx.zip}`;
  else if (ctx?.zip) text = `near ${ctx.zip}`;
  else if (ctx?.city) text = `near ${ctx.city}, FL`;
  else if (ctx?.lat != null) text = 'near your location';
  if (!text) return null;
  return (
    <p className="text-[11px] text-elder-text-dim mt-0.5 flex items-center gap-1">
      <MapPin size={11} className="flex-shrink-0" aria-hidden />
      {text}
    </p>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-elder-text-dim text-[12px]">
      <Loader2 size={16} className="animate-spin" aria-hidden />
      <span>Finding providers…</span>
    </div>
  );
}

function RequestingLocationState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <Navigation size={20} className="text-elder-accent" aria-hidden />
      <p className="text-[12px] font-semibold text-elder-text">
        Allow location access
      </p>
      <p className="text-[11px] text-elder-text-dim max-w-xs">
        We use your location to find providers nearby. You can also search by
        city or ZIP instead.
      </p>
    </div>
  );
}

function EmptyState({
  message,
  onExpand,
  onChangeLocation,
}: {
  message: string;
  onExpand?: () => void;
  onChangeLocation?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
      <p className="text-[12px] text-elder-text-dim max-w-md">{message}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {onExpand && (
          <button
            onClick={onExpand}
            className="min-h-[36px] px-3 rounded-lg border border-elder-border text-[11px] font-bold hover:bg-gray-50 transition-colors"
          >
            Expand to 50 miles
          </button>
        )}
        {onChangeLocation && (
          <button
            onClick={onChangeLocation}
            className="min-h-[36px] px-3 rounded-lg border border-elder-border text-[11px] font-bold hover:bg-gray-50 transition-colors"
          >
            Try another location
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
      <AlertCircle size={20} className="text-red-500" aria-hidden />
      <p className="text-[12px] text-elder-text max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-[36px] px-3 rounded-lg border border-elder-border text-[11px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={12} />
          Try again
        </button>
      )}
    </div>
  );
}

function ResultsList({
  providers,
  categoryId,
  searchTerm,
  onExpand,
}: {
  providers: Provider[];
  categoryId: string;
  searchTerm?: string;
  onExpand?: () => void;
}) {
  // Inject the inline CTA after the 3rd provider card if there are at
  // least 4 results. Below 4 results the banner CTA already covers it
  // and a second inline CTA would feel pushy; above 4, the inline keeps
  // the CTA in view as users scan further down the list.
  const showInlineCta = providers.length >= 4;

  return (
    <div className="space-y-3">
      {providers.map((p, i) => (
        <div key={p.id} className="space-y-3">
          <ProviderCard provider={p} />
          {showInlineCta && i === 2 && (
            <CareNavigatorCTA
              variant="inline"
              categoryId={categoryId}
              searchTerm={searchTerm}
            />
          )}
        </div>
      ))}
      {onExpand && providers.length < 5 && (
        <button
          onClick={onExpand}
          className="w-full min-h-[40px] mt-2 rounded-lg border border-dashed border-elder-border text-[11px] font-bold text-elder-text-dim hover:bg-gray-50 hover:text-elder-text transition-colors"
        >
          Few results — expand search to 50 miles
        </button>
      )}
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  // Google Maps universal directions URL: deep-links to Maps app on iOS/
  // Android if installed, opens web Maps otherwise. One link, all platforms.
  const directionsUrl =
    provider.lat != null && provider.lon != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lon}`
      : provider.formattedAddress
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          provider.formattedAddress
        )}`
      : null;

  const phoneHref = provider.phone ? `tel:${provider.phone.replace(/[^\d+]/g, '')}` : null;

  return (
    <article className="border border-elder-border rounded-xl p-4 hover:border-elder-accent/40 transition-colors">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-bold text-elder-text leading-tight">
            {provider.name}
          </h4>
          {provider.rating != null && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={11} className="text-amber-500 fill-amber-500" aria-hidden />
              <span className="text-[11px] font-semibold text-elder-text">
                {provider.rating.toFixed(1)}
              </span>
              {provider.ratingCount != null && (
                <span className="text-[10px] text-elder-text-dim">
                  ({provider.ratingCount.toLocaleString()})
                </span>
              )}
            </div>
          )}
          {provider.formattedAddress && (
            <p className="text-[11px] text-elder-text-dim mt-1.5 leading-snug">
              {provider.formattedAddress}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {phoneHref && (
          <a
            href={phoneHref}
            className="min-h-[36px] px-3 rounded-lg bg-elder-accent/10 text-elder-accent text-[11px] font-bold hover:bg-elder-accent/15 transition-colors flex items-center gap-1.5"
          >
            <Phone size={12} />
            {provider.phone}
          </a>
        )}
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[36px] px-3 rounded-lg border border-elder-border text-elder-text text-[11px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Navigation size={12} />
            Directions
          </a>
        )}
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[36px] px-3 rounded-lg border border-elder-border text-elder-text text-[11px] font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Globe size={12} />
            Website
          </a>
        )}
      </div>
    </article>
  );
}
