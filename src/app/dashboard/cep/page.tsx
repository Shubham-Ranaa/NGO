"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3Icon,
  BriefcaseIcon,
  ClipboardListIcon,
  DatabaseIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  HandshakeIcon,
  ListChecksIcon,
  MapIcon,
  QuoteIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparklesIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";

import {
  AGREEMENT_ORDER,
  AWARENESS_ORDER,
  DEVICE_ORDER,
  FAMILIARITY_ORDER,
  HELP_ORDER,
  IMPACT_ORDER,
  IMPORTANCE_ORDER,
  PARTICIPATION_ORDER,
  PRIORITY_ORDER,
  loadCepRealData,
  orderedCount,
  tallyList,
  exportCepCsv,
  type CepSurveyRecord,
} from "@/lib/cep-survey";
import { CountUp } from "@/components/shared/count-up";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Chart shells                                                        */
/* ------------------------------------------------------------------ */

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 max-w-56 font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-semibold tabular-nums text-foreground">{payload[0].value}</span>{" "}
        respondent{payload[0].value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function BarList({
  rows,
  total,
  accent = "#8b5cf6",
  max,
}: {
  rows: { name: string; count: number }[];
  total: number;
  accent?: string;
  max?: number;
}) {
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => {
        const width = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <li key={row.name} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-muted-foreground">{row.name}</span>
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {width}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/70">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${max ? (row.count / max) * 100 : width}%`, backgroundColor: accent }}
                aria-hidden="true"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function LikertList({
  rows,
  total,
  ramp,
}: {
  rows: { name: string; count: number }[];
  total: number;
  ramp: string[];
}) {
  const best = Math.max(...rows.map((r) => r.count), 1);
  return (
    <ul className="space-y-2">
      {rows.map((row, i) => (
        <li key={row.name} className="flex items-center gap-3">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: ramp[i % ramp.length] }}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{row.name}</span>
          <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-muted/70 sm:block">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(row.count / best) * 100}%`,
                backgroundColor: ramp[i % ramp.length],
              }}
              aria-hidden="true"
            />
          </div>
          <span className="w-14 shrink-0 text-end text-sm font-semibold tabular-nums text-foreground">
            {total > 0 ? Math.round((row.count / total) * 100) : 0}%
          </span>
        </li>
      ))}
    </ul>
  );
}

const LIKERT_RAMP = ["#15803d", "#22c55e", "#eab308", "#f97316", "#ef4444"];
const IMPACT_RAMP = ["#15803d", "#22c55e", "#eab308", "#ef4444"];
const HELP_RAMP = ["#15803d", "#4ade80", "#eab308", "#ef4444"];

/* Section heading shared by the module cards */
function SectionHead({
  icon: Icon,
  title,
  description,
  tone = "violet",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  tone?: "violet" | "emerald" | "sky" | "amber" | "rose" | "teal";
}) {
  const tones: Record<string, string> = {
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  };
  return (
    <CardHeader className="flex-row items-start justify-between space-y-0">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <CardTitle className="font-heading text-base">{title}</CardTitle>
          <CardDescription className="mt-0.5">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

/* ------------------------------------------------------------------ */
/* Quote selection                                                     */
/* ------------------------------------------------------------------ */

const VOICE_FIELDS = [
  {
    key: "usefulWebsiteFeatures",
    prompt: "Website features that would serve them most",
    tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  {
    key: "moreLikelyParticipate",
    prompt: "What would make them participate more",
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    key: "improvementsNeeded",
    prompt: "Improvements they suggested for programmes",
    tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    key: "infoSharingConcerns",
    prompt: "Privacy & information-sharing concerns",
    tone: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
  {
    key: "otherSuggestions",
    prompt: "Open suggestions",
    tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
] as const;

type VoiceField = (typeof VOICE_FIELDS)[number];

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickQuotes(records: CepSurveyRecord[], seed: number) {
  const shuffled = records
    .map((r) => ({ r, h: hash(`${r.id}:${seed}`) }))
    .sort((a, b) => a.h - b.h)
    .map((x) => x.r);
  const used = new Set<number>();
  const out: { field: VoiceField; record: CepSurveyRecord }[] = [];
  for (const field of VOICE_FIELDS) {
    const key = field.key as keyof CepSurveyRecord;
    const rec = shuffled.find(
      (r) => !used.has(r.id) && String(r[key] ?? "").trim().length > 40
    );
    if (rec) {
      used.add(rec.id);
      out.push({ field, record: rec });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const DONUT_COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#f59e0b", "#14b8a6", "#16a34a"];

export default function CepPage() {
  const [records, setRecords] = useState<CepSurveyRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [selected, setSelected] = useState<CepSurveyRecord | null>(null);
  const [quoteSeed, setQuoteSeed] = useState(0);

  useEffect(() => {
    setRecords(null);
    setError(null);
    loadCepRealData()
      .then(setRecords)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [retry]);

  const stats = useMemo(() => {
    if (!records) return null;
    const states = new Set(records.map((r) => r.state).filter(Boolean));
    const cities = new Set(records.map((r) => r.city).filter(Boolean));
    const volunteered = records.filter((r) => r.volunteeredBefore === "Yes").length;
    const smartphones = records.filter((r) => r.primaryDevice === "Smartphone").length;
    const ages = orderedCount(records.map((r) => r.ageGroup), ["Below 18", "18–25", "26–40", "41–60", "Above 60"]);
    return {
      total: records.length,
      states: states.size,
      cities: cities.size,
      volunteered,
      smartphones,
      ages,
    };
  }, [records]);

  /* Aggregates over ALL responses (shared charts) */
  const agg = useMemo(() => {
    if (!records) return null;
    const asOrd = (pick: (r: CepSurveyRecord) => string, order: string[]) =>
      orderedCount(records.map(pick), order);
    return {
      occupation: tallyList(records, (r) => [r.occupation]).top,
      states: tallyList(records, (r) => (r.state ? [r.state] : [])).top,
      familiarity: asOrd((r) => r.familiarity, FAMILIARITY_ORDER),
      participation: asOrd((r) => r.pastParticipation, PARTICIPATION_ORDER),
      awareness: asOrd((r) => r.localNgoAwareness, AWARENESS_ORDER),
      problems: tallyList(records, (r) => r.communityProblems).top,
      support: tallyList(records, (r) => r.usefulSupport).top,
      priority: asOrd((r) => r.highestPriority, PRIORITY_ORDER),
      trust: tallyList(records, (r) => r.trustFactors).top,
      barriers: tallyList(records, (r) => r.barriers).top,
      help: asOrd((r) => r.canNgosHelp, HELP_ORDER),
      publish: asOrd((r) => r.publishWorkOnline, IMPORTANCE_ORDER),
      donationTransparent: asOrd((r) => r.donationTransparency, IMPORTANCE_ORDER),
      staffDash: asOrd((r) => r.staffDashboard, AGREEMENT_ORDER),
      tracking: asOrd((r) => r.digitalTracking, IMPACT_ORDER),
      websiteInfo: tallyList(records, (r) => r.websiteInfoNeeded).top,
      mgmtFeatures: tallyList(records, (r) => r.usefulMgmtFeatures).top,
      difficulties: tallyList(records, (r) => r.manualDifficulties).top,
      device: asOrd((r) => r.primaryDevice, DEVICE_ORDER),
      useWebsite: asOrd((r) => r.useWebsite, ["Definitely", "Probably", "Not sure", "Probably not", "No"]),
      formPref: asOrd((r) => r.onlineFormPreference, ["Yes", "No preference", "No"]),
      eventReg: asOrd((r) => r.onlineEventReg, ["Yes", "Maybe", "No"]),
    };
  }, [records]);

  const quotes = useMemo(() => (records ? pickQuotes(records, quoteSeed) : []), [records, quoteSeed]);

  const filtered = useMemo(() => {
    if (!records) return [];
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (stateFilter !== "all" && r.state !== stateFilter) return false;
      if (!q) return true;
      return [r.name, r.city, r.state, r.occupation, r.highestPriority, r.primaryDevice, r.ageGroup]
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [records, query, stateFilter]);

  const allStates = useMemo(
    () => (records ? [...new Set(records.map((r) => r.state).filter(Boolean))].sort() : []),
    [records]
  );

  /* ----------------------------- loading ----------------------------- */
  if (!records) {
    if (error) {
      return (
        <div className="mx-auto max-w-3xl space-y-5">
          <Card className="rounded-2xl border-rose-200/70 bg-rose-50/50 dark:border-rose-500/25 dark:bg-rose-500/5">
            <CardContent className="flex items-start gap-3 p-5">
              <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <div>
                <p className="font-semibold text-rose-900 dark:text-rose-200">Could not load survey data</p>
                <p className="mt-1 text-sm text-rose-800/80 dark:text-rose-300/80">
                  {error} — the file <code className="font-mono">public/data/cep_survey_responses_pan_india.csv</code> may be missing.
                </p>
                <Button variant="outline" size="sm" onClick={() => setRetry((n) => n + 1)} className="mt-3 gap-2">
                  <RotateCcwIcon className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <CepLoading />;
  }

  const total = records.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 p-6 text-white shadow-xl sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-fuchsia-400/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-200">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />
                  Real field data
                </span>
                <span className="text-xs font-medium text-white/70">
                  Community Engagement &amp; Perception survey · CEP
                </span>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {total} real voices from {stats?.states ?? 0} states &amp; UTs.
              </h1>
              <p className="text-sm text-white/70">
                Collected through the pan-India 30-question community survey questionnaire.
                The retired 1–5 demo rating form has been removed — this page now shows only
                the real responses shipped with the app.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => exportCepCsv(records)}
                className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuoteSeed((n) => n + 1)}
                className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <SparklesIcon className="size-4" aria-hidden="true" />
                Shuffle quotes
              </Button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="relative mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            <HeroStat label="Responses analysed" value={total} note="questionnaire answers" />
            <HeroStat label="States & UTs reached" value={stats?.states ?? 0} note="pan-India coverage" />
            <HeroStat
              label="Volunteered before"
              value={stats ? Math.round((stats.volunteered / total) * 100) : 0}
              unit="%"
              note="of respondents"
            />
            <HeroStat
              label="Primary device: smartphone"
              value={stats ? Math.round((stats.smartphones / total) * 100) : 0}
              unit="%"
              note="of respondents"
            />
          </div>
        </div>
      </Reveal>

      {/* Provenance notice */}
      <Reveal delay={1}>
        <Card className="rounded-2xl border-emerald-200/70 bg-emerald-50/50 dark:border-emerald-500/25 dark:bg-emerald-500/5">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <DatabaseIcon className="size-4.5" aria-hidden="true" />
            </span>
            <div className="text-sm">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                Data provenance — real survey responses
              </p>
              <p className="mt-0.5 text-emerald-900/80 dark:text-emerald-200/80">
                Loaded from{" "}
                <code className="font-mono">public/data/cep_survey_responses_pan_india.csv</code>{" "}
                ({total} responses, questionnaire answers kept verbatim). Respondent names appear
                exactly as recorded in the source file — no contact details were collected. A few
                out-of-schema answers from real-world collection are shown as
                &ldquo;other&rdquo; rather than discarded.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Demographics */}
      <Reveal delay={1}>
        <SectionCard icon={UsersIcon} tone="violet" title="Who answered" description="Demographic profile of all respondents.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age groups</p>
              <div className="relative mx-auto h-[190px] w-full max-w-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats!.ages}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={54}
                      outerRadius={88}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {stats!.ages.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipBox />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-lg font-semibold tabular-nums text-foreground">{total}</span>
                  <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted-foreground">Respondents</span>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BriefcaseIcon className="size-3.5" aria-hidden="true" /> Occupation
              </p>
              <BarList rows={agg!.occupation} total={total} accent="#8b5cf6" />
            </div>
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapIcon className="size-3.5" aria-hidden="true" /> Top states &amp; UTs
              </p>
              <BarList rows={agg!.states.slice(0, 8)} total={total} accent="#ec4899" max={agg!.states[0]?.count} />
              {agg!.states.length > 8 && (
                <p className="mt-2 text-[0.7rem] text-muted-foreground">
                  + {agg!.states.slice(8).length} more states/UTs · {agg!.states.slice(8).reduce((s, x) => s + x.count, 0)} responses
                </p>
              )}
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Engagement */}
      <Reveal delay={1}>
        <SectionCard icon={HandshakeIcon} tone="emerald" title="Awareness & engagement" description="How connected respondents already are to NGO work.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">NGO familiarity</p>
              <LikertList rows={agg!.familiarity} total={total} ramp={["#15803d", "#22c55e", "#eab308", "#f97316"]} />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Past participation</p>
              <LikertList rows={agg!.participation} total={total} ramp={HELP_RAMP} />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Awareness of local NGOs</p>
              <LikertList rows={agg!.awareness} total={total} ramp={["#15803d", "#22c55e", "#eab308", "#ef4444"]} />
              <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-[0.72rem] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{stats && formatPercent(stats.volunteered / total)}</span> have volunteered
                before — and a further{" "}
                <span className="font-semibold text-foreground">
                  {stats && formatPercent(records.filter((r) => r.pastParticipation === "No, but interested").length / total)}
                </span>{" "}
                haven&apos;t yet but want to.
              </p>
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Needs */}
      <Reveal delay={1}>
        <SectionCard icon={ListChecksIcon} tone="amber" title="Community needs & priorities" description="Multi-select answers, aggregated across all respondents.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problems faced in the community</p>
              <BarList rows={agg!.problems.slice(0, 8)} total={total} accent="#f97316" max={agg!.problems[0]?.count} />
              <p className="mt-2 text-[0.7rem] text-muted-foreground">
                Respondents could pick several — {stats && formatPercent(records.filter((r) => r.communityProblems.length >= 3).length / total)} named three or more.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Most useful support</p>
              <BarList rows={agg!.support.slice(0, 8)} total={total} accent="#3b82f6" max={agg!.support[0]?.count} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highest priority for NGO work</p>
              <BarList rows={agg!.priority} total={total} accent="#16a34a" max={agg!.priority[0]?.count} />
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Trust */}
      <Reveal delay={1}>
        <SectionCard icon={ShieldIcon} tone="rose" title="Trust, barriers & beliefs" description="What builds trust and what holds people back.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust factors</p>
              <BarList rows={agg!.trust.slice(0, 6)} total={total} accent="#0d9488" max={agg!.trust[0]?.count} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Barriers to participation</p>
              <BarList rows={agg!.barriers.slice(0, 6)} total={total} accent="#f43f5e" max={agg!.barriers[0]?.count} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                &ldquo;Can NGOs actually help?&rdquo;
              </p>
              <LikertList rows={agg!.help} total={total} ramp={HELP_RAMP} />
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Attitude scales */}
      <Reveal delay={1}>
        <SectionCard icon={BarChart3Icon} tone="violet" title="Attitude scales" description="Importance and agreement questions, ordered strongest to weakest.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publishing work online transparency</p>
              <LikertList rows={agg!.publish} total={total} ramp={LIKERT_RAMP} />
              <p className="mb-4 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Donation transparency</p>
              <LikertList rows={agg!.donationTransparent} total={total} ramp={LIKERT_RAMP} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                &ldquo;Staff dashboards improve NGO work&rdquo;
              </p>
              <LikertList rows={agg!.staffDash} total={total} ramp={LIKERT_RAMP} />
              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Digital volunteer tracking helps…</p>
              <LikertList rows={agg!.tracking} total={total} ramp={IMPACT_RAMP} />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Digital readiness</p>
              <MiniStat label="Prefer filling forms online" rows={agg!.formPref} primary="Yes" total={total} />
              <MiniStat label="Would register for events online" rows={agg!.eventReg} primary="Yes" total={total} />
              <MiniStat label="Would likely use the website" rows={agg!.useWebsite} primary="Definitely" total={total} />
              <MiniStat label="Primary device" rows={agg!.device} primary="Smartphone" total={total} />
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Features */}
      <Reveal delay={1}>
        <SectionCard icon={SparklesIcon} tone="teal" title="What people want built" description="Feature requests — multi-select counts plus free text shown under Voices.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website sections needed</p>
              <TagCloud items={agg!.websiteInfo.map((t) => ({ label: t.name, count: t.count }))} tone="sky" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Useful management features</p>
              <TagCloud items={agg!.mgmtFeatures.map((t) => ({ label: t.name, count: t.count }))} tone="violet" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manual difficulties today</p>
              <TagCloud items={agg!.difficulties.map((t) => ({ label: t.name, count: t.count }))} tone="rose" />
            </div>
          </div>
        </SectionCard>
      </Reveal>

      {/* Voices */}
      <Reveal delay={1}>
        <SectionCard
          icon={QuoteIcon}
          tone="violet"
          title="Voices from the field"
          description="Real free-text answers, in respondents' own words."
          action={
            <Button variant="outline" size="sm" onClick={() => setQuoteSeed((n) => n + 1)} className="gap-2">
              <RefreshCwIcon className="size-4" aria-hidden="true" />
              Shuffle
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quotes.map(({ field, record }) => (
              <figure
                key={field.key}
                className="flex h-full flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className={cn("w-fit rounded-full px-2.5 py-1 text-[0.68rem] font-semibold", field.tone)}>
                  {field.prompt}
                </span>
                <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{String(record[field.key as keyof CepSurveyRecord])}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-2 border-t border-border/50 pt-3 text-[0.7rem] text-muted-foreground">
                  <span className="font-semibold text-foreground">{record.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">
                    {record.city}, {record.state}
                  </span>
                  <span aria-hidden="true">·</span>
                  {record.occupation}
                </figcaption>
              </figure>
            ))}
          </div>
        </SectionCard>
      </Reveal>

      {/* Browser */}
      <Reveal delay={1}>
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <SearchIcon className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="font-heading text-base">Browse individual responses</CardTitle>
                <CardDescription className="mt-0.5">
                  {filtered.length} of {total} responses — click a row for the complete questionnaire answers.
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportCepCsv(records)} className="hidden gap-2 sm:inline-flex">
              <FileSpreadsheetIcon className="size-4" aria-hidden="true" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, city, state, occupation, priority…"
                  aria-label="Search responses"
                  className="h-10 w-full rounded-xl border border-input bg-background ps-9 pe-3 text-sm outline-none ring-ring/40 transition-shadow placeholder:text-muted-foreground/70 focus:ring-2"
                />
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state or UT"
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring/40 focus:ring-2"
              >
                <option value="all">All states &amp; UTs</option>
                {allStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-4">Respondent</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden sm:table-cell">Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No responses match that search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="cursor-pointer align-middle transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="ps-4">
                        <p className="font-medium text-foreground">{r.name}</p>
                        <p className="text-[0.7rem] text-muted-foreground">{r.occupation}</p>
                      </TableCell>
                      <TableCell>
                        <p className="truncate text-sm text-foreground">{r.city}</p>
                        <p className="text-[0.7rem] text-muted-foreground">{r.state}</p>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-muted-foreground">{r.ageGroup}</TableCell>
                      <TableCell className="hidden max-w-44 truncate text-sm text-muted-foreground md:table-cell">
                        {r.highestPriority}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        <span className="inline-flex items-center gap-1.5">
                          <SmartphoneIcon className="size-3.5" aria-hidden="true" />
                          {r.primaryDevice}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Reveal>

      {/* Dialog for full response */}
      <ResponseDialog record={selected} onClose={() => setSelected(null)} />

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <ClipboardListIcon className="size-3.5 shrink-0" aria-hidden="true" />
        Real data · source CSV ships with the app at{" "}
        <code className="font-mono">public/data/cep_survey_responses_pan_india.csv</code> · respondent privacy: names only as recorded in the
        source file, never on the public transparency page.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function HeroStat({
  label,
  value,
  unit = "",
  note = "",
}: {
  label: string;
  value: number;
  unit?: string;
  note?: string;
}) {
  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">{label}</p>
      <p className="font-heading text-xl font-semibold tabular-nums">
        <CountUp value={value} suffix={unit} />
        {note ? <span className="text-sm font-normal text-white/60"> {note}</span> : null}
      </p>
    </div>
  );
}

function SectionCard({
  icon,
  tone,
  title,
  description,
  action,
  children,
}: {
  icon: React.ElementType;
  tone: "violet" | "emerald" | "sky" | "amber" | "rose" | "teal";
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-border/60">
      <SectionHead icon={icon} tone={tone} title={title} description={description} />
      <CardContent>
        {action ? <div className="mb-3 flex justify-end">{action}</div> : null}
        {children}
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  rows,
  primary,
  total,
}: {
  label: string;
  rows: { name: string; count: number }[];
  primary: string;
  total: number;
}) {
  const share = rows.find((r) => r.name === primary)?.count ?? 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="truncate text-[0.7rem] text-muted-foreground">
          {rows.map((r) => `${r.name} ${r.count}`).join(" · ")}
        </p>
      </div>
      <span className="shrink-0 font-heading text-lg font-semibold tabular-nums text-primary">
        {total > 0 ? Math.round((share / total) * 100) : 0}%
      </span>
    </div>
  );
}

const TAG_TONES: Record<string, string> = {
  sky: "border-sky-200/70 bg-sky-50 text-sky-800 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200",
  violet: "border-violet-200/70 bg-violet-50 text-violet-800 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200",
  rose: "border-rose-200/70 bg-rose-50 text-rose-800 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200",
};

function TagCloud({
  items,
  tone,
}: {
  items: { label: string; count: number }[];
  tone: "sky" | "violet" | "rose";
}) {
  const best = Math.max(...items.map((t) => t.count), 1);
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-medium",
            TAG_TONES[tone],
            t.count / best > 0.6 && "font-semibold"
          )}
          title={`${t.count} of respondents listed this`}
        >
          {t.label}
          <span className="rounded-full bg-white/70 px-1.5 font-semibold tabular-nums dark:bg-black/30">
            {t.count}
          </span>
        </span>
      ))}
    </div>
  );
}

const CepLoading = () => (
  <div className="mx-auto max-w-7xl space-y-5" aria-busy="true" aria-label="Loading survey data">
    <div className="h-40 animate-pulse rounded-3xl bg-gradient-to-br from-violet-900/60 to-fuchsia-900/60" />
    <div className="h-16 animate-pulse rounded-2xl bg-muted" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl border bg-card" />
      ))}
    </div>
    <div className="h-80 animate-pulse rounded-2xl border bg-card" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Detail dialog                                                       */
/* ------------------------------------------------------------------ */

function ResponseDialog({
  record,
  onClose,
}: {
  record: CepSurveyRecord | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={record != null} onOpenChange={(open) => !open && onClose()}>
      {record ? (
        <DialogContent className="max-h-[85dvh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
              {record.name}
              <Badge variant="outline" className="text-[0.65rem]">
                #{record.id}
              </Badge>
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span>
                {record.city}, {record.state}
              </span>
              <span aria-hidden="true">·</span>
              <span>{record.ageGroup}</span>
              <span aria-hidden="true">·</span>
              <span>{record.occupation}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <DialogBlock title="Engagement">
              <DetailRow label="NGO familiarity" value={record.familiarity} />
              <DetailRow label="Past participation" value={record.pastParticipation} />
              <DetailRow label="Volunteered before" value={record.volunteeredBefore} />
              <DetailRow label="Local NGO awareness" value={record.localNgoAwareness} />
              <DetailRow label="Trust factors" value={<TagRow items={record.trustFactors} tone="teal" />} />
              <DetailRow label="Barriers" value={<TagRow items={record.barriers} tone="rose" />} />
              <DetailRow
                label="Encouragements to volunteer"
                value={<TagRow items={record.volunteerEncouragements} tone="emerald" />}
              />
            </DialogBlock>

            <DialogBlock title="Needs & priorities">
              <DetailRow label="Community problems" value={<TagRow items={record.communityProblems} tone="amber" />} />
              <DetailRow label="Highest priority" value={record.highestPriority} />
              <DetailRow label="Useful support" value={<TagRow items={record.usefulSupport} tone="sky" />} />
              <DetailRow label="Can NGOs help" value={record.canNgosHelp} />
            </DialogBlock>

            <DialogBlock title="Digital & preferences">
              <DetailRow label="Primary device" value={record.primaryDevice} />
              <DetailRow label="Prefers online forms" value={record.onlineFormPreference} />
              <DetailRow label="Online event registration" value={record.onlineEventReg} />
              <DetailRow label="Would use the website" value={record.useWebsite} />
              <DetailRow label="Importance of online transparency" value={record.publishWorkOnline} />
              <DetailRow label="Importance of donation transparency" value={record.donationTransparency} />
              <DetailRow label="Staff dashboards help" value={record.staffDashboard} />
              <DetailRow label="Digital volunteer tracking" value={record.digitalTracking} />
              <DetailRow label="Website sections needed" value={<TagRow items={record.websiteInfoNeeded} tone="sky" />} />
              <DetailRow label="Useful management features" value={<TagRow items={record.usefulMgmtFeatures} tone="violet" />} />
              <DetailRow label="Manual difficulties" value={<TagRow items={record.manualDifficulties} tone="rose" />} />
            </DialogBlock>

            <DialogBlock title="In their own words">
              <FreeText label="Useful website features" text={record.usefulWebsiteFeatures} />
              <FreeText label="More likely to participate if…" text={record.moreLikelyParticipate} />
              <FreeText label="Improvements needed" text={record.improvementsNeeded} />
              <FreeText label="Information-sharing concerns" text={record.infoSharingConcerns} />
              <FreeText label="Other suggestions" text={record.otherSuggestions} />
            </DialogBlock>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function DialogBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
      <p className="mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-3">
      <span className="shrink-0 text-[0.72rem] font-medium uppercase tracking-wide text-muted-foreground sm:w-48">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-foreground">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}

const ROW_TONES: Record<string, string> = {
  sky: TAG_TONES.sky,
  violet: TAG_TONES.violet,
  rose: TAG_TONES.rose,
  teal: "border-teal-200/70 bg-teal-50 text-teal-800 dark:border-teal-500/25 dark:bg-teal-500/10 dark:text-teal-200",
  emerald: "border-emerald-200/70 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200",
  amber: "border-amber-200/70 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200",
};

function TagRow({
  items,
  tone,
}: {
  items: string[];
  tone: "sky" | "violet" | "rose" | "teal" | "emerald" | "amber";
}) {
  if (items.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className={cn("rounded-full border px-2 py-0.5 text-[0.7rem]", ROW_TONES[tone])}>
          {t}
        </span>
      ))}
    </span>
  );
}

function FreeText({ label, text }: { label: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <div className="rounded-lg border border-border/40 bg-background/60 p-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 leading-relaxed text-foreground/90">&ldquo;{text}&rdquo;</p>
    </div>
  );
}
