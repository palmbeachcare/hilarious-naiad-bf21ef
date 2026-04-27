// UTM tagging for outbound links from ElderHub to palmbeachcare.com.
// Centralized here so we never spell utm_campaign wrong by hand and so
// the parameter conventions are consistent across the codebase.
//
// PBC's WordPress + Salesforce side captures these via hidden form
// fields (see PBC integration handoff doc) and writes them to the Lead
// record's source fields. This is what lets us answer:
//   "How many leads converted that originated from ElderHub Memory Care
//    searches in the 33470 ZIP?"
// Without UTMs the lead source on PBC is blank — attribution dies.

export interface UtmContext {
  /** FLEC category id, e.g. 'memory', 'homehealth' */
  campaign?: string;
  /** ZIP or city the user was searching in */
  term?: string;
  /** Where on the page the click came from, e.g. 'cta-banner', 'cta-inline' */
  content?: string;
}

const SOURCE = 'elderhub';
const MEDIUM = 'referral';

/**
 * Append UTM parameters to an outbound URL. Preserves any existing
 * query string and fragment, skips empty context fields rather than
 * emitting empty params (e.g. no `&utm_term=`), and URL-encodes values.
 */
export function withUtm(url: string, ctx: UtmContext = {}): string {
  // Use the URL constructor for correct handling of existing query
  // strings, fragments, and edge characters. Falls back to string
  // concatenation if URL construction fails (e.g. malformed input);
  // failing-open on a CTA link is preferable to throwing.
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }

  u.searchParams.set('utm_source', SOURCE);
  u.searchParams.set('utm_medium', MEDIUM);
  if (ctx.campaign) u.searchParams.set('utm_campaign', ctx.campaign);
  if (ctx.term) u.searchParams.set('utm_term', ctx.term);
  if (ctx.content) u.searchParams.set('utm_content', ctx.content);

  return u.toString();
}
