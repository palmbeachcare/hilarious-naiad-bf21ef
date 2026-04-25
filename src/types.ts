export type Persona = 'senior' | 'caregiver' | 'provider' | 'partner';

export interface Category {
  id: string;
  name: string;
  icon: string;
  group: 'Medical' | 'Mobile' | 'Tech' | 'Living' | 'Support' | 'Professional' | 'Products' | 'Future';
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'idle';
  description: string;
  icon: string;
  color: string;
  actions: number;
  patients: number;
}

export interface Product {
  name: string;
  brand: string;
  price: string;
  category: string;
  icon: string;
  commission: string;
  rating: number;
  interactive: boolean;
  description: string;
}

export interface FeedEvent {
  time: string;
  event: string;
  detail: string;
  type: 'agent' | 'community' | 'service' | 'api';
  icon: string;
}

// --- Provider search types (Phase 1) ---
//
// Provider represents a single service-provider record returned from the
// search layer. Source can be 'curated' (in-repo, hand-vetted) or 'places'
// (live Google Places New API result, fetched via Netlify function).
//
// Fields are deliberately a subset of what Google Places returns plus a few
// FLEC-specific additions (categoryIds[], curated flag). When a Provider
// originates from Places, placesId is the canonical Google identifier and
// can be used for follow-up lookups (details, photos, route).

export type ProviderSource = 'curated' | 'places';

export interface Provider {
  id: string;                    // 'curated:elder-law-001' or 'places:ChIJ...'
  source: ProviderSource;
  name: string;
  categoryIds: string[];         // refs to Category.id; one provider can serve multiple
  // Address — components when known, formatted as fallback
  address?: string;              // street line(s)
  city?: string;
  state?: string;                // 2-letter, default 'FL'
  zip?: string;
  formattedAddress?: string;     // single-string form (Places-native)
  // Geo
  lat?: number;
  lon?: number;
  // Contact
  phone?: string;                // E.164 preferred, formatted display acceptable
  website?: string;
  // Quality signals (from Places when available)
  rating?: number;               // 0-5
  ratingCount?: number;
  // Places metadata (when source === 'places')
  placesId?: string;
  placesTypes?: string[];
  // FLEC-specific
  curated?: boolean;             // true if this entry is FLEC-vetted
  flecNote?: string;             // optional editorial note for curated entries
}

// SearchContext captures the user's location intent: a free-text city,
// a ZIP, an explicit lat/lon (from geolocation), or any combination.
// At least one of (city | zip | (lat & lon)) must be present for a
// meaningful search; the search service will return [] otherwise.

export interface SearchContext {
  categoryId: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  radiusMiles?: number;          // default 25
}

// ProviderSearchResult wraps the result list with metadata so the UI can
// distinguish 'real empty' from 'API failure' and surface data source
// (e.g. 'Showing 5 results from Google Places near 33470').

export type SearchStatus = 'ok' | 'empty' | 'error';

export interface ProviderSearchResult {
  status: SearchStatus;
  providers: Provider[];
  source: 'curated' | 'places' | 'mixed';
  errorMessage?: string;
  searchedNear?: string;         // human-readable e.g. 'near Wellington, FL'
}
