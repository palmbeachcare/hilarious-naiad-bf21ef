// Maps FLEC category IDs to Google Places New API search parameters.
//
// The Places New API (Text Search and Nearby Search) accepts:
//   - includedType: a single official Places type (preferred when one fits)
//   - keyword/textQuery: free-text used in the Text Search endpoint
//
// Many FLEC categories don't map cleanly to a single Places type. For those,
// we use a textQuery against Text Search and rely on Google's relevance
// ranking. Each entry records both options so the search service can pick
// the right endpoint at call time.
//
// strategy:
//   'type'      — use Nearby Search with includedType. Cheapest, most
//                 precise. Only when a clean Places type exists.
//   'text'      — use Text Search with textQuery. Use when no clean type.
//   'unsupported' — category has no meaningful Places equivalent. The search
//                 layer returns an empty result with an explanatory message
//                 rather than wasting an API call.

export type PlacesStrategy = 'type' | 'text' | 'unsupported';

export interface PlacesCategoryMapping {
  strategy: PlacesStrategy;
  // For 'type' strategy:
  includedType?: string;
  // For 'text' strategy:
  textQuery?: string;
  // For 'unsupported': human-readable reason shown to user
  unsupportedReason?: string;
  // Optional secondary keyword to bias relevance even when type is set
  keyword?: string;
}

// Reference for Places types (New): https://developers.google.com/maps/documentation/places/web-service/place-types
// Listed types verified against the official New API table. Where the
// official type doesn't map (e.g. 'memory_care' is not a Places type),
// we use textQuery with a Florida-disambiguating term.
export const PLACES_CATEGORY_MAP: Record<string, PlacesCategoryMapping> = {
  // --- Medical ---
  geriatric:   { strategy: 'text', textQuery: 'geriatrician geriatric medicine doctor' },
  homehealth:  { strategy: 'text', textQuery: 'home health agency' },
  nursing:     { strategy: 'text', textQuery: 'private duty nursing agency' },
  therapy:     { strategy: 'text', textQuery: 'physical therapy occupational therapy speech therapy' },
  pharmacy:    { strategy: 'type', includedType: 'pharmacy' },
  dental:      { strategy: 'type', includedType: 'dentist' },
  vision:      { strategy: 'text', textQuery: 'optometrist eye doctor' },
  hearing:     { strategy: 'text', textQuery: 'audiologist hearing aid' },
  mental:      { strategy: 'text', textQuery: 'mental health therapist counselor' },
  hospice:     { strategy: 'text', textQuery: 'hospice palliative care agency' },

  // --- Mobile ---
  mobilelab:   { strategy: 'text', textQuery: 'mobile lab blood draw at home' },
  vaccine:     { strategy: 'text', textQuery: 'vaccination clinic flu shot' },
  imaging:     { strategy: 'text', textQuery: 'mobile x-ray ultrasound at home' },
  mace:        { strategy: 'text', textQuery: 'urgent care house call mobile acute' },

  // --- Tech ---
  rpm:         { strategy: 'text', textQuery: 'telehealth remote patient monitoring' },
  pers:        { strategy: 'text', textQuery: 'medical alert system emergency response' },
  iot:         { strategy: 'unsupported', unsupportedReason: 'Ambient IoT sensors are typically purchased online, not from local providers' },
  robotics:    { strategy: 'unsupported', unsupportedReason: 'Robotics & AI care providers do not yet have local listings' },
  techsetup:   { strategy: 'text', textQuery: 'computer setup tech support service' },
  vr:          { strategy: 'unsupported', unsupportedReason: 'VR therapy is delivered via subscription, not local providers' },
  smartpill:   { strategy: 'unsupported', unsupportedReason: 'Smart pill dispensers are direct-to-consumer products' },
  blockchain:  { strategy: 'unsupported', unsupportedReason: 'Blockchain vault services are online-only' },

  // --- Living ---
  al:          { strategy: 'text', textQuery: 'assisted living facility' },
  snf:         { strategy: 'text', textQuery: 'skilled nursing facility nursing home' },
  memory:      { strategy: 'text', textQuery: 'memory care dementia assisted living' },
  independent: { strategy: 'text', textQuery: 'independent living retirement community' },
  adultday:    { strategy: 'text', textQuery: 'adult day care senior day program' },
  placement:   { strategy: 'text', textQuery: 'senior placement agency assisted living advisor' },

  // --- Support ---
  companion:   { strategy: 'text', textQuery: 'companion care senior companion' },
  respite:     { strategy: 'text', textQuery: 'respite care senior' },
  transport:   { strategy: 'text', textQuery: 'non-emergency medical transport NEMT senior' },
  nutrition:   { strategy: 'text', textQuery: 'meals on wheels senior meal delivery' },
  gig:         { strategy: 'text', textQuery: 'on-demand senior help task service' },
  petcare:     { strategy: 'text', textQuery: 'pet sitter dog walker' },
  caregiver:   { strategy: 'text', textQuery: 'caregiver support group' },
  community:   { strategy: 'text', textQuery: 'senior center community services' },
  moving:      { strategy: 'text', textQuery: 'senior move manager relocation' },
  events:      { strategy: 'text', textQuery: 'event planner birthday celebration' },
  handyman:    { strategy: 'text', textQuery: 'handyman home repair service' },
  cosmetic:    { strategy: 'text', textQuery: 'mobile hair stylist senior salon spa' },
  social:      { strategy: 'text', textQuery: 'senior social club activity' },

  // --- Professional ---
  legal:       { strategy: 'text', textQuery: 'elder law attorney estate planning' },
  financial:   { strategy: 'text', textQuery: 'financial advisor benefits planning' },
  caremanage:  { strategy: 'text', textQuery: 'geriatric care manager aging life care' },
  homemod:     { strategy: 'text', textQuery: 'home modification accessibility ramps grab bars' },
  techsupport: { strategy: 'text', textQuery: 'senior computer phone tech support' },
  finmanage:   { strategy: 'text', textQuery: 'daily money manager bill paying' },
  endoflife:   { strategy: 'text', textQuery: 'end of life planning advance directive' },
  insurance:   { strategy: 'text', textQuery: 'medicare insurance agent broker' },

  // --- Products ---
  dme:         { strategy: 'text', textQuery: 'durable medical equipment DME wheelchair walker' },
  smarthome:   { strategy: 'unsupported', unsupportedReason: 'Smart home devices are best purchased online' },

  // --- Future ---
  genomics:    { strategy: 'unsupported', unsupportedReason: 'Genomics services are mail-order, not local' },
};
