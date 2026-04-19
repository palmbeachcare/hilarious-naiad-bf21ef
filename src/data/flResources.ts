// Florida statewide agency resources for each ElderHub category.
// URLs verified live April 2026. Tier A = clean FL agency fit (3 links each).
// Tier B = partial fit (agency + nonprofit/trade mix). Tier C = no authoritative
// FL agency source — shows "Coming soon" in the UI.

export interface FLResource {
  name: string;
  url: string;
  description: string;
  agency: string;
}

export interface CategoryResourceEntry {
  tier: 'A' | 'B' | 'C';
  resources: FLResource[];
  note?: string;
}

const ELDER_HELPLINE = {
  name: 'Florida Elder Helpline (1-800-96-ELDER)',
  url: 'https://elderaffairs.org/',
  description: 'Statewide helpline connecting older Floridians to aging services via 11 Area Agencies on Aging.',
  agency: 'Florida Department of Elder Affairs',
};

const SHINE = {
  name: 'SHINE — Serving Health Insurance Needs of Elders',
  url: 'https://www.floridashine.org/',
  description: 'Free, unbiased volunteer counseling on Medicare, Medigap, Part D, and long-term care insurance.',
  agency: 'Florida DOEA / Area Agencies on Aging',
};

const AHCA_LICENSURE = {
  name: 'AHCA Health Quality Assurance Licensure Forms',
  url: 'https://ahca.myflorida.com/health-quality-assurance/hqa-applications-for-licensure',
  description: 'Licensure requirements and applications for every regulated FL health care provider type.',
  agency: 'Florida Agency for Health Care Administration',
};

const FL_HEALTH_FINDER = {
  name: 'FloridaHealthFinder — Locate & Compare Facilities',
  url: 'https://quality.healthfinder.fl.gov',
  description: 'Consumer tool to search and compare licensed FL health care providers, inspection reports, and ratings.',
  agency: 'AHCA',
};

const SMMC_LTC = {
  name: 'Statewide Medicaid Managed Care — Long-Term Care Program',
  url: 'https://ahca.myflorida.com/medicaid/statewide-medicaid-managed-care/long-term-care-program',
  description: 'FL Medicaid program covering nursing home, assisted living, and home and community-based LTC services.',
  agency: 'AHCA',
};

const DOEA_PROGRAMS = {
  name: 'DOEA Programs & Services',
  url: 'https://elderaffairs.org/programs-and-services/',
  description: 'Master index of FL statewide programs for seniors — CCE, OAA, ADI, CARES, SHINE, and more.',
  agency: 'Florida Department of Elder Affairs',
};

export const FL_RESOURCES: Record<string, CategoryResourceEntry> = {
  // ========== TIER A — Medical (10) ==========
  geriatric: {
    tier: 'A',
    resources: [
      DOEA_PROGRAMS,
      {
        name: 'Florida Alzheimer\'s Center of Excellence (FACE)',
        url: 'https://elderaffairs.org/programs-services/bureau-of-elder-rights/',
        description: 'Care Navigator program for Floridians with Alzheimer\'s / related dementias — 1-800-96-ELDER.',
        agency: 'Florida DOEA',
      },
      FL_HEALTH_FINDER,
    ],
  },

  homehealth: {
    tier: 'A',
    resources: [
      {
        name: 'Compare Florida Home Health Agencies',
        url: 'https://quality.healthfinder.fl.gov/compare-tools/HHA',
        description: 'Search and compare licensed home health agencies by county, name, or proximity.',
        agency: 'AHCA',
      },
      AHCA_LICENSURE,
      SMMC_LTC,
    ],
  },

  nursing: {
    tier: 'A',
    resources: [
      AHCA_LICENSURE,
      SMMC_LTC,
      FL_HEALTH_FINDER,
    ],
  },

  therapy: {
    tier: 'A',
    resources: [
      SMMC_LTC,
      AHCA_LICENSURE,
      DOEA_PROGRAMS,
    ],
  },

  pharmacy: {
    tier: 'A',
    resources: [
      {
        name: 'Florida Board of Pharmacy',
        url: 'https://floridaspharmacy.gov/',
        description: 'Licensure, regulation, and consumer verification for pharmacists and pharmacies in Florida.',
        agency: 'FL Department of Health',
      },
      SHINE,
      {
        name: 'Florida Medicaid Preferred Drug List (PDL)',
        url: 'https://ahca.myflorida.com/medicaid/prescribed-drug/pharmacy-services',
        description: 'Current FL Medicaid covered drugs, prior authorization criteria, and pharmacy services policy.',
        agency: 'AHCA',
      },
    ],
  },

  dental: {
    tier: 'A',
    resources: [
      {
        name: 'Statewide Medicaid Managed Care — Dental',
        url: 'https://www.flmedicaidmanagedcare.com/',
        description: 'FL Medicaid dental plans for eligible adults. Compare plans and enroll via the member portal.',
        agency: 'AHCA',
      },
      FL_HEALTH_FINDER,
      DOEA_PROGRAMS,
    ],
  },

  vision: {
    tier: 'A',
    resources: [
      {
        name: 'Florida Division of Blind Services',
        url: 'https://dbs.fldoe.org/',
        description: 'Rehabilitation, independent living, and assistive technology services for FL residents with vision loss.',
        agency: 'FL Department of Education',
      },
      SMMC_LTC,
      {
        name: 'FL Medicaid SMMC — Find a Health Plan',
        url: 'https://www.flmedicaidmanagedcare.com/',
        description: 'Compare Medicaid managed care plans — most include routine vision exams and eyewear for adults.',
        agency: 'AHCA',
      },
    ],
  },

  hearing: {
    tier: 'A',
    resources: [
      {
        name: 'Florida Alliance for Assistive Services & Technology (FAAST)',
        url: 'https://faast.org/',
        description: 'Assistive technology demos, loans, and funding — including hearing aids and amplified devices.',
        agency: 'FAAST (state-designated AT program)',
      },
      SMMC_LTC,
      {
        name: 'Florida Department of Health — Audiology Licensure',
        url: 'https://www.floridahealth.gov/licensing-and-regulation/audiology/',
        description: 'Verify FL audiologist licenses, file complaints, and find regulated hearing aid specialists.',
        agency: 'FL Department of Health',
      },
    ],
  },

  mental: {
    tier: 'A',
    resources: [
      {
        name: 'DCF Substance Abuse & Mental Health (SAMH)',
        url: 'https://www.myflfamilies.com/services/samh',
        description: 'Statewide mental health and substance abuse services, crisis lines, and treatment provider directory.',
        agency: 'FL Department of Children and Families',
      },
      {
        name: 'NAMI Florida',
        url: 'https://namiflorida.org/',
        description: 'Statewide chapter of the National Alliance on Mental Illness — support groups, education, advocacy.',
        agency: 'NAMI Florida (nonprofit)',
      },
      {
        name: 'Hope for Healing Florida',
        url: 'https://hopeforhealingfl.com/',
        description: 'Governor\'s office campaign directing Floridians to mental health and substance use resources.',
        agency: 'State of Florida',
      },
    ],
  },

  hospice: {
    tier: 'A',
    resources: [
      {
        name: 'AHCA — Hospice Licensure & Regulation',
        url: 'https://ahca.myflorida.com/health-quality-assurance/bureau-of-health-facility-regulation/long-term-care-services-unit/hospice',
        description: 'FL hospice licensure requirements, survey reports, and Certificate of Need documentation.',
        agency: 'AHCA',
      },
      {
        name: 'Florida Hospice & Palliative Care Association',
        url: 'https://www.floridahospices.org/',
        description: 'Statewide trade association — find a FL hospice, learn about palliative care, advance directives.',
        agency: 'FL Hospices (trade association)',
      },
      FL_HEALTH_FINDER,
    ],
  },

  // ========== TIER A — Mobile (1) ==========
  vaccine: {
    tier: 'A',
    resources: [
      {
        name: 'FL DOH — Adult & Travel Immunizations',
        url: 'https://www.floridahealth.gov/programs-and-services/immunization/vaccines-for-adults/index.html',
        description: 'Adult vaccine recommendations, where to get vaccinated, and FL immunization schedule.',
        agency: 'Florida Department of Health',
      },
      {
        name: 'FL DOH — Immunizations Program',
        url: 'https://www.floridahealth.gov/individual-family-health/immunization/',
        description: 'Program overview, records access, and county health department vaccination locations.',
        agency: 'Florida Department of Health',
      },
      SHINE,
    ],
  },

  // ========== TIER A — Living (6) ==========
  al: {
    tier: 'A',
    resources: [
      AHCA_LICENSURE,
      FL_HEALTH_FINDER,
      {
        name: 'FL Long-Term Care Ombudsman Program',
        url: 'https://ombudsman.elderaffairs.org/',
        description: 'Advocates for residents of ALs, nursing homes, and adult family care homes. File a complaint or request a visit.',
        agency: 'FL DOEA',
      },
    ],
  },

  snf: {
    tier: 'A',
    resources: [
      FL_HEALTH_FINDER,
      {
        name: 'FL Long-Term Care Ombudsman Program',
        url: 'https://ombudsman.elderaffairs.org/',
        description: 'Free advocacy for FL nursing home residents. Investigates complaints, monitors facilities.',
        agency: 'FL DOEA',
      },
      SMMC_LTC,
    ],
  },

  memory: {
    tier: 'A',
    resources: [
      {
        name: 'DOEA — Alzheimer\'s Disease Initiative (ADI)',
        url: 'https://elderaffairs.org/programs-and-services/alzheimers-disease-initiative-adi/',
        description: 'Respite care, caregiver training, Memory Disorder Clinics, and Brain Bank — delivered via the 11 AAAs.',
        agency: 'FL DOEA',
      },
      {
        name: 'Alzheimer\'s Association — Southeast Florida',
        url: 'https://www.alz.org/seflorida',
        description: '24/7 Helpline (800-272-3900), caregiver support, clinical trials, and community education.',
        agency: 'Alzheimer\'s Association (nonprofit)',
      },
      {
        name: 'Florida Alzheimer\'s Center of Excellence (FACE)',
        url: 'https://elderaffairs.org/programs-services/bureau-of-elder-rights/',
        description: 'Care Navigator program for people with dementia and their caregivers — holistic, no-wrong-door model.',
        agency: 'FL DOEA',
      },
    ],
  },

  independent: {
    tier: 'A',
    resources: [
      {
        name: 'Florida Housing Finance Corporation',
        url: 'https://www.floridahousing.org/',
        description: 'Affordable senior housing programs, rental assistance, and state-financed age-restricted communities.',
        agency: 'FL Housing Finance Corporation',
      },
      {
        name: 'HUD — Florida Senior Housing Resources',
        url: 'https://www.hud.gov/states/florida/renting/seniors',
        description: 'Section 202 Supportive Housing, subsidized senior apartments, and FL HUD field office contacts.',
        agency: 'U.S. HUD / FL field offices',
      },
      DOEA_PROGRAMS,
    ],
  },

  adultday: {
    tier: 'A',
    resources: [
      AHCA_LICENSURE,
      FL_HEALTH_FINDER,
      DOEA_PROGRAMS,
    ],
  },

  placement: {
    tier: 'A',
    resources: [
      FL_HEALTH_FINDER,
      {
        name: 'FL Long-Term Care Ombudsman Program',
        url: 'https://ombudsman.elderaffairs.org/',
        description: 'Before choosing an AL or nursing home, review Ombudsman complaint data and facility history.',
        agency: 'FL DOEA',
      },
      ELDER_HELPLINE,
    ],
  },

  // ========== TIER A — Support (6) ==========
  companion: {
    tier: 'A',
    resources: [
      {
        name: 'AHCA — Homemaker & Companion Services Registration',
        url: 'https://ahca.myflorida.com/health-quality-assurance/hqa-applications-for-licensure',
        description: 'Registration and regulation of FL Homemaker & Companion Services providers.',
        agency: 'AHCA',
      },
      ELDER_HELPLINE,
      DOEA_PROGRAMS,
    ],
  },

  respite: {
    tier: 'A',
    resources: [
      {
        name: 'DOEA — Alzheimer\'s Disease Initiative (ADI) Respite',
        url: 'https://elderaffairs.org/programs-and-services/alzheimers-disease-initiative-adi/',
        description: 'In-home, adult day, emergency, and up-to-30-day extended respite for caregivers of people with dementia.',
        agency: 'FL DOEA',
      },
      {
        name: 'DOEA — Respite for Elders Living in Everyday Families (RELIEF)',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Volunteer in-home respite to support families caring for homebound elderly loved ones.',
        agency: 'FL DOEA',
      },
      ELDER_HELPLINE,
    ],
  },

  transport: {
    tier: 'A',
    resources: [
      {
        name: 'FL Commission for the Transportation Disadvantaged',
        url: 'https://ctd.fdot.gov/',
        description: 'Statewide program ensuring transportation for elders, disabled, and low-income Floridians — county CTCs.',
        agency: 'FL Department of Transportation',
      },
      SMMC_LTC,
      ELDER_HELPLINE,
    ],
  },

  nutrition: {
    tier: 'A',
    resources: [
      {
        name: 'DOEA — Elderly Nutrition Program (OAA Title IIIC)',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Home-delivered meals, congregate dining, and nutrition counseling via 11 Area Agencies on Aging.',
        agency: 'FL DOEA',
      },
      {
        name: 'Meals on Wheels America — FL Locator',
        url: 'https://www.mealsonwheelsamerica.org/find-meals-and-services/',
        description: 'Find your local FL Meals on Wheels provider by ZIP code.',
        agency: 'Meals on Wheels America',
      },
      {
        name: 'FL DCF — SNAP (Food Stamps) / ACCESS',
        url: 'https://www.myflfamilies.com/services/public-assistance/access-florida',
        description: 'Apply for SNAP, Medicaid, TANF, and other public assistance via the ACCESS Florida portal.',
        agency: 'FL DCF',
      },
    ],
  },

  caregiver: {
    tier: 'A',
    resources: [
      {
        name: 'DOEA — National Family Caregiver Support Program (NFCSP)',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Information, counseling, training, respite, and supplemental services for family caregivers.',
        agency: 'FL DOEA',
      },
      {
        name: 'Alzheimer\'s Association — Caregiver Support',
        url: 'https://www.alz.org/seflorida',
        description: '24/7 Helpline, support groups, online training (essentiALZ), and care consultations.',
        agency: 'Alzheimer\'s Association',
      },
      {
        name: 'VA Caregiver Support Program',
        url: 'https://www.caregiver.va.gov/',
        description: 'Federal caregiver support for family members of eligible veterans — stipends, respite, training.',
        agency: 'U.S. Department of Veterans Affairs',
      },
    ],
  },

  community: {
    tier: 'A',
    resources: [
      {
        name: '211 Florida',
        url: 'https://www.211.org/',
        description: 'Free, confidential, 24/7 referral to FL community services — food, housing, utilities, health.',
        agency: 'United Way / 211',
      },
      ELDER_HELPLINE,
      DOEA_PROGRAMS,
    ],
  },

  // ========== TIER A — Professional (7) ==========
  legal: {
    tier: 'A',
    resources: [
      {
        name: 'FL Bar Lawyer Referral Service',
        url: 'https://www.floridabar.org/public/lrs/',
        description: '$25 half-hour initial consultation with a FL attorney. Statewide referral, including elder law panel.',
        agency: 'The Florida Bar',
      },
      {
        name: 'Elder Law Section of the Florida Bar',
        url: 'https://eldersection.org/',
        description: 'Find a Florida Bar Board Certified Elder Law attorney — wills, trusts, Medicaid planning, guardianship.',
        agency: 'The Florida Bar',
      },
      {
        name: 'DOEA — Senior Legal Helpline',
        url: 'https://law.elderaffairs.org/legal-services/',
        description: 'Free legal advice for Floridians 60+ via Bay Area Legal Services (888-895-7873).',
        agency: 'FL DOEA',
      },
    ],
  },

  financial: {
    tier: 'A',
    resources: [
      SHINE,
      {
        name: 'FL DCF — ACCESS Florida (Medicaid, SNAP, TANF)',
        url: 'https://www.myflfamilies.com/services/public-assistance/access-florida',
        description: 'Apply for and manage public benefits — Medicaid eligibility, SNAP, TANF, refugee assistance.',
        agency: 'FL DCF',
      },
      {
        name: 'Social Security Administration',
        url: 'https://www.ssa.gov/',
        description: 'Apply for Social Security retirement, SSDI, SSI, and Medicare enrollment.',
        agency: 'U.S. Social Security Administration',
      },
    ],
  },

  caremanage: {
    tier: 'A',
    resources: [
      {
        name: 'DOEA — Aging & Disability Resource Centers (ADRCs)',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'No-wrong-door access to LTC, case management, and benefits via the 11 AAAs.',
        agency: 'FL DOEA',
      },
      SMMC_LTC,
      {
        name: 'Aging Life Care Association — Find a Care Manager',
        url: 'https://www.aginglifecare.org/',
        description: 'Directory of certified geriatric care managers (private pay) serving Florida.',
        agency: 'Aging Life Care Assn (professional body)',
      },
    ],
  },

  homemod: {
    tier: 'A',
    resources: [
      {
        name: 'Rebuilding Together — Find a Florida Affiliate',
        url: 'https://rebuildingtogether.org/find-your-community/',
        description: 'Free critical home repairs and accessibility modifications for low-income, elderly, and disabled homeowners.',
        agency: 'Rebuilding Together (national nonprofit)',
      },
      {
        name: 'USDA Section 504 Home Repair Program',
        url: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants/fl',
        description: 'Loans and grants for very low-income rural FL homeowners to repair or modify their homes.',
        agency: 'USDA Rural Development',
      },
      DOEA_PROGRAMS,
    ],
  },

  finmanage: {
    tier: 'A',
    resources: [
      {
        name: 'FL Office of Public and Professional Guardians',
        url: 'https://elderaffairs.org/programs-services/office-of-public-and-professional-guardians/',
        description: 'Registration and oversight of FL professional guardians. File guardian complaints (1-855-305-3030).',
        agency: 'FL DOEA',
      },
      {
        name: 'FL Department of Financial Services — Consumer Services',
        url: 'https://www.myfloridacfo.com/division/consumers',
        description: 'Consumer help line and complaint process for insurance, annuities, and financial fraud.',
        agency: 'FL CFO / DFS',
      },
      SHINE,
    ],
  },

  endoflife: {
    tier: 'A',
    resources: [
      {
        name: 'FL Bar — Advance Directives (Living Will, Health Care Surrogate)',
        url: 'https://www.floridabar.org/public/consumer/tip014/',
        description: 'Consumer pamphlet with FL-statute-compliant forms for living wills and health care surrogate designation.',
        agency: 'The Florida Bar',
      },
      {
        name: 'FL Hospice & Palliative Care Association',
        url: 'https://www.floridahospices.org/',
        description: 'Find FL hospices and learn about palliative care, advance care planning, and end-of-life choices.',
        agency: 'FL Hospices (trade association)',
      },
      {
        name: 'FL DOH — Do Not Resuscitate Orders (Form 1896)',
        url: 'https://www.floridahealth.gov/licensing-and-regulation/ems-prehospital/do-not-resuscitate.html',
        description: 'Official FL DNR order form, requirements, and instructions for prehospital EMS honoring.',
        agency: 'FL Department of Health',
      },
    ],
  },

  insurance: {
    tier: 'A',
    resources: [
      SHINE,
      {
        name: 'FL Department of Financial Services — Insurance Consumer Help',
        url: 'https://www.myfloridacfo.com/division/consumers/insurance',
        description: 'File a complaint, verify an agent\'s license, and get unbiased insurance info from the FL CFO\'s office.',
        agency: 'FL CFO / DFS',
      },
      {
        name: 'Medicare.gov — Find Plans in Florida',
        url: 'https://www.medicare.gov/plan-compare',
        description: 'Compare Medicare Advantage, Part D, and Medigap plans by ZIP. Use with a free SHINE counselor.',
        agency: 'CMS',
      },
    ],
  },

  // ========== TIER A — Products (1) ==========
  dme: {
    tier: 'A',
    resources: [
      {
        name: 'Florida Alliance for Assistive Services & Technology (FAAST)',
        url: 'https://faast.org/',
        description: 'AT demos, device reutilization (free used DME), loan library, and low-interest financing.',
        agency: 'FAAST',
      },
      {
        name: 'AHCA — Home Medical Equipment Licensure',
        url: 'https://ahca.myflorida.com/health-quality-assurance/hqa-applications-for-licensure',
        description: 'Licensing for FL Home Medical Equipment Providers — verify a supplier before purchase.',
        agency: 'AHCA',
      },
      SMMC_LTC,
    ],
  },

  // ========== TIER B — partial fit ==========
  mobilelab: {
    tier: 'B',
    resources: [
      {
        name: 'AHCA — Clinical Laboratory Licensure',
        url: 'https://ahca.myflorida.com/health-quality-assurance/hqa-applications-for-licensure',
        description: 'FL clinical lab licensure requirements — verify a mobile draw service is properly licensed.',
        agency: 'AHCA',
      },
      {
        name: 'CMS — CLIA Certification Lookup',
        url: 'https://www.cms.gov/medicare/quality/clinical-laboratory-improvement-amendments',
        description: 'Federal Clinical Laboratory Improvement Amendments program — required for all US clinical labs.',
        agency: 'CMS',
      },
      FL_HEALTH_FINDER,
    ],
  },

  imaging: {
    tier: 'B',
    resources: [
      {
        name: 'FL DOH — Radiation Control Program',
        url: 'https://www.floridahealth.gov/environmental-health/radiation-control/',
        description: 'Registration and regulation of FL X-ray equipment and machine operators, including mobile units.',
        agency: 'FL Department of Health',
      },
      AHCA_LICENSURE,
      FL_HEALTH_FINDER,
    ],
  },

  mace: {
    tier: 'B',
    resources: [
      {
        name: 'CMS — Acute Hospital Care at Home',
        url: 'https://www.cms.gov/medicare/quality/acute-hospital-care-home',
        description: 'Federal waiver program allowing hospital-level acute care delivered in the patient\'s home.',
        agency: 'CMS',
      },
      AHCA_LICENSURE,
      ELDER_HELPLINE,
    ],
  },

  rpm: {
    tier: 'B',
    resources: [
      {
        name: 'Medicare — Telehealth Services',
        url: 'https://www.medicare.gov/coverage/telehealth',
        description: 'What Medicare covers for telehealth, RPM, and remote therapeutic monitoring for FL beneficiaries.',
        agency: 'CMS',
      },
      {
        name: 'FL Medicaid — Telehealth Policy',
        url: 'https://ahca.myflorida.com/medicaid/prescribed-drug/pharmacy-services',
        description: 'FL Medicaid telehealth coverage, billing codes, and provider enrollment requirements.',
        agency: 'AHCA',
      },
      AHCA_LICENSURE,
    ],
  },

  pers: {
    tier: 'B',
    resources: [
      {
        name: 'DOEA — Community Care for the Elderly (CCE)',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'CCE-funded PERS (Personal Emergency Response System) for eligible Floridians — apply via local AAA.',
        agency: 'FL DOEA',
      },
      {
        name: 'FTC — Consumer Guide to Medical Alert Systems',
        url: 'https://consumer.ftc.gov/articles/medical-alert-systems',
        description: 'Federal consumer protection guide — avoid PERS scams, understand contracts, compare features.',
        agency: 'U.S. Federal Trade Commission',
      },
      ELDER_HELPLINE,
    ],
  },

  techsetup: {
    tier: 'B',
    resources: [
      {
        name: 'FAAST — Device Loan & Demo Program',
        url: 'https://faast.org/',
        description: 'Borrow or try assistive tech (tablets, adapted phones, hearing devices) before purchasing.',
        agency: 'FAAST',
      },
      {
        name: 'AARP — Technology for Older Adults',
        url: 'https://www.aarp.org/home-family/personal-technology/',
        description: 'Setup guides, how-tos, and recommendations for older adults using smartphones, tablets, and PCs.',
        agency: 'AARP (nonprofit)',
      },
      ELDER_HELPLINE,
    ],
  },

  gig: {
    tier: 'B',
    resources: [
      {
        name: '211 Florida',
        url: 'https://www.211.org/',
        description: 'Dial 211 for on-demand referrals to local volunteer help, chore services, and short-term support.',
        agency: 'United Way / 211',
      },
      ELDER_HELPLINE,
      DOEA_PROGRAMS,
    ],
  },

  moving: {
    tier: 'B',
    resources: [
      {
        name: 'National Association of Senior Move Managers (NASMM)',
        url: 'https://www.nasmm.org/find/',
        description: 'Find a certified Senior Move Manager in Florida — right-sizing, relocation, and estate dispersal.',
        agency: 'NASMM (trade association)',
      },
      {
        name: 'Rebuilding Together — Find a FL Affiliate',
        url: 'https://rebuildingtogether.org/find-your-community/',
        description: 'Some FL affiliates help with decluttering and home readiness as part of aging-in-place services.',
        agency: 'Rebuilding Together',
      },
      {
        name: '211 Florida',
        url: 'https://www.211.org/',
        description: 'Referrals to local nonprofits that assist with moving, storage, and furniture for seniors.',
        agency: 'United Way / 211',
      },
    ],
  },

  events: {
    tier: 'B',
    resources: [
      {
        name: 'DOEA — Senior Centers & Livable Communities',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Find senior centers, age-friendly community events, and social programs across FL\'s 67 counties.',
        agency: 'FL DOEA',
      },
      {
        name: '211 Florida',
        url: 'https://www.211.org/',
        description: 'Dial 211 to find local senior center events, birthday clubs, and community celebrations.',
        agency: 'United Way / 211',
      },
      ELDER_HELPLINE,
    ],
  },

  handyman: {
    tier: 'B',
    resources: [
      {
        name: 'Rebuilding Together — Find a FL Affiliate',
        url: 'https://rebuildingtogether.org/find-your-community/',
        description: 'Free critical home repairs — roofing, plumbing, accessibility, safety — for low-income elderly homeowners.',
        agency: 'Rebuilding Together',
      },
      {
        name: 'USDA Section 504 Home Repair Program',
        url: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants/fl',
        description: 'Loans (up to $40K) and grants (up to $10K for age 62+) for very low-income rural FL homeowners.',
        agency: 'USDA Rural Development',
      },
      DOEA_PROGRAMS,
    ],
  },

  cosmetic: {
    tier: 'B',
    resources: [
      {
        name: 'DOEA — Senior Centers & Livable Communities',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Many FL senior centers host beauty days, wellness spa events, and licensed stylist visits.',
        agency: 'FL DOEA',
      },
      {
        name: '211 Florida',
        url: 'https://www.211.org/',
        description: 'Dial 211 for free or reduced-cost personal care services — including mobile barbers and stylists.',
        agency: 'United Way / 211',
      },
      ELDER_HELPLINE,
    ],
  },

  social: {
    tier: 'B',
    resources: [
      {
        name: 'AARP Foundation — Friendly Voice Program',
        url: 'https://connect2affect.org/',
        description: 'Free weekly friendly phone calls to combat social isolation. Research-backed loneliness intervention.',
        agency: 'AARP Foundation',
      },
      {
        name: 'DOEA — Senior Centers & Livable Communities',
        url: 'https://elderaffairs.org/programs-and-services/',
        description: 'Congregate dining, social programming, and peer connection via FL\'s network of senior centers.',
        agency: 'FL DOEA',
      },
      ELDER_HELPLINE,
    ],
  },

  techsupport: {
    tier: 'B',
    resources: [
      {
        name: 'Senior Planet (OATS / AARP)',
        url: 'https://seniorplanet.org/',
        description: 'Free technology classes, hotline (920-666-1959), and online programs for adults 60+.',
        agency: 'OATS / AARP (nonprofit)',
      },
      {
        name: 'AARP — Technology for Older Adults',
        url: 'https://www.aarp.org/home-family/personal-technology/',
        description: 'Step-by-step guides, video tutorials, and a tech support phone line for AARP members.',
        agency: 'AARP',
      },
      {
        name: 'FAAST',
        url: 'https://faast.org/',
        description: 'Assistive technology training and support — including for seniors with vision, hearing, or motor challenges.',
        agency: 'FAAST',
      },
    ],
  },

  smarthome: {
    tier: 'B',
    resources: [
      {
        name: 'FAAST — Device Demo & Loan Library',
        url: 'https://faast.org/',
        description: 'Try smart home and assistive tech devices before buying. Free short-term loans available statewide.',
        agency: 'FAAST',
      },
      {
        name: 'AARP Home Fit Guide',
        url: 'https://www.aarp.org/livable-communities/housing/info-2020/homefit-guide.html',
        description: 'Research-based guide to modifying any home for aging in place — includes smart device recommendations.',
        agency: 'AARP',
      },
      DOEA_PROGRAMS,
    ],
  },

  // ========== TIER C — "Coming Soon" (no authoritative FL agency source) ==========
  iot: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers ambient IoT sensors. Community-contributed resources coming soon.',
    resources: [],
  },

  robotics: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers consumer robotics. Community-contributed resources coming soon.',
    resources: [],
  },

  vr: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers VR therapy. Community-contributed resources coming soon.',
    resources: [],
  },

  smartpill: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers smart pill dispensers. Community-contributed resources coming soon.',
    resources: [],
  },

  blockchain: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers blockchain health records. Community-contributed resources coming soon.',
    resources: [],
  },

  petcare: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers pet care or pet therapy for elders. Community-contributed resources coming soon.',
    resources: [],
  },

  genomics: {
    tier: 'C',
    note: 'No authoritative Florida statewide agency covers consumer genomics. Community-contributed resources coming soon.',
    resources: [],
  },
};

// Helper to get resources for a category ID. Returns null if the category has
// no entry (shouldn't happen once data is complete, but keeps UI defensive).
export function getResourcesForCategory(categoryId: string): CategoryResourceEntry | null {
  return FL_RESOURCES[categoryId] ?? null;
}
