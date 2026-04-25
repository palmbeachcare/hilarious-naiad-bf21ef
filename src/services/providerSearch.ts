import type { ProviderSearchResult, SearchContext } from '../types';

// Endpoint for the Netlify function. In production this resolves to
// /.netlify/functions/places-search; locally with `netlify dev` it
// resolves to the same path on the dev server.
const SEARCH_ENDPOINT = '/.netlify/functions/places-search';

// Fetch timeout — Places API responds in <2s typically; cap at 12s so a
// hung connection doesn't leave the user staring at a spinner forever.
const FETCH_TIMEOUT_MS = 12_000;

const errorResult = (msg: string): ProviderSearchResult => ({
  status: 'error',
  providers: [],
  source: 'places',
  errorMessage: msg,
});

/**
 * searchProviders is the single entry point used by the UI to find
 * service providers for a category at a given location. It wraps the
 * Netlify function call with timeout, error normalization, and basic
 * input guards so the UI can rely on a consistent shape regardless
 * of network or upstream conditions.
 */
export async function searchProviders(
  ctx: SearchContext
): Promise<ProviderSearchResult> {
  // Client-side input guards — the function does its own validation,
  // but failing fast here avoids a round trip on obvious mistakes.
  if (!ctx.categoryId) return errorResult('Pick a category to search');
  const hasLocation = !!(ctx.city || ctx.zip || (ctx.lat != null && ctx.lon != null));
  if (!hasLocation) {
    return errorResult('Enter a city, ZIP, or use your location');
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const resp = await fetch(SEARCH_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(ctx),
      signal: controller.signal,
    });

    // Even on non-2xx, the function returns a valid ProviderSearchResult
    // body — so we read JSON before deciding how to react.
    const body = await resp.json().catch(() => null) as ProviderSearchResult | null;
    if (!body) {
      return errorResult(`Search failed (HTTP ${resp.status})`);
    }
    return body;
  } catch (e: unknown) {
    if ((e as { name?: string })?.name === 'AbortError') {
      return errorResult('Search timed out. Check your connection and try again.');
    }
    return errorResult('Could not reach search service.');
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Browser geolocation wrapper — returns coords for "near me" search.
 * Resolves with null if unavailable or denied; the caller surfaces an
 * appropriate UI message instead of treating it as a hard error.
 */
export function getBrowserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      // Errors include user-denied (code 1), unavailable (2), timeout (3).
      // We don't surface specific codes here — UI shows a single fallback
      // prompt and lets the user fall back to typing a ZIP.
      () => resolve(null),
      { timeout: 8_000, maximumAge: 5 * 60_000 }
    );
  });
}
