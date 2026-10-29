"use client";

import type { ReactNode } from "react";

import { CountUp } from "@/components/shared/count-up";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Gradient hero per module                                            */
/* ------------------------------------------------------------------ */

export const MODULE_GRADIENTS = {
  emerald: {
    hero: "from-emerald-950 via-teal-900 to-cyan-900 dark:from-emerald-950 dark:via-teal-950 dark:to-slate-900",
    glow: "bg-emerald-400/20",
    accent: "#10b981",
  },
  teal: {
    hero: "from-teal-950 via-cyan-900 to-emerald-950 dark:from-teal-950 dark:via-cyan-950 dark:to-slate-900",
    glow: "bg-teal-400/20",
    accent: "#14b8a6",
  },
  sky: {
    hero: "from-sky-950 via-indigo-900 to-slate-900 dark:from-sky-950 dark:via-indigo-950 dark:to-slate-900",
    glow: "bg-sky-400/20",
    accent: "#38bdf8",
  },
  amber: {
    hero: "from-amber-950 via-orange-900 to-stone-900 dark:from-amber-950 dark:via-orange-950 dark:to-slate-900",
    glow: "bg-orange-400/20",
    accent: "#f59e0b",
  },
  rose: {
    hero: "from-rose-950 via-red-950 to-slate-900 dark:from-rose-950 dark:via-red-950 dark:to-slate-900",
    glow: "bg-rose-400/20",
    accent: "#fb7185",
  },
  violet: {
    hero: "from-violet-950 via-indigo-900 to-slate-900 dark:from-violet-950 dark:via-indigo-950 dark:to-slate-900",
    glow: "bg-violet-400/20",
    accent: "#8b5cf6",
  },
} as const;

export type ModuleGradientKey = keyof typeof MODULE_GRADIENTS;

export function ModuleHero({
  gradient = "emerald",
  eyebrow,
  title,
  description,
  actions,
  stats,
}: {
  gradient?: ModuleGradientKey;
  eyebrow: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  stats?: ReactNode;
}) {
  const g = MODULE_GRADIENTS[gradient];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 p-6 text-white shadow-xl sm:p-8 dark:border-white/10">
      <div className={cn("absolute inset-0 bg-gradient-to-br", g.hero)} aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }}
        aria-hidden="true"
      />
      <div className={cn("pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-3xl", g.glow)} aria-hidden="true" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-white/70">{eyebrow}</div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="text-sm text-white/70">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>
      {stats ? (
        <div className="relative mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-4 gap-x-6">
          {stats}
        </div>
      ) : null}
    </div>
  );
}

export function HeroStat({
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
        <CountUp value={value} prefix={unit === "₹" ? "₹" : ""} suffix={unit.endsWith("%") ? "%" : ""} />
        {note ? <span className="text-sm font-normal text-white/60"> {note}</span> : null}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

const STAT_TONES: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  slate: "bg-muted text-muted-foreground",
};

export function ModuleStat({
  title,
  value,
  icon,
  tone = "violet",
  unit = "",
  note,
  href,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone?: keyof typeof STAT_TONES;
  unit?: "" | "₹" | "%";
  note?: string;
  href?: string;
}) {
  const Icon = icon;
  const Body = href ? "a" : "div";
  return (
    <Body href={href} className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring group">
      <Card className="h-full gap-2 rounded-2xl border-border/60 p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-primary/5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-[0.8rem] font-semibold text-muted-foreground">{title}</CardTitle>
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", STAT_TONES[tone])}>
            <Icon className={cn("size-5", STAT_TONES[tone].split(" ")[1])} aria-hidden="true" />
          </span>
        </div>
        <p className="font-heading text-[1.55rem] font-semibold leading-none tracking-tight tabular-nums text-foreground">
          <CountUp value={value} prefix={unit === "₹" ? "₹" : ""} suffix={unit === "%" ? "%" : ""} />
        </p>
        {note ? <p className="text-[0.72rem] font-medium text-muted-foreground">{note}</p> : null}
      </Card>
    </Body>
  );
}

/* ------------------------------------------------------------------ */
/* Status pill                                                         */
/* ------------------------------------------------------------------ */

export type PillTone = "emerald" | "amber" | "rose" | "sky" | "violet" | "slate";

const PILL_TONES: Record<PillTone, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  slate: "bg-muted text-muted-foreground",
};

export function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
        PILL_TONES[tone]
      )}
    >
      {label}
    </span>
  );
}

export function FilterChip({
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
        "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  label = "Search",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block", className)}>
      <svg
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 w-full rounded-xl border border-input bg-background ps-9 pe-3 text-sm outline-none ring-ring/40 transition-shadow placeholder:text-muted-foreground/70 focus:ring-2"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Cards & empty states                                                */
/* ------------------------------------------------------------------ */

export function SectionCard({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-heading text-base">{title}</CardTitle>
            {description ? <CardDescription className="mt-0.5">{description}</CardDescription> : null}
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

export function ModuleFooter({ note }: { note: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
      {note}
    </div>
  );
}

export function DownloadButton({ onClick, label = "Export CSV" }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="outline" onClick={onClick} className="gap-2">
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      {label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Form field (input / textarea / select)                              */
/* ------------------------------------------------------------------ */

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  as,
  children,
  hint,
  required,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  as?: "select" | "textarea";
  children?: ReactNode;
  hint?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required ? <span className="ms-0.5 text-destructive">*</span> : null}
      </label>
      {as === "textarea" ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
      ) : as === "select" ? (
        <Select value={value} onValueChange={(v: string) => onChange(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      ) : (
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} min={min} required={required} />
      )}
      {hint ? <p className="text-[0.68rem] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}
