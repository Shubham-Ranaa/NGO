"use client";

import { useMemo, useState } from "react";
import {
  ActivityIcon,
  DownloadIcon,
  SearchIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  HistoryIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  ArchiveIcon,
  TrashIcon,
  RotateCcwIcon,
} from "lucide-react";

import { getAudit, type AuditEntry } from "@/lib/store";
import { Reveal } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ROLE_TONES: Record<string, string> = {
  "super-admin": "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  manager: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  finance: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  volunteer: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  "public-viewer": "bg-muted text-muted-foreground",
};

const ACTION_ICONS: { match: string[]; icon: React.ElementType; tone: string }[] = [
  { match: ["create", "add", "register"], icon: PlusIcon, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15" },
  { match: ["update", "edit", "verify", "approve"], icon: PencilIcon, tone: "text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/15" },
  { match: ["archive"], icon: ArchiveIcon, tone: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15" },
  { match: ["delete", "remove"], icon: TrashIcon, tone: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/15" },
  { match: ["restore"], icon: RotateCcwIcon, tone: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/15" },
];

function actionVisual(action: string) {
  const lower = action.toLowerCase();
  for (const candidate of ACTION_ICONS) {
    if (candidate.match.some((m) => lower.includes(m))) {
      return { Icon: candidate.icon, tone: candidate.tone };
    }
  }
  return { Icon: HistoryIcon, tone: "text-muted-foreground bg-muted" };
}

const RECORD_TYPES = [...new Set<string>([])]; // populated at runtime

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AuditPage() {
  const audit = getAudit();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const roles = useMemo(() => [...new Set(audit.map((a) => a.userRole))], [audit.length]);
  const recordTypes = useMemo(() => [...new Set(audit.map((a) => a.recordType))], [audit.length]);
  void RECORD_TYPES;

  const stats = useMemo(
    () => ({
      total: audit.length,
      edits: audit.filter((a) => a.previousValues != null).length,
      users: new Set(audit.map((a) => a.userId)).size,
      last24h: audit.filter(
        (a) => Date.now() - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000
      ).length,
    }),
    [audit.length]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return audit.filter((a) => {
      if (roleFilter !== "all" && a.userRole !== roleFilter) return false;
      if (typeFilter !== "all" && a.recordType !== typeFilter) return false;
      if (!q) return true;
      return [a.action, a.userName, a.recordType, a.recordId, a.previousValues, a.updatedValues]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [audit, query, roleFilter, typeFilter]);

  const isFiltered = query.trim() !== "" || roleFilter !== "all" || typeFilter !== "all";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero header */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
                Governance · immutable change log
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Audit trail — who changed what, and when.
              </h1>
              <p className="text-sm text-white/70">
                Every create, update, verify, approve, archive and delete is
                appended here with previous and updated values. Approved records
                cannot be silently altered.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exportCsv}
              disabled={audit.length === 0}
              className="w-fit gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <DownloadIcon className="size-4" aria-hidden="true" />
              Export CSV
            </Button>
          </div>

          {/* Entry stats strip */}
          <div className="relative mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Total entries
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                <CountUp value={stats.total} />
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Edits w/ diffs
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                <CountUp value={stats.edits} />
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Distinct users
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                <CountUp value={stats.users} />
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Last 24 hours
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                <CountUp value={stats.last24h} />
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Filter bar */}
      <Reveal delay={1}>
        <Card className="rounded-2xl border-border/60">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <SearchIcon
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search action, user, record id or field value…"
                aria-label="Search audit entries"
                className="h-10 w-full rounded-xl border border-input bg-background ps-9 pe-3 text-sm outline-none ring-ring/40 transition-shadow placeholder:text-muted-foreground/70 focus:ring-2"
              />
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip
                label="All roles"
                active={roleFilter === "all"}
                onClick={() => setRoleFilter("all")}
              />
              {roles.map((role) => (
                <FilterChip
                  key={role}
                  label={role.replace("-", " ")}
                  active={roleFilter === role}
                  onClick={() => setRoleFilter(role === roleFilter ? "all" : role)}
                />
              ))}
              <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
              <FilterChip
                label="All records"
                active={typeFilter === "all"}
                onClick={() => setTypeFilter("all")}
              />
              {recordTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={typeFilter === type}
                  onClick={() => setTypeFilter(type === typeFilter ? "all" : type)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Entries */}
      <Reveal delay={2}>
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <ActivityIcon className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="font-heading text-base">Recorded actions</CardTitle>
                <CardDescription className="mt-0.5">
                  {rows.length === audit.length
                    ? `${audit.length} entr${audit.length === 1 ? "y" : "ies"}, newest first.`
                    : `${rows.length} of ${audit.length} entries match your filters.`}
                </CardDescription>
              </div>
            </div>
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground"
                onClick={() => {
                  setQuery("");
                  setRoleFilter("all");
                  setTypeFilter("all");
                }}
              >
                <RotateCcwIcon className="size-3.5" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {rows.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-muted">
                  <SearchIcon className="size-5 text-muted-foreground" aria-hidden="true" />
                </span>
                <p className="font-medium text-foreground">No matching audit entries</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {audit.length === 0
                    ? "Nothing has been logged yet — actions will appear here as you use the workspace."
                    : "Try a different search term or clear the role / record filters."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                    <TableHead className="ps-6">When</TableHead>
                    <TableHead>User &amp; role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead className="pe-6">Change detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 100).map((entry) => (
                    <AuditRow key={entry.id} entry={entry} />
                  ))}
                  {rows.length > 100 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-4 text-center text-xs text-muted-foreground"
                      >
                        Showing the 100 most recent of {rows.length} matching entries — export the CSV for the full log.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* Footer note */}
      <div className="flex items-start gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>
          The audit trail is append-only in this demo: entries are saved in the
          browser alongside the records they describe, and no entry is ever
          edited or removed. Data shown is demo data stored only in this
          browser — not a real organisation's log.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                 */
/* ------------------------------------------------------------------ */

function AuditRow({ entry }: { entry: AuditEntry }) {
  const { Icon, tone } = actionVisual(entry.action);
  return (
    <TableRow className="align-top transition-colors hover:bg-muted/30">
      <TableCell className="ps-6 whitespace-nowrap">
        <p className="text-sm font-medium text-foreground">{timeAgo(entry.timestamp)}</p>
        <p className="text-[0.7rem] text-muted-foreground">
          {formatWhen(entry.timestamp)}
        </p>
      </TableCell>
      <TableCell className="min-w-40">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <UserIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="max-w-32 truncate">{entry.userName}</span>
        </p>
        <span
          className={cn(
            "mt-1 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
            ROLE_TONES[entry.userRole] ?? "bg-muted text-muted-foreground"
          )}
        >
          {entry.userRole}
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-2">
          <span className={cn("grid size-7 place-items-center rounded-lg", tone)}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium capitalize text-foreground">
            {entry.action}
          </span>
        </span>
      </TableCell>
      <TableCell>
        <p className="text-sm text-foreground">{entry.recordType}</p>
        <p className="font-mono text-[0.68rem] text-muted-foreground">
          {entry.recordId.slice(0, 10)}
        </p>
      </TableCell>
      <TableCell className="pe-6">
        {entry.previousValues || entry.updatedValues ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {entry.previousValues ? (
              <code className="max-w-52 truncate rounded-md border border-rose-200/70 bg-rose-50 px-1.5 py-0.5 text-[0.68rem] text-rose-700 line-through dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300">
                {entry.previousValues}
              </code>
            ) : (
              <Badge variant="secondary" className="text-[0.65rem]">
                new record
              </Badge>
            )}
            {entry.previousValues && entry.updatedValues && (
              <ArrowRightIcon className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
            {entry.updatedValues && (
              <code className="max-w-52 truncate rounded-md border border-emerald-200/70 bg-emerald-50 px-1.5 py-0.5 text-[0.68rem] text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                {entry.updatedValues}
              </code>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[0.7rem] font-medium capitalize transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

function exportCsv() {
  const audit = getAudit();
  const headers = [
    "Timestamp",
    "User",
    "Role",
    "Action",
    "Record type",
    "Record ID",
    "Previous values",
    "Updated values",
  ];
  const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...audit.map((a) =>
      [
        a.timestamp,
        a.userName,
        a.userRole,
        a.action,
        a.recordType,
        a.recordId,
        a.previousValues ?? "",
        a.updatedValues ?? "",
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-audit-trail.csv";
  a.click();
  URL.revokeObjectURL(url);
}
