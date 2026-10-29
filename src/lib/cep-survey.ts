/**
 * Real, field-collected CEP survey data.
 *
 * Source: `public/data/cep_survey_responses_pan_india.csv` — real responses
 * collected via the pan-India community engagement questionnaire. This module
 * parses the CSV on the client (the app has no backend) and exposes typed
 * access plus small aggregation helpers used by the CEP page.
 *
 * NOTE: responses may contain a small number of out-of-schema values from
 * real-world collection; those are kept verbatim and bucketed under "Other"
 * rather than silently dropped.
 */

export type CepSurveyRecord = {
  id: number;
  name: string;
  ageGroup: string;
  occupation: string;
  location: string;
  city: string;
  state: string;
  familiarity: string;
  pastParticipation: string;
  communityProblems: string[];
  highestPriority: string;
  canNgosHelp: string;
  localNgoAwareness: string;
  usefulSupport: string[];
  volunteeredBefore: string;
  volunteerEncouragements: string[];
  barriers: string[];
  trustFactors: string[];
  publishWorkOnline: string;
  useWebsite: string;
  websiteInfoNeeded: string[];
  onlineFormPreference: string;
  onlineEventReg: string;
  donationTransparency: string;
  staffDashboard: string;
  digitalTracking: string;
  usefulMgmtFeatures: string[];
  manualDifficulties: string[];
  primaryDevice: string;
  usefulWebsiteFeatures: string;
  moreLikelyParticipate: string;
  improvementsNeeded: string;
  infoSharingConcerns: string;
  otherSuggestions: string;
};

export const CEP_CSV_URL = "/data/cep_survey_responses_pan_india.csv";

/* ------------------------------------------------------------------ */
/* CSV parsing (RFC-4180-ish: quoted fields, escaped "" quotes, CRLF)  */
/* ------------------------------------------------------------------ */

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore (CRLF)
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Drop header and any fully-empty lines
  return rows.filter(
    (r) => r.length > 1 || (r.length === 1 && r[0].trim() !== "")
  );
}

function parseListField(raw: string): string[] {
  const s = (raw ?? "").trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v).trim()).filter(Boolean);
      }
    } catch {
      // fall through to manual split below
    }
  }
  return s
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((v) => v.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
}

function splitLocation(location: string): { city: string; state: string } {
  const parts = location
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { city: "", state: "" };
  const state = parts[parts.length - 1];
  const city = parts.length >= 2 ? parts[parts.length - 2] : state;
  return { city, state };
}

/* ------------------------------------------------------------------ */
/* Ordinal orderings for likert-style questions                        */
/* ------------------------------------------------------------------ */

export const AGE_BUCKETS = ["Below 18", "18–25", "26–40", "41–60", "Above 60"];

export const FAMILIARITY_ORDER = [
  "Very familiar",
  "Somewhat familiar",
  "Heard about them",
  "Not familiar",
];

export const PARTICIPATION_ORDER = [
  "Yes, regularly",
  "Yes, occasionally",
  "No, but interested",
  "No",
];

export const HELP_ORDER = [
  "Yes, significantly",
  "Yes, to some extent",
  "Not sure",
  "No",
];

export const AWARENESS_ORDER = [
  "Very aware",
  "Somewhat aware",
  "Know only a few",
  "Not aware",
];

export const YES_NO_ORDER = ["Yes", "No"];

export const VISIT_ORDER = ["Definitely", "Probably", "Not sure", "Probably not", "No"];

export const PREFERENCE_ORDER = ["Yes", "Maybe", "No preference", "No"];

export const IMPORTANCE_ORDER = [
  "Extremely important",
  "Very important",
  "Important",
  "Somewhat important",
  "Not important",
];

export const AGREEMENT_ORDER = [
  "Strongly agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly disagree",
];

export const IMPACT_ORDER = [
  "Yes, significantly",
  "Yes, somewhat",
  "Not sure",
  "No difference",
];

export const PRIORITY_ORDER = [
  "Employment and skill development",
  "Education",
  "Healthcare",
  "Food and basic needs",
  "Environment",
];

export const DEVICE_ORDER = ["Smartphone", "Laptop or desktop", "Tablet", "Other", "Unspecified"];

/**
 * Count `values` and lay the result out according to `order`.
 * Values not present in `order` are appended (preserving frequency)
 * so nothing collected in the field is discarded.
 */
export function orderedCount(values: string[], order: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v && v.trim() ? v.trim() : "Unspecified";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const out: { name: string; count: number }[] = [];
  for (const name of order) {
    if (counts.has(name)) {
      out.push({ name, count: counts.get(name)! });
      counts.delete(name);
    }
  }
  for (const [name, count] of counts) {
    out.push({ name, count });
  }
  return out;
}

/** Aggregate multi-select answers across all respondents. */
export function tallyList(
  records: CepSurveyRecord[],
  pick: (r: CepSurveyRecord) => string[]
) {
  const counts = new Map<string, number>();
  let selections = 0;
  for (const r of records) {
    const items = pick(r);
    selections += items.length;
    for (const item of items) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }
  let top: { name: string; count: number }[] = [];
  for (const [name, count] of counts) {
    top.push({ name, count });
  }
  top.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return { total: top.reduce((s, t) => s + t.count, 0), selections, top };
}

/* ------------------------------------------------------------------ */
/* Loader                                                              */
/* ------------------------------------------------------------------ */

let cache: Promise<CepSurveyRecord[]> | null = null;

function toRecord(header: string[], cells: string[]): CepSurveyRecord | null {
  const col = (name: string) => {
    const idx = header.indexOf(name);
    return idx >= 0 ? (cells[idx] ?? "").trim() : "";
  };
  const list = (name: string) => parseListField(col(name));

  const id = Number.parseInt(col("ID"), 10);
  if (!Number.isFinite(id)) return null;

  const location = col("Q3 Location");
  const { city, state } = splitLocation(location);

  const device = col("Q25 Primary Device");
  const ngoHelp = col("Q8 Can NGOs Help");

  return {
    id,
    name: col("Name"),
    ageGroup: col("Q1 Age Group"),
    occupation: col("Q2 Occupation"),
    location,
    city,
    state,
    familiarity: col("Q4 NGO Familiarity"),
    pastParticipation: col("Q5 Past Participation"),
    communityProblems: list("Q6 Community Problems"),
    highestPriority: col("Q7 Highest Priority") || "Unspecified",
    canNgosHelp: ngoHelp,
    localNgoAwareness: col("Q9 Local NGO Awareness"),
    usefulSupport: list("Q10 Useful Support"),
    volunteeredBefore: col("Q11 Volunteered Before"),
    volunteerEncouragements: list("Q12 Volunteer Encouragements"),
    barriers: list("Q13 Barriers to Participate"),
    trustFactors: list("Q14 Trust Factors"),
    publishWorkOnline: col("Q15 Publish Work Online"),
    useWebsite: col("Q16 Use Website"),
    websiteInfoNeeded: list("Q17 Website Info Needed"),
    onlineFormPreference: col("Q18 Online Form Preference"),
    onlineEventReg: col("Q19 Online Event Reg"),
    donationTransparency: col("Q20 Donation Transparency"),
    staffDashboard: col("Q21 Staff Dashboard"),
    digitalTracking: col("Q22 Digital Volunteer Tracking"),
    usefulMgmtFeatures: list("Q23 Useful Mgmt Features"),
    manualDifficulties: list("Q24 Manual Difficulties"),
    primaryDevice: device || "Unspecified",
    usefulWebsiteFeatures: col("Q26 Useful Website Features"),
    moreLikelyParticipate: col("Q27 More Likely Participate"),
    improvementsNeeded: col("Q28 Improvements Needed"),
    infoSharingConcerns: col("Q29 Info Sharing Concerns"),
    otherSuggestions: col("Q30 Other Suggestions"),
  };
}

export function loadCepRealData(): Promise<CepSurveyRecord[]> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("CEP data loads on the client only"));
  }
  if (cache) return cache;

  cache = fetch(CEP_CSV_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Could not load survey data (${res.status})`);
      return res.text();
    })
    .then((text) => {
      const rows = parseCsvRows(text);
      if (rows.length < 2) return [];
      const [header, ...body] = rows.filter((r) => r.length > 1);
      const records = body
        .map((cells) => toRecord(header, cells))
        .filter((r): r is CepSurveyRecord => r !== null);
      return records;
    })
    .catch((err) => {
      cache = null;
      throw err;
    });

  return cache;
}

/** Download the (possibly filtered) real responses as a CSV file. */
export function exportCepCsv(records: CepSurveyRecord[], filename = "cep_survey_responses_pan_india.csv") {
  const header = [
    "ID",
    "Name",
    "Age Group",
    "Occupation",
    "Location",
    "City",
    "State",
    "NGO Familiarity",
    "Past Participation",
    "Community Problems",
    "Highest Priority",
    "Can NGOs Help",
    "Local NGO Awareness",
    "Useful Support",
    "Volunteered Before",
    "Volunteer Encouragements",
    "Barriers to Participate",
    "Trust Factors",
    "Publish Work Online",
    "Use Website",
    "Website Info Needed",
    "Online Form Preference",
    "Online Event Reg",
    "Donation Transparency",
    "Staff Dashboard",
    "Digital Volunteer Tracking",
    "Useful Mgmt Features",
    "Manual Difficulties",
    "Primary Device",
    "Useful Website Features",
    "More Likely Participate",
    "Improvements Needed",
    "Info Sharing Concerns",
    "Other Suggestions",
  ];

  const list = (v: string[]) => v.join("; ");
  const escape = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;

  const lines = [
    header.join(","),
    ...records.map((r) =>
      [
        r.id,
        r.name,
        r.ageGroup,
        r.occupation,
        r.location,
        r.city,
        r.state,
        r.familiarity,
        r.pastParticipation,
        list(r.communityProblems),
        r.highestPriority,
        r.canNgosHelp,
        r.localNgoAwareness,
        list(r.usefulSupport),
        r.volunteeredBefore,
        list(r.volunteerEncouragements),
        list(r.barriers),
        list(r.trustFactors),
        r.publishWorkOnline,
        r.useWebsite,
        list(r.websiteInfoNeeded),
        r.onlineFormPreference,
        r.onlineEventReg,
        r.donationTransparency,
        r.staffDashboard,
        r.digitalTracking,
        list(r.usefulMgmtFeatures),
        list(r.manualDifficulties),
        r.primaryDevice,
        r.usefulWebsiteFeatures,
        r.moreLikelyParticipate,
        r.improvementsNeeded,
        r.infoSharingConcerns,
        r.otherSuggestions,
      ]
        .map(escape)
        .join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
