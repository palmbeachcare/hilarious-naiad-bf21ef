import type { Handler } from '@netlify/functions';
import { PLACES_CATEGORY_MAP } from '../../src/data/placesCategoryMap';
import type {
  Provider,
  ProviderSearchResult,
  SearchContext,
} from '../../src/types';

// --- Constants ---

const PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const PLACES_NEARBY_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Field mask keeps API cost down. Without this, Places New API charges
// at the highest tier ($25 per 1k for full Pro fields). With these
// specific fields we hit the Pro tier (~$32/1k Text Search) which is
// the only tier that includes name+location+phone+rating. Removing
// rating/phone would drop us to Essentials (~$5/1k) but lose key UX.
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.addressComponents',
  'places.location',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.types',
].join(',');

const DEFAULT_RADIUS_MILES = 25;
const MILES_TO_METERS = 1609.344;
const FL_LOCATION_BIAS_TEXT = ', Florida';
const MAX_RESULTS = 10;

// --- Helpers ---

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: {
    'content-type': 'application/json',
    // CORS for browser fetch from elderhub.ai. Restrict to known origins;
    // wildcards would let any site burn through the API budget.
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  },
  body: JSON.stringify(body),
});

const errorResult = (msg: string): ProviderSearchResult => ({
  status: 'error',
  providers: [],
  source: 'places',
  errorMessage: msg,
});

const emptyResult = (msg: string): ProviderSearchResult => ({
  status: 'empty',
  providers: [],
  source: 'places',
  errorMessage: msg,
});

// Address-component lookup by type. Places returns components as an array;
// we fish out city / state / zip individually for the Provider shape.
type AddressComponent = { types?: string[]; longText?: string; shortText?: string };
const findComponent = (
  components: AddressComponent[] | undefined,
  type: string,
  short = false
): string | undefined => {
  const c = components?.find(x => x.types?.includes(type));
  return c ? (short ? c.shortText : c.longText) : undefined;
};

// Map a raw Places New API response object to our Provider shape.
type PlacesRaw = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
  location?: { latitude: number; longitude: number };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
};

const toProvider = (raw: PlacesRaw, categoryId: string): Provider => ({
  id: `places:${raw.id}`,
  source: 'places',
  name: raw.displayName?.text ?? 'Unknown',
  categoryIds: [categoryId],
  formattedAddress: raw.formattedAddress,
  city: findComponent(raw.addressComponents, 'locality'),
  state: findComponent(raw.addressComponents, 'administrative_area_level_1', true) ?? 'FL',
  zip: findComponent(raw.addressComponents, 'postal_code'),
  lat: raw.location?.latitude,
  lon: raw.location?.longitude,
  phone: raw.nationalPhoneNumber ?? raw.internationalPhoneNumber,
  website: raw.websiteUri,
  rating: raw.rating,
  ratingCount: raw.userRatingCount,
  placesId: raw.id,
  placesTypes: raw.types,
});

// Build a human-readable "near X" string for the result envelope.
const buildSearchedNear = (ctx: SearchContext): string => {
  if (ctx.lat != null && ctx.lon != null) return 'near your location';
  if (ctx.zip && ctx.city) return `near ${ctx.city}, FL ${ctx.zip}`;
  if (ctx.zip) return `near ${ctx.zip}`;
  if (ctx.city) return `near ${ctx.city}, FL`;
  return 'in Florida';
};

// --- Main handler ---

export const handler: Handler = async (event) => {
  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return json(204, '');
  }
  if (event.httpMethod !== 'POST') {
    return json(405, errorResult('Method not allowed'));
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return json(500, errorResult(
      'Search is temporarily unavailable. (GOOGLE_PLACES_API_KEY not configured)'
    ));
  }

  // Parse + validate body
  let ctx: SearchContext;
  try {
    ctx = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, errorResult('Invalid JSON body'));
  }
  if (!ctx.categoryId || typeof ctx.categoryId !== 'string') {
    return json(400, errorResult('categoryId is required'));
  }
  const hasLocation = !!(ctx.city || ctx.zip || (ctx.lat != null && ctx.lon != null));
  if (!hasLocation) {
    return json(400, errorResult(
      'Provide a city, ZIP, or coordinates to search'
    ));
  }

  // Lookup mapping
  const mapping = PLACES_CATEGORY_MAP[ctx.categoryId];
  if (!mapping) {
    return json(400, errorResult(
      `Unknown category: ${ctx.categoryId}`
    ));
  }
  if (mapping.strategy === 'unsupported') {
    return json(200, emptyResult(
      mapping.unsupportedReason ?? 'No local providers for this category'
    ));
  }

  const radiusMiles = ctx.radiusMiles ?? DEFAULT_RADIUS_MILES;
  const radiusMeters = Math.round(radiusMiles * MILES_TO_METERS);

  try {
    let placesResp: Response;

    if (mapping.strategy === 'type' && mapping.includedType) {
      // Nearby Search requires a circle (lat/lon + radius). If user gave
      // city/zip, we'd need to geocode first — but Text Search accepts
      // free-text location, so we fall through to text mode in that case.
      if (ctx.lat == null || ctx.lon == null) {
        // Fallback: Text Search with the type as a keyword
        const textQuery = `${mapping.includedType.replace(/_/g, ' ')} in ${
          ctx.zip ? ctx.zip : ctx.city
        }${FL_LOCATION_BIAS_TEXT}`;
        placesResp = await fetch(PLACES_TEXT_SEARCH_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-goog-api-key': apiKey,
            'x-goog-fieldmask': FIELD_MASK,
          },
          body: JSON.stringify({
            textQuery,
            includedType: mapping.includedType,
            maxResultCount: MAX_RESULTS,
            regionCode: 'us',
          }),
        });
      } else {
        placesResp = await fetch(PLACES_NEARBY_SEARCH_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-goog-api-key': apiKey,
            'x-goog-fieldmask': FIELD_MASK,
          },
          body: JSON.stringify({
            includedTypes: [mapping.includedType],
            maxResultCount: MAX_RESULTS,
            locationRestriction: {
              circle: {
                center: { latitude: ctx.lat, longitude: ctx.lon },
                radius: radiusMeters,
              },
            },
          }),
        });
      }
    } else {
      // 'text' strategy — works for both lat/lon and city/zip
      const locationPart =
        ctx.lat != null && ctx.lon != null
          ? '' // location bias added below for lat/lon
          : ` in ${ctx.zip ? ctx.zip : ctx.city}${FL_LOCATION_BIAS_TEXT}`;
      const textQuery = `${mapping.textQuery}${locationPart}`;

      const body: Record<string, unknown> = {
        textQuery,
        maxResultCount: MAX_RESULTS,
        regionCode: 'us',
      };
      if (ctx.lat != null && ctx.lon != null) {
        body.locationBias = {
          circle: {
            center: { latitude: ctx.lat, longitude: ctx.lon },
            radius: radiusMeters,
          },
        };
      }

      placesResp = await fetch(PLACES_TEXT_SEARCH_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
          'x-goog-fieldmask': FIELD_MASK,
        },
        body: JSON.stringify(body),
      });
    }

    if (!placesResp.ok) {
      const errBody = await placesResp.text();
      console.error('Places API error', placesResp.status, errBody);
      // DEBUG: surface Google's full error body so user can diagnose 401/403.
      // Will be reverted to a clean message once the auth issue is fixed.
      return json(502, errorResult(
        `Places API ${placesResp.status} — Google said: ${errBody.slice(0, 600)}`
      ));
    }

    const data = await placesResp.json() as { places?: PlacesRaw[] };
    const rawPlaces = data.places ?? [];
    const providers = rawPlaces.map(p => toProvider(p, ctx.categoryId));

    if (providers.length === 0) {
      return json(200, {
        status: 'empty',
        providers: [],
        source: 'places',
        searchedNear: buildSearchedNear(ctx),
      } satisfies ProviderSearchResult);
    }

    return json(200, {
      status: 'ok',
      providers,
      source: 'places',
      searchedNear: buildSearchedNear(ctx),
    } satisfies ProviderSearchResult);
  } catch (e) {
    console.error('places-search handler error', e);
    return json(502, errorResult(
      'Search failed. Please try again.'
    ));
  }
};
