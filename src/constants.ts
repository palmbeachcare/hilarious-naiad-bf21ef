import { Category, Agent, Product, FeedEvent } from './types';

export const CATEGORIES: Category[] = [
  { id: "geriatric", name: "Geriatric Medicine", icon: "🩺", group: "Medical" },
  { id: "homehealth", name: "Home Health", icon: "🏠", group: "Medical" },
  { id: "nursing", name: "Private Duty Nursing", icon: "💉", group: "Medical" },
  { id: "therapy", name: "PT/OT/Speech", icon: "🏋️", group: "Medical" },
  { id: "pharmacy", name: "Pharmacy & Meds", icon: "💊", group: "Medical" },
  { id: "dental", name: "Dental", icon: "🦷", group: "Medical" },
  { id: "vision", name: "Vision", icon: "👁️", group: "Medical" },
  { id: "hearing", name: "Hearing", icon: "👂", group: "Medical" },
  { id: "mental", name: "Mental Health", icon: "💬", group: "Medical" },
  { id: "hospice", name: "Hospice/Palliative", icon: "🕊️", group: "Medical" },
  { id: "mobilelab", name: "Mobile Lab", icon: "🧪", group: "Mobile" },
  { id: "vaccine", name: "Vaccinations", icon: "💉", group: "Mobile" },
  { id: "imaging", name: "Mobile X-Ray/US", icon: "📷", group: "Mobile" },
  { id: "mace", name: "Mobile Acute Care (MACE)", icon: "🚑", group: "Mobile" },
  { id: "rpm", name: "Telehealth & RPM", icon: "📡", group: "Tech" },
  { id: "pers", name: "Emergency Alert", icon: "🚨", group: "Tech" },
  { id: "iot", name: "Ambient IoT Sensors", icon: "📶", group: "Tech" },
  { id: "robotics", name: "Robotics & AI Care", icon: "🤖", group: "Tech" },
  { id: "techsetup", name: "Tech Setup", icon: "📱", group: "Tech" },
  { id: "vr", name: "VR Therapy/Tours", icon: "🥽", group: "Tech" },
  { id: "smartpill", name: "Smart Pill Dispensers", icon: "💊", group: "Tech" },
  { id: "blockchain", name: "Blockchain Vault", icon: "🔐", group: "Tech" },
  { id: "al", name: "Assisted Living", icon: "🏡", group: "Living" },
  { id: "snf", name: "Skilled Nursing", icon: "🏥", group: "Living" },
  { id: "memory", name: "Memory Care", icon: "🧠", group: "Living" },
  { id: "independent", name: "Independent Living", icon: "🌅", group: "Living" },
  { id: "adultday", name: "Adult Day Care", icon: "☀️", group: "Living" },
  { id: "companion", name: "Companion Care", icon: "🤝", group: "Support" },
  { id: "respite", name: "Respite", icon: "🌿", group: "Support" },
  { id: "transport", name: "Transport/NEMT", icon: "🚐", group: "Support" },
  { id: "nutrition", name: "Nutrition/Meals", icon: "🥗", group: "Support" },
  { id: "gig", name: "On-Demand Help", icon: "🙋", group: "Support" },
  { id: "petcare", name: "Pet Care/Therapy", icon: "🐕", group: "Support" },
  { id: "caregiver", name: "Caregiver Support", icon: "❤️", group: "Support" },
  { id: "legal", name: "Elder Law", icon: "⚖️", group: "Professional" },
  { id: "financial", name: "Benefits/Finance", icon: "📋", group: "Professional" },
  { id: "caremanage", name: "Geriatric Care Managers", icon: "🧭", group: "Professional" },
  { id: "homemod", name: "Home Modification", icon: "🔧", group: "Professional" },
  { id: "community", name: "Community Services", icon: "🏘️", group: "Support" },
  { id: "placement", name: "Placement Agencies", icon: "🏢", group: "Living" },
  { id: "moving", name: "Elder Moving/Relocation", icon: "📦", group: "Support" },
  { id: "events", name: "Surprise Events/Birthdays", icon: "🎉", group: "Support" },
  { id: "handyman", name: "Handyman/Home Repair", icon: "🔧", group: "Support" },
  { id: "cosmetic", name: "Hair, Spa & Massage", icon: "💇", group: "Support" },
  { id: "social", name: "Social/Anti-Isolation", icon: "🗣️", group: "Support" },
  { id: "techsupport", name: "Senior Tech Support", icon: "💻", group: "Tech" },
  { id: "finmanage", name: "Daily Money Management", icon: "💰", group: "Professional" },
  { id: "endoflife", name: "End-of-Life Planning", icon: "🌅", group: "Professional" },
  { id: "dme", name: "DME & Equipment", icon: "🦽", group: "Products" },
  { id: "smarthome", name: "Smart Home Devices", icon: "🏠", group: "Products" },
  { id: "insurance", name: "Insurance Agents", icon: "🛡️", group: "Professional" },
  { id: "genomics", name: "Genomics/Longevity", icon: "🧬", group: "Future" },
];

export const AGENTS: Agent[] = [
  { id: "med", name: "MedGuard Agent", status: "active", description: "Monitors smart pill boxes. Auto-calls patient on missed dose. Escalates to MACE if needed.", icon: "💊", color: "#D62828", actions: 3, patients: 47 },
  { id: "fall", name: "FallShield Agent", status: "active", description: "Processes ambient IoT radar data. Predicts fall risk 72hrs ahead. Auto-schedules PT and orders grab bars.", icon: "📶", color: "#E76F51", actions: 7, patients: 89 },
  { id: "cog", name: "CogWatch Agent", status: "active", description: "Analyzes voice patterns during daily check-ins. Detects early cognitive/UTI signs. Alerts care team.", icon: "🧠", color: "#6A0572", actions: 2, patients: 34 },
  { id: "supply", name: "SupplyChain Agent", status: "idle", description: "Auto-reorders DME, supplements, and supplies based on care plan. Manages billing and delivery.", icon: "📦", color: "#0096C7", actions: 0, patients: 127 },
  { id: "comply", name: "CMS Compliance Agent", status: "active", description: "Auto-generates GUIDE/ACCESS reports from patient data. Flags missing documentation.", icon: "📋", color: "#0077B6", actions: 5, patients: 89 },
  { id: "triage", name: "Triage Dispatch Agent", status: "standby", description: "Receives 24/7 calls. AI voice assessment → routes to MACE team, ER, or care navigator.", icon: "🚑", color: "#A4133C", actions: 0, patients: 347 },
  { id: "docscan", name: "DocScan AI Agent", status: "active", description: "OCR engine for IDs and insurance cards. Auto-populates profiles and verifies coverage in real-time.", icon: "📄", color: "#2d6a4f", actions: 12, patients: 156 },
  { id: "emr", name: "EMR Bridge Agent", status: "active", description: "Bi-directional sync with Epic, Cerner, and Salesforce Elixir. Maps local care data to FHIR R4 resources.", icon: "🌉", color: "#6a0572", actions: 45, patients: 890 },
];

export const PRODUCTS: Product[] = [
  { name: "Hero Smart Dispenser", brand: "Hero Health", price: "$29.99/mo", category: "Smart Pill", icon: "💊", commission: "15%", rating: 4.7, interactive: true, description: "AI pill dispenser. Syncs with ElderHub agents. Auto-alerts on missed doses." },
  { name: "ElliQ AI Companion", brand: "Intuition Robotics", price: "$250+$30/mo", category: "Robotics", icon: "🤖", commission: "10%", rating: 4.3, interactive: true, description: "Proactive AI companion. Conversation, reminders, music, video calls. Learns personality." },
  { name: "Paro Therapeutic Seal", brand: "AIST", price: "$6,120", category: "Robotics", icon: "🦭", commission: "5%", rating: 4.9, interactive: true, description: "Clinically proven robotic companion for dementia. Responds to touch, voice, light." },
  { name: "Vayyar Home Radar", brand: "Vayyar", price: "$299+$10/mo", category: "IoT Sensors", icon: "📶", commission: "12%", rating: 4.5, interactive: true, description: "No-camera fall detection + ambient monitoring via radar. Privacy-first. Detects gait changes." },
  { name: "GrandPad Senior Tablet", brand: "GrandPad", price: "$49.99/mo", category: "Smart Home", icon: "📱", commission: "10%", rating: 4.6, interactive: true, description: "Simplified tablet for seniors. Video calls, photos, music. Zero spam. Connects to ElderHub AI." },
  { name: "Omron BP Monitor", brand: "Omron", price: "$69", category: "RPM Devices", icon: "❤️", commission: "12%", rating: 4.7, interactive: false, description: "Bluetooth blood pressure monitor. Auto-syncs readings to ElderHub RPM dashboard." },
  { name: "Amazon Echo Show 15", brand: "Amazon", price: "$249", category: "Smart Home", icon: "🗣️", commission: "8%", rating: 4.5, interactive: true, description: "Voice-first care hub. Integrated with ElderHub AI for reminders and video check-ins." },
  { name: "Apple Watch Series 10", brand: "Apple", price: "$399", category: "Wearables", icon: "⌚", commission: "5%", rating: 4.8, interactive: true, description: "Advanced fall detection, ECG, and SpO2. Real-time sync with FallShield Agent." },
  { name: "Tesla Robotaxi Care", brand: "Tesla", price: "$2.50/mile", category: "Mobile", icon: "🚕", commission: "8%", rating: 4.9, interactive: true, description: "Autonomous transport with care-trained AI. Auto-dispatch for appointments. Tesla Bot assistance." },
  { name: "Uber Health Plus", brand: "Uber", price: "Varies", category: "Mobile", icon: "🚗", commission: "5%", rating: 4.6, interactive: true, description: "NEMT transport integrated with ElderHub. Real-time tracking for caregivers. HIPAA compliant." },
  { name: "Amazon Care Supply", brand: "Amazon", price: "Real-time", category: "Products", icon: "📦", commission: "Variable", rating: 4.8, interactive: true, description: "Dynamic pricing integration. Auto-reorders based on SupplyChain Agent signals." },
];

export const FEED_EVENTS: FeedEvent[] = [
  { time: "2m ago", event: "MedGuard detected missed Donepezil dose", detail: "Margaret J. — Auto-initiated empathetic phone call. Dose confirmed taken after reminder.", type: "agent", icon: "💊" },
  { time: "18m ago", event: "FallShield: Gait anomaly detected", detail: "Robert M. — Walking speed decreased 12% over 5 days. PT auto-scheduled for Tuesday. Grab bar order initiated.", type: "agent", icon: "📶" },
  { time: "34m ago", event: "New provider registered (community edit)", detail: "Jupiter Mobile Dental — Added by Dr. Sarah Kim. Pending community verification (2/3 approvals).", type: "community", icon: "🦷" },
  { time: "1h ago", event: "Product auto-dispatched via SupplyChain", detail: "Omron BP Monitor shipped to patient #2847 after RPM enrollment. Billing auto-posted to payer.", type: "agent", icon: "📦" },
];

// Outbound links to FLEC's clinical conversion surface (palmbeachcare.com).
// Centralized so URL changes are a one-file edit. Use through withUtm()
// from ../lib/utm so attribution parameters are appended correctly.
export const FLEC_LINKS = {
  // PLACEHOLDER — to be replaced with the real PBC scheduling URL.
  // Currently routes to the homepage so clicks don't 404 in case this
  // ships before the real URL is wired.
  scheduleCareNavigator: 'https://palmbeachcare.com/contact',
  homepage: 'https://palmbeachcare.com',
};
