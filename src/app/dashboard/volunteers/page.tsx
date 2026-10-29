"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheckIcon,
  HandHeartIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  Trash2Icon,
  UserRoundIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import {
  addVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getStore,
} from "@/lib/store";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/shared/reveal";
import {
  DownloadButton,
  EmptyState,
  FormField,
  HeroStat,
  ModuleFooter,
  ModuleHero,
  ModuleStat,
  SearchBar,
  StatusPill,
} from "@/components/dashboard/module-kit";
import { Button } from "@/components/ui/button";
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

type VolunteerForm = {
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  assignedEvents: string[];
};

const EMPTY_FORM: VolunteerForm = {
  name: "",
  email: "",
  phone: "",
  skills: "",
  availability: "",
  assignedEvents: [],
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function VolunteersPage() {
  const store = getStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<VolunteerForm>(EMPTY_FORM);

  const detail = store.volunteers.find((v) => v.id === detailId) ?? null;

  const assignmentCount = store.volunteers.reduce((s, v) => s + v.assignedEvents.length, 0);
  const attendanceMarks = store.volunteers.reduce((s, v) => s + v.attendanceHistory.length, 0);
  const presentMarks = store.volunteers.reduce(
    (s, v) => s + v.attendanceHistory.filter((a) => a.present).length,
    0
  );
  const attendanceRate = attendanceMarks > 0 ? Math.round((presentMarks / attendanceMarks) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      availability: form.availability,
      assignedEvents: form.assignedEvents,
      attendanceHistory: editing
        ? (store.volunteers.find((v) => v.id === editing)?.attendanceHistory ?? [])
        : [],
    };
    if (editing) {
      updateVolunteer(editing, payload);
    } else {
      addVolunteer(payload);
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(false);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.volunteers.filter((v) =>
      q
        ? [v.name, v.email, v.skills.join(", "), v.availability].some((f) => f.toLowerCase().includes(q))
        : true
    );
  }, [store.volunteers, query]);

  const topSkills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of store.volunteers) {
      for (const s of v.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [store.volunteers]);

  const eventLabel = (id: string) => store.events.find((e) => e.id === id)?.title ?? id;

  const toggleAssigned = (id: string) => {
    setForm((f) =>
      f.assignedEvents.includes(id)
        ? { ...f, assignedEvents: f.assignedEvents.filter((e) => e !== id) }
        : { ...f, assignedEvents: [...f.assignedEvents, id] }
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Reveal>
        <ModuleHero
          gradient="emerald"
          eyebrow={
            <>
              <HandHeartIcon className="size-3.5" aria-hidden="true" />
              Programmes &amp; people · volunteers
            </>
          }
          title="Your people — skills, availability and turnout."
          description="Maintain the volunteer roster, assign people to events and see who actually shows up, from attendance marked on event days."
          actions={
            <>
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                  setOpen(true);
                }}
                className="gap-2 bg-white text-emerald-950 hover:bg-white/90"
              >
                <UserRoundPlusIcon className="size-4" aria-hidden="true" />
                New volunteer
              </Button>
              <DownloadButton onClick={exportCsv} label="Export CSV" />
            </>
          }
          stats={
            <>
              <HeroStat label="Registered" value={store.volunteers.length} note="demo data" />
              <HeroStat label="Volunteer assignments" value={assignmentCount} note="across events" />
              <HeroStat label="Attendance marks" value={attendanceMarks} note={`${attendanceRate}% present rate`} />
              <HeroStat
                label="Skills listed"
                value={new Set(store.volunteers.flatMap((v) => v.skills)).size}
                note="distinct skills"
              />
            </>
          }
        />
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <ModuleStat title="Registered volunteers" value={store.volunteers.length} icon={UserRoundIcon} tone="emerald" note="in the roster" />
        </Reveal>
        <Reveal delay={1}>
          <ModuleStat title="Event assignments" value={assignmentCount} icon={CalendarCheckIcon} tone="teal" note="volunteer ↔ event links" />
        </Reveal>
        <Reveal delay={2}>
          <ModuleStat title="Present rate" value={attendanceRate} unit="%" icon={CalendarCheckIcon} tone="sky" note={`${presentMarks} of ${attendanceMarks} marks`} />
        </Reveal>
        <Reveal delay={3}>
          <ModuleStat title="With availability" value={store.volunteers.filter((v) => v.availability).length} icon={HandHeartIcon} tone="violet" note="told us when they can help" />
        </Reveal>
      </div>

      {/* Top skills */}
      {topSkills.length > 0 ? (
        <Reveal delay={1}>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Most common skills
            </span>
            {topSkills.map(([skill, count]) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1 text-[0.7rem] font-medium text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                {skill}
                <span className="rounded-full bg-white/70 px-1.5 font-semibold tabular-nums dark:bg-black/30">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      ) : null}

      {/* Search + table */}
      <Reveal delay={1}>
        <div className="space-y-4">
          <SearchBar
            className="sm:w-96"
            value={query}
            onChange={setQuery}
            placeholder="Search name, email or skill…"
            label="Search volunteers"
          />

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Volunteer</TableHead>
                  <TableHead className="hidden md:table-cell">Availability</TableHead>
                  <TableHead className="hidden lg:table-cell">Skills</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead className="hidden sm:table-cell">Attendance</TableHead>
                  <TableHead className="pe-6 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6">
                      <EmptyState
                        icon={UserRoundIcon}
                        title={store.volunteers.length === 0 ? "No volunteers yet" : "No volunteers match your search"}
                        description={
                          store.volunteers.length === 0
                            ? "Add your first volunteer, list their skills and assign them to events."
                            : "Try a different name, email or skill."
                        }
                        action={
                          <Button size="sm" onClick={() => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); }} className="gap-2">
                            <PlusIcon className="size-4" aria-hidden="true" />
                            New volunteer
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((v) => {
                    const present = v.attendanceHistory.filter((a) => a.present).length;
                    return (
                      <TableRow
                        key={v.id}
                        className="cursor-pointer transition-colors hover:bg-muted/30"
                        onClick={() => setDetailId(v.id)}
                      >
                        <TableCell className="ps-6">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-[0.7rem] font-bold text-primary">
                              {initials(v.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{v.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{v.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                          {v.availability || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex max-w-56 flex-wrap gap-1">
                            {v.skills.slice(0, 3).map((s) => (
                              <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[0.68rem] text-muted-foreground">
                                {s}
                              </span>
                            ))}
                            {v.skills.length > 3 ? (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[0.68rem] text-muted-foreground">
                                +{v.skills.length - 3}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold tabular-nums text-foreground">
                            {v.assignedEvents.length}
                          </span>
                          <span className="text-xs text-muted-foreground"> assigned</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {present}/{v.attendanceHistory.length} present
                          </span>
                        </TableCell>
                        <TableCell className="pe-6 text-end">
                          <div className="flex items-center justify-end gap-1" onClick={(e2) => e2.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditing(v.id);
                                setForm({
                                  name: v.name,
                                  email: v.email,
                                  phone: v.phone ?? "",
                                  skills: v.skills.join(", "),
                                  availability: v.availability,
                                  assignedEvents: [...v.assignedEvents],
                                });
                                setOpen(true);
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground"
                              aria-label="Edit volunteer"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm("Remove this volunteer?")) deleteVolunteer(v.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete volunteer"
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
            Showing {rows.length} of {store.volunteers.length} volunteers · attendance is marked
            from the event detail view · demo data stored only in this browser.
          </p>
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ModuleFooter
          note={
            <>
              Assign volunteers to events from the edit form; attendance is then marked on the event
              itself and mirrored into each volunteer&apos;s history. Record storage remains local
              to this browser.
            </>
          }
        />
      </Reveal>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit volunteer" : "New volunteer"}</DialogTitle>
            <DialogDescription>
              Assign events and track participation history.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name *" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Meera Raghunathan" />
              <FormField label="Email *" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="meera@example.org" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" />
              <FormField label="Availability" value={form.availability} onChange={(v) => setForm({ ...form, availability: v })} placeholder="Weekends / Flexible" />
            </div>
            <FormField
              label="Skills (comma-separated)"
              value={form.skills}
              onChange={(v) => setForm({ ...form, skills: v })}
              placeholder="Field survey, Data entry"
              hint="Skills power the roster chips."
            />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Assign to events ({form.assignedEvents.length} selected)
              </p>
              {store.events.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-4 text-center text-sm text-muted-foreground">
                  No events yet — create one first.
                </p>
              ) : (
                <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-xl border border-border/50 bg-muted/20 p-2">
                  {store.events.map((e) => {
                    const checked = form.assignedEvents.includes(e.id);
                    return (
                      <label
                        key={e.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                          checked
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-transparent bg-background/60 text-muted-foreground hover:bg-background"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAssigned(e.id)}
                          className="size-4 accent-[currentColor]"
                        />
                        <span className="flex-1 truncate">{e.title}</span>
                        <span className="shrink-0 text-[0.68rem] text-muted-foreground">{formatDate(e.date)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add volunteer"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={detail != null} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] max-w-lg overflow-y-auto">
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {initials(detail.name)}
                  </span>
                  {detail.name}
                </DialogTitle>
                <DialogDescription className="space-y-1">
                  <span className="flex items-center gap-1.5">
                    <MailIcon className="size-3.5" aria-hidden="true" />
                    {detail.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="size-3.5" aria-hidden="true" />
                    {detail.phone?.trim() ? detail.phone : "Phone not recorded"}
                    {detail.availability ? ` · ${detail.availability}` : ""}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.skills.length ? (
                      detail.skills.map((s) => (
                        <StatusPill key={s} label={s} tone="emerald" />
                      ))
                    ) : (
                      <span className="text-muted-foreground">Not listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Assigned events ({detail.assignedEvents.length})
                  </p>
                  <div className="space-y-1.5">
                    {detail.assignedEvents.length ? (
                      detail.assignedEvents.map((id) => (
                        <div key={id} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                          <span className="truncate">{eventLabel(id)}</span>
                          {(() => {
                            const ev = store.events.find((e) => e.id === id);
                            return ev ? <span className="shrink-0 text-[0.68rem] text-muted-foreground">{formatDate(ev.date)}</span> : null;
                          })()}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No assignments yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Attendance history ({detail.attendanceHistory.filter((a) => a.present).length}/
                    {detail.attendanceHistory.length} present)
                  </p>
                  <div className="space-y-1.5">
                    {detail.attendanceHistory.length ? (
                      detail.attendanceHistory.map((a, i) => (
                        <div key={`${a.eventId}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                          <span className="truncate">{eventLabel(a.eventId)}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="text-[0.68rem] text-muted-foreground">{formatDate(a.date)}</span>
                            <StatusPill label={a.present ? "Present" : "Absent"} tone={a.present ? "emerald" : "rose"} />
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No attendance recorded yet.</p>
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

function exportCsv() {
  const store = getStore();
  const headers = ["Name", "Email", "Phone", "Skills", "Availability", "Assigned events", "Attendance marks", "Present"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...store.volunteers.map((v) =>
      [
        v.name,
        v.email,
        v.phone || "",
        v.skills.join("; "),
        v.availability,
        v.assignedEvents
          .map((id) => store.events.find((e) => e.id === id)?.title ?? id)
          .join("; "),
        v.attendanceHistory.length,
        v.attendanceHistory.filter((a) => a.present).length,
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-volunteers.csv";
  a.click();
  URL.revokeObjectURL(url);
}
