"use client";

import { useMemo, useState } from "react";
import {
  ArchiveIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CircleCheckIcon,
  MapPinIcon,
  PencilIcon,
  TargetIcon,
  Trash2Icon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import {
  addEvent,
  updateEvent,
  archiveEvent,
  deleteEvent,
  getStore,
  markAttendance,
  totals,
} from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { Reveal } from "@/components/shared/reveal";
import {
  DownloadButton,
  EmptyState,
  FilterChip,
  FormField,
  HeroStat,
  ModuleFooter,
  ModuleHero,
  ModuleStat,
  SearchBar,
  StatusPill,
  type PillTone,
} from "@/components/dashboard/module-kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Status = "planned" | "upcoming" | "completed" | "archived";

const STATUS_LABELS: Record<Status, string> = {
  planned: "Planned",
  upcoming: "Upcoming",
  completed: "Completed",
  archived: "Archived",
};

const STATUS_TONE: Record<Status, PillTone> = {
  planned: "sky",
  upcoming: "emerald",
  completed: "violet",
  archived: "slate",
};

type EventForm = {
  title: string;
  date: string;
  venue: string;
  objective: string;
  budget: string;
  status: Status;
};

const EMPTY_FORM: EventForm = {
  title: "",
  date: "",
  venue: "",
  objective: "",
  budget: "",
  status: "planned",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "planned", label: "Planned" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
];

export default function EventsPage() {
  const store = getStore();
  const t = totals();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [detailId, setDetailId] = useState<string | null>(null);

  const detailEvent = store.events.find((e) => e.id === detailId) ?? null;

  const plannedBudget = store.events
    .filter((e) => e.status !== "archived")
    .reduce((s, e) => s + e.budget, 0);
  const actualSpend = store.events.reduce((s, e) => s + e.actualExpenses, 0);
  const assignments = store.events.reduce((s, e) => s + e.assignedVolunteers.length, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = Number(form.budget) || 0;
    if (editing) {
      updateEvent(editing, { ...form, budget });
    } else {
      addEvent({ ...form, budget });
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(false);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...store.events]
      .filter((e) => filter === "all" || e.status === filter)
      .filter((e) => (q ? [e.title, e.venue, e.objective].some((f) => f.toLowerCase().includes(q)) : true))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [store.events, filter, query]);

  const upcoming = useMemo(
    () =>
      [...store.events]
        .filter((e) => e.status === "upcoming" || e.status === "planned")
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [store.events]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Reveal>
        <ModuleHero
          gradient="sky"
          eyebrow={
            <>
              <CalendarIcon className="size-3.5" aria-hidden="true" />
              Programmes &amp; people · events
            </>
          }
          title="Events, budgets and attendance in one place."
          description="Plan events, track budget vs actual spend (computed from approved expenses), assign volunteers and mark attendance."
          actions={
            <>
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                  setOpen(true);
                }}
                className="gap-2 bg-white text-sky-950 hover:bg-white/90"
              >
                <CalendarPlusIcon className="size-4" aria-hidden="true" />
                New event
              </Button>
              <DownloadButton onClick={exportCsv} label="Export CSV" />
            </>
          }
          stats={
            <>
              <HeroStat label="Events on file" value={t.eventCount} note="demo data" />
              <HeroStat label="Planned budget" value={plannedBudget} unit="₹" note="non-archived" />
              <HeroStat label="Spent against events" value={actualSpend} unit="₹" note="approved expenses" />
              <HeroStat label="Volunteer assignments" value={assignments} note="across all events" />
            </>
          }
        />
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <ModuleStat title="Total events" value={t.eventCount} icon={CalendarIcon} tone="sky" note={`${store.events.filter((e) => e.status === "archived").length} archived`} />
        </Reveal>
        <Reveal delay={1}>
          <ModuleStat title="Upcoming / planned" value={t.upcomingEvents} icon={TargetIcon} tone="emerald" note="on the calendar ahead" />
        </Reveal>
        <Reveal delay={2}>
          <ModuleStat title="Completed" value={t.completedEvents} icon={CircleCheckIcon} tone="violet" note="with attendance recorded" />
        </Reveal>
        <Reveal delay={3}>
          <ModuleStat
            title="Budget utilisation"
            value={plannedBudget > 0 ? Math.min(100, Math.round((actualSpend / plannedBudget) * 100)) : 0}
            unit="%"
            icon={WalletIcon}
            tone="amber"
            note="actual spend vs planned budget"
          />
        </Reveal>
      </div>

      {/* Upcoming cards */}
      {upcoming.length > 0 ? (
        <Reveal delay={1}>
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((event) => {
              const pct = event.budget ? Math.min(100, Math.round((event.actualExpenses / event.budget) * 100)) : 0;
              const present = event.attendance.filter((a) => a.present).length;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setDetailId(event.id)}
                  className="group rounded-2xl text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-primary/10 py-2 text-center text-primary">
                      <span className="text-[0.6rem] font-bold uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="font-heading text-xl font-semibold leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <StatusPill label={STATUS_LABELS[event.status]} tone={STATUS_TONE[event.status]} />
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {event.title}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
                        {event.venue}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5" aria-label={`Budget ${pct} percent used`} />
                        <span className="shrink-0 text-[0.68rem] tabular-nums text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                      <p className="text-[0.68rem] tabular-nums text-muted-foreground">
                        {formatCurrency(event.actualExpenses)} of {formatCurrency(event.budget)}
                        {present > 0 ? ` · ${present} attended` : ""}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>
      ) : null}

      {/* Filters + table */}
      <Reveal delay={1}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  label={`${f.label} (${f.key === "all" ? store.events.length : store.events.filter((e) => e.status === f.key).length})`}
                  active={filter === f.key}
                  onClick={() => setFilter(f.key)}
                />
              ))}
            </div>
            <SearchBar
              className="sm:ms-auto sm:w-80"
              value={query}
              onChange={setQuery}
              placeholder="Search title, venue or objective…"
              label="Search events"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Event</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Attendance</TableHead>
                  <TableHead className="pe-6 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6">
                      <EmptyState
                        icon={CalendarIcon}
                        title={store.events.length === 0 ? "No events yet" : "No events match your filters"}
                        description={
                          store.events.length === 0
                            ? "Create your first event — its budget will be tracked against approved linked expenses."
                            : "Try a different search or pick another status filter."
                        }
                        action={
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditing(null);
                              setForm(EMPTY_FORM);
                              setOpen(true);
                            }}
                            className="gap-2"
                          >
                            <CalendarPlusIcon className="size-4" aria-hidden="true" />
                            New event
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((event) => {
                    const pct = event.budget ? Math.min(100, Math.round((event.actualExpenses / event.budget) * 100)) : 0;
                    const present = event.attendance.filter((a) => a.present).length;
                    return (
                      <TableRow
                        key={event.id}
                        className="cursor-pointer transition-colors hover:bg-muted/30"
                        onClick={() => setDetailId(event.id)}
                      >
                        <TableCell className="ps-6">
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{event.venue}</span>
                          </p>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                          {formatDate(event.date)}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-semibold tabular-nums text-foreground">
                            {formatCurrency(event.actualExpenses)}{" "}
                            <span className="text-xs font-normal text-muted-foreground">/ {formatCurrency(event.budget)}</span>
                          </p>
                          <div className="mt-1 w-28 max-w-28">
                            <Progress value={pct} className="h-1.5" aria-label={`Budget ${pct} percent used`} />
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <StatusPill label={STATUS_LABELS[event.status]} tone={STATUS_TONE[event.status]} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-muted-foreground">
                            <UsersIcon className="size-4" aria-hidden="true" />
                            {event.assignedVolunteers.length}
                            <span className="text-xs">
                              ({present} present)
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="pe-6 text-end">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e2) => e2.stopPropagation()}
                          >
                            {event.status !== "archived" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditing(event.id);
                                  setForm({
                                    title: event.title,
                                    date: event.date,
                                    venue: event.venue,
                                    objective: event.objective,
                                    budget: String(event.budget),
                                    status: event.status,
                                  });
                                  setOpen(true);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Edit event"
                              >
                                <PencilIcon className="size-4" aria-hidden="true" />
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => archiveEvent(event.id)}
                              className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
                              aria-label="Archive event"
                              disabled={event.status === "archived"}
                            >
                              <ArchiveIcon className="size-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm("Delete this event?")) deleteEvent(event.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete event"
                              disabled={event.status === "completed"}
                            >
                              <Trash2Icon className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {rows.length} of {store.events.length} events · budget "actual" comes from
            approved linked expenses · demo data stored only in this browser.
          </p>
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ModuleFooter
          note={
            <>
              Click a row to open the event detail — mark volunteer attendance there. Attendance
              updates each volunteer&apos;s record instantly and feeds the audit trail. Demo data
              is stored only in this browser.
            </>
          }
        />
      </Reveal>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle>
            <DialogDescription>
              Budget is compared against approved expenses linked to this event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Title *" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Village Water Audit Day" />
              <FormField label="Date *" required type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            </div>
            <FormField label="Venue" value={form.venue} onChange={(v) => setForm({ ...form, venue: v })} placeholder="e.g. Nandur Cluster Community Hall" />
            <FormField label="Objective" as="textarea" value={form.objective} onChange={(v) => setForm({ ...form, objective: v })} placeholder="What will this event achieve?" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Budget (₹)" type="number" min="0" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} hint="Approved expenses reduce this budget." />
              <FormField label="Status" as="select" value={form.status} onChange={(v: string) => setForm({ ...form, status: v as Status })}>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </FormField>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Create event"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={detailEvent != null} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          {detailEvent ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
                  {detailEvent.title}
                  <StatusPill label={STATUS_LABELS[detailEvent.status]} tone={STATUS_TONE[detailEvent.status]} />
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-2">
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="size-3.5" aria-hidden="true" />
                    {formatDate(detailEvent.date)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="size-3.5" aria-hidden="true" />
                    {detailEvent.venue}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                {detailEvent.objective ? (
                  <p className="rounded-xl border border-border/50 bg-muted/30 p-3 leading-relaxed text-muted-foreground">
                    {detailEvent.objective}
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-3">
                  <DetailStat label="Budget" value={formatCurrency(detailEvent.budget)} />
                  <DetailStat label="Actual (approved)" value={formatCurrency(detailEvent.actualExpenses)} />
                  <DetailStat
                    label="Utilisation"
                    value={`${detailEvent.budget ? Math.min(100, Math.round((detailEvent.actualExpenses / detailEvent.budget) * 100)) : 0}%`}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <UsersIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                      Attendance
                    </h3>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {detailEvent.attendance.filter((a) => a.present).length} present /{" "}
                      {store.volunteers.filter((v) => detailEvent.assignedVolunteers.includes(v.id)).length} assigned
                    </span>
                  </div>
                  <div className="space-y-2">
                    {store.volunteers.filter((v) => detailEvent.assignedVolunteers.includes(v.id)).length ? (
                      store.volunteers
                        .filter((v) => detailEvent.assignedVolunteers.includes(v.id))
                        .map((v) => {
                          const rec = detailEvent.attendance.find((a) => a.volunteerId === v.id);
                          return (
                            <div
                              key={v.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {v.skills.join(", ") || v.availability}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={() => markAttendance(detailEvent.id, v.id, true)}
                                  disabled={rec?.present}
                                  className={cn(
                                    "h-7 gap-1 px-2.5 text-[0.7rem]",
                                    rec?.present
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  )}
                                >
                                  <CircleCheckIcon className="size-3.5" aria-hidden="true" />
                                  Present
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAttendance(detailEvent.id, v.id, false)}
                                  disabled={rec != null && !rec.present}
                                  className={cn(
                                    "h-7 gap-1 px-2.5 text-[0.7rem] text-muted-foreground hover:text-rose-600",
                                    rec != null && !rec.present && "border-rose-300/70 text-rose-700 dark:border-rose-500/40 dark:text-rose-300"
                                  )}
                                >
                                  Absent
                                </Button>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                        No volunteers assigned yet — assign them from the Volunteers page.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setDetailId(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-base font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function exportCsv() {
  const store = getStore();
  const headers = ["Title", "Date", "Venue", "Objective", "Budget (₹)", "Actual (₹)", "Status", "Assigned volunteers", "Present"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...store.events.map((e) =>
      [
        e.title,
        e.date,
        e.venue,
        e.objective,
        e.budget,
        e.actualExpenses,
        STATUS_LABELS[e.status],
        e.assignedVolunteers.length,
        e.attendance.filter((a) => a.present).length,
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-events.csv";
  a.click();
  URL.revokeObjectURL(url);
}
