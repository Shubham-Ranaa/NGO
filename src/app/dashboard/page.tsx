"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
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
  AlertTriangleIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  CalendarClockIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  FileBarChartIcon,
  HandCoinsIcon,
  LandmarkIcon,
  PlusIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { CountUp } from "@/components/shared/count-up";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStore,
  getAudit,
  monthlySummary,
  totals,
  expensesByCategory,
} from "@/lib/store";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Small chart helpers                                                 */
/* ------------------------------------------------------------------ */

function Sparkline({
  data,
  color,
  id,
}: {
  data: { value: number }[];
  color: string;
  id: string;
}) {
  const flat = data.length === 0 || data.every((d) => d.value === 0);
  return (
    <div className="h-12" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {flat ? null : (
            <>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#spark-${id})`}
                dot={false}
                isAnimationActive={false}
              />
              <Tooltip wrapperClassName="hidden" />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  format = formatCurrency,
}: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color ?? entry.fill }}
            aria-hidden="true"
          />
          {entry.name}:
          <span className="font-semibold tabular-nums text-foreground">
            {format(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* KPI card                                                            */
/* ------------------------------------------------------------------ */

type Kpi = {
  title: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  spark: { value: number }[];
  sparkColor: string;
  sparkId: string;
  footnote?: string;
  footnoteTone?: "default" | "success" | "warning" | "destructive";
  href: string;
};

function KpiCard({ kpi, delay }: { kpi: Kpi; delay: number }) {
  const Icon = kpi.icon;
  const tone =
    kpi.footnoteTone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : kpi.footnoteTone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : kpi.footnoteTone === "destructive"
          ? "text-destructive"
          : "text-muted-foreground";
  return (
    <Reveal delay={delay}>
      <Link href={kpi.href} className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Card className="relative h-full gap-3 overflow-hidden rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-primary/5">
          <div
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-20"
            style={{ background: kpi.sparkColor }}
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="grid size-10 place-items-center rounded-xl"
                style={{ background: `${kpi.sparkColor}14`, color: kpi.sparkColor }}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-[0.8rem] font-semibold text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </div>
            <ArrowUpRightIcon
              className="size-4 text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
          <p className="font-heading text-[1.6rem] font-semibold leading-none tracking-tight text-foreground tabular-nums">
            <CountUp value={kpi.value} prefix="₹" />
          </p>
          <div className="-mx-1 -mb-1">
            <Sparkline data={kpi.spark} color={kpi.sparkColor} id={kpi.sparkId} />
          </div>
          {kpi.footnote ? (
            <p className={cn("text-[0.72rem] font-medium", tone)}>{kpi.footnote}</p>
          ) : null}
        </Card>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Row atoms                                                           */
/* ------------------------------------------------------------------ */

function StatRow({
  label,
  value,
  icon: Icon,
  tone = "text-muted-foreground",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2.5 text-muted-foreground">
        <span className="grid size-7 place-items-center rounded-lg bg-muted/70">
          <Icon className={cn("size-3.5", tone)} aria-hidden="true" />
        </span>
        {label}
      </span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function daysUntil(date: string) {
  const diff = Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function CountdownChip({ when }: { when: string }) {
  const diff = daysUntil(when);
  if (diff < 0) return <Badge variant="outline" className="text-[0.65rem]">Past</Badge>;
  if (diff === 0) return <Badge variant="destructive" className="text-[0.65rem]">Today</Badge>;
  if (diff <= 7)
    return (
      <Badge variant="default" className="text-[0.65rem]">
        in {diff}d
      </Badge>
    );
  return <Badge variant="secondary" className="text-[0.65rem]">in {diff}d</Badge>;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const PIE_COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function DashboardPage() {
  const store = getStore();
  const t = totals();
  const monthly = useMemo(() => monthlySummary(6), [store.donations.length, store.expenses.length]);
  const byCategory = useMemo(() => expensesByCategory(), [store.expenses.length]);
  const audit = getAudit();

  const upcoming = store.events
    .filter((event) => event.status === "upcoming" || event.status === "planned")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const completedRecent = store.events
    .filter((event) => event.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const totalBudgetUpcoming = upcoming.reduce((sum, event) => sum + event.budget, 0);
  const predictedUtilisation =
    totalBudgetUpcoming > 0
      ? Math.min(
          100,
          Math.round(
            (upcoming.reduce((sum, event) => sum + event.actualExpenses, 0) /
              totalBudgetUpcoming) *
              100
          )
        )
      : 0;

  const verifiedShare =
    t.totalDonations > 0
      ? Math.round((t.verifiedDonations / t.totalDonations) * 100)
      : 0;

  const alerts = [
    ...store.donations
      .filter((d) => d.status === "pending")
      .map((d) => ({
        id: d.id,
        kind: "Donation pending verification",
        detail: `${d.donorName} · ${formatCurrency(d.amount)}`,
        href: "/dashboard/donations",
        tone: "amber" as const,
      })),
    ...store.expenses
      .filter((e) => e.approvalStatus === "pending")
      .map((e) => ({
        id: e.id,
        kind: "Expense awaiting approval",
        detail: `${e.description || e.category} · ${formatCurrency(e.amount)}`,
        href: "/dashboard/expenses",
        tone: "red" as const,
      })),
    ...store.expenses
      .filter((e) => e.approvalStatus === "approved" && !e.invoiceFile)
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        kind: "Receipt / invoice missing",
        detail: `${e.description || e.category} · ${formatCurrency(e.amount)}`,
        href: "/dashboard/expenses",
        tone: "amber" as const,
      })),
  ];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const netFlow = t.totalDonations - t.totalExpenses;
  const netPositive = netFlow >= 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero header */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8 dark:from-emerald-950 dark:via-teal-950 dark:to-slate-900">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <CalendarIcon className="size-3.5" aria-hidden="true" />
                {today}
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {greeting} — here&apos;s the state of your NGO today.
              </h1>
              <p className="text-sm text-white/70">
                Every figure you see is calculated live from your stored records.
                This demo labels its sample data — nothing here is a real financial claim.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild size="sm" className="gap-2 bg-white text-emerald-950 hover:bg-white/90">
                <Link href="/dashboard/donations">
                  <PlusIcon className="size-4" aria-hidden="true" />
                  Record donation
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/dashboard/expenses">
                  <WalletIcon className="size-4" aria-hidden="true" />
                  New expense
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/dashboard/reports">
                  <FileBarChartIcon className="size-4" aria-hidden="true" />
                  Reports
                </Link>
              </Button>
            </div>
          </div>

          {/* Inline net-flow strip */}
          <div className="relative mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Net flow (6-month records)
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                <span className={netPositive ? "text-emerald-300" : "text-rose-300"}>
                  {netPositive ? "+" : "−"}
                </span>{" "}
                <CountUp
                  value={Math.abs(netFlow)}
                  prefix="₹"
                />
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Verified donation share
              </p>
              <div className="flex items-center gap-2.5">
                <p className="font-heading text-xl font-semibold tabular-nums">{verifiedShare}%</p>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-emerald-300 transition-all duration-700"
                    style={{ width: `${verifiedShare}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">
                Records on file
              </p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                {t.donationCount + t.expenseCount + t.eventCount + t.volunteerCount}{" "}
                <span className="text-sm font-normal text-white/60">
                  donations · expenses · events · volunteers
                </span>
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          delay={0}
          kpi={{
            title: "Total donations received",
            value: t.totalDonations,
            icon: HandCoinsIcon,
            accent: "emerald",
            sparkColor: "#16a34a",
            sparkId: "donations",
            spark: monthly.map((m) => ({ value: m.income })),
            footnote: `${t.donationCount} records · ${verifiedShare}% verified`,
            footnoteTone: "success",
            href: "/dashboard/donations",
          }}
        />
        <KpiCard
          delay={1}
          kpi={{
            title: "Total expenses recorded",
            value: t.totalExpenses,
            icon: WalletIcon,
            accent: "sky",
            sparkColor: "#3b82f6",
            sparkId: "expenses",
            spark: monthly.map((m) => ({ value: m.expense })),
            footnote: t.pendingExpenses
              ? `${formatCurrency(t.pendingExpenses)} awaiting approval`
              : "All expenses approved",
            footnoteTone: t.pendingExpenses ? "warning" : "success",
            href: "/dashboard/expenses",
          }}
        />
        <KpiCard
          delay={2}
          kpi={{
            title: "Available recorded balance",
            value: t.balance,
            icon: LandmarkIcon,
            accent: "violet",
            sparkColor: "#8b5cf6",
            sparkId: "balance",
            spark: monthly.map((m, i) => ({
              value:
                t.openingBalance +
                monthly.slice(0, i + 1).reduce((s, m2) => s + m2.income - m2.expense, 0),
            })),
            footnote:
              t.balance < 0
                ? "Deficit — review spend immediately"
                : `Opening balance ${formatCurrency(t.openingBalance)}`,
            footnoteTone: t.balance < 0 ? "destructive" : "default",
            href: "/dashboard/reports",
          }}
        />
        <KpiCard
          delay={3}
          kpi={{
            title: "Verified (clean) balance",
            value: t.verifiedBalance,
            icon: ShieldCheckIcon,
            accent: "amber",
            sparkColor: "#f59e0b",
            sparkId: "verified",
            spark: monthly.map((m) => ({ value: m.income - m.expense })),
            footnote: "Only verified donations and approved expenses",
            footnoteTone: "success",
            href: "/dashboard/reports",
          }}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Reveal className="xl:col-span-2" delay={1}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="font-heading text-base">Income vs expense</CardTitle>
                <CardDescription className="mt-1">
                  Last six months, computed from stored records.
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem] font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" /> Expense
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="currentColor" className="text-border/60" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    tickFormatter={(v: number) => (v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`)}
                    width={56}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    name="Income"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={2.4}
                    fill="url(#incomeFill)"
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    name="Expense"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2.4}
                    fill="url(#expenseFill)"
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={2}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-base">Spend by category</CardTitle>
              <CardDescription className="mt-1">
                Where recorded money went.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {byCategory.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No expenses recorded yet.
                </p>
              ) : (
                <>
                  <div className="relative mx-auto h-[168px] w-full max-w-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={byCategory}
                          dataKey="amount"
                          nameKey="category"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {byCategory.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground">
                        Recorded spend
                      </span>
                      <span className="font-heading text-base font-semibold tabular-nums text-foreground">
                        {formatCurrency(t.totalExpenses)}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {byCategory.slice(0, 4).map((cat, i) => (
                      <li key={cat.category} className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                            aria-hidden="true"
                          />
                          <span className="truncate">{cat.category}</span>
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(cat.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Middle grid: upcoming events + quick stats + activity */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Upcoming events */}
        <Reveal className="xl:col-span-2" delay={0}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-heading text-base">Upcoming events</CardTitle>
                <CardDescription className="mt-1">
                  Budget utilisation is computed from approved linked expenses.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
                <Link href="/dashboard/events">
                  All events <ChevronRightIcon className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No upcoming events — schedule one to see it here.
                </p>
              ) : (
                upcoming.map((event) => {
                  const pct = event.budget
                    ? Math.min(100, Math.round((event.actualExpenses / event.budget) * 100))
                    : 0;
                  return (
                    <Link
                      key={event.id}
                      href="/dashboard/events"
                      className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-muted/30 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/60 hover:shadow-sm"
                    >
                      <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-card px-1 py-2 text-center shadow-sm ring-1 ring-border/60">
                        <span className="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                        <span className="font-heading text-xl font-semibold leading-none text-foreground">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                            {event.title}
                          </p>
                          <CountdownChip when={event.date} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {event.venue}
                        </p>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={pct}
                            className="h-1.5 max-w-40"
                            aria-label={`Budget utilisation ${pct} percent`}
                          />
                          <span className="shrink-0 text-[0.7rem] font-medium tabular-nums text-muted-foreground">
                            {formatCurrency(event.actualExpenses)} / {formatCurrency(event.budget)}
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground sm:flex">
                        <span className="flex items-center gap-1.5">
                          <UsersIcon className="size-3.5" aria-hidden="true" />
                          {event.assignedVolunteers.length} assigned
                        </span>
                        <ArrowRightIcon
                          className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  );
                })
              )}

              {upcoming.length > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <TrendingUpIcon className="size-3.5" aria-hidden="true" />
                    Planned budget for upcoming events
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrency(totalBudgetUpcoming)} · {predictedUtilisation}% spent
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>

        {/* Snapshot card */}
        <Reveal delay={1}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-base">Operations snapshot</CardTitle>
              <CardDescription className="mt-1">Counts across modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <StatRow label="Total events" value={t.eventCount} icon={CalendarIcon} tone="text-sky-600 dark:text-sky-400" />
              <StatRow label="Upcoming / planned" value={t.upcomingEvents} icon={CalendarClockIcon} tone="text-emerald-600 dark:text-emerald-400" />
              <StatRow label="Completed" value={t.completedEvents} icon={BadgeCheckIcon} tone="text-violet-600 dark:text-violet-400" />
              <StatRow label="Registered volunteers" value={t.volunteerCount} icon={UsersIcon} tone="text-amber-600 dark:text-amber-400" />
              <StatRow
                label="Volunteer assignments"
                value={store.volunteers.reduce((s, v) => s + v.assignedEvents.length, 0)}
                icon={HandCoinsIcon}
                tone="text-rose-600 dark:text-rose-400"
              />
              <StatRow
                label="Attendance marks"
                value={store.volunteers.reduce((s, v) => s + v.attendanceHistory.length, 0)}
                icon={ClockIcon}
                tone="text-teal-600 dark:text-teal-400"
              />
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-between text-xs">
                  <Link href="/dashboard/volunteers">
                    Open volunteers
                    <ChevronRightIcon className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Alerts + activity */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Reveal delay={0}>
          <Card
            className={cn(
              "h-full rounded-2xl border-border/60",
              alerts.length > 0 && "border-amber-200/70 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-500/5"
            )}
          >
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl",
                    alerts.length
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  )}
                >
                  <AlertTriangleIcon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="font-heading text-base">Action centre</CardTitle>
                  <CardDescription className="mt-0.5">
                    {alerts.length
                      ? `${alerts.length} record${alerts.length !== 1 ? "s" : ""} needs your attention.`
                      : "Everything is verified and approved."}
                  </CardDescription>
                </div>
              </div>
              {alerts.length > 0 ? (
                <Badge variant="destructive">{alerts.length}</Badge>
              ) : (
                <Badge variant="default" className="bg-emerald-600 text-white">All clear</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <ShieldCheckIcon className="size-5 shrink-0" aria-hidden="true" />
                  All donations are verified and every expense has been approved.
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={`${alert.kind}-${alert.id}`}
                    href={alert.href}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors hover:bg-amber-100/50 dark:hover:bg-amber-500/10",
                      alert.tone === "red"
                        ? "border-rose-200/80 bg-rose-50/50 dark:border-rose-500/20 dark:bg-rose-500/5"
                        : "border-amber-200/80 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-foreground">
                        {alert.kind}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {alert.detail}
                      </span>
                    </span>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={1}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-heading text-base">Recent activity</CardTitle>
                <CardDescription className="mt-0.5">
                  Every change is recorded in the audit trail.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hidden sm:inline-flex">
                <Link href="/dashboard/audit">
                  Full trail <ChevronRightIcon className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {audit.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                <ol className="relative space-y-3 border-s border-border/60 ps-5">
                  {audit.slice(0, 6).map((entry) => (
                    <li key={entry.id} className="relative">
                      <span
                        className="absolute -start-[1.55rem] top-1 size-2.5 rounded-full border-2 border-background bg-primary/70"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-foreground">{entry.action}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {entry.userName} · {formatNumber(
                          Math.max(1, Math.round((Date.now() - new Date(entry.timestamp).getTime()) / 60000))
                        )}{" "}
                        min ago · {entry.recordType}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Recent transactions table */}
      <Reveal delay={0}>
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-heading text-base">Latest transactions</CardTitle>
              <CardDescription className="mt-1">
                Most recent donations and expenses, newest first.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hidden sm:inline-flex">
              <Link href="/dashboard/donations">
                Browse donations <ChevronRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pe-6 text-end">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const rows = [
                    ...store.donations
                      .slice()
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .slice(0, 4)
                      .map((d) => ({
                        key: d.id,
                        type: "Donation",
                        label: d.donorName,
                        status: d.status,
                        amount: d.amount,
                        date: d.date,
                      })),
                    ...store.expenses
                      .slice()
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .slice(0, 4)
                      .map((e) => ({
                        key: e.id,
                        type: "Expense",
                        label: e.description || e.category,
                        status: e.approvalStatus,
                        amount: e.amount,
                        date: e.date,
                      })),
                  ]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 7);

                  if (rows.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                          No transactions yet — record your first donation or expense.
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return rows.map((row) => {
                    const tone =
                      row.status === "verified" || row.status === "approved"
                        ? "default"
                        : row.status === "rejected"
                          ? "destructive"
                          : "outline";
                    return (
                      <TableRow key={`${row}-${row.amount}`} className="transition-colors hover:bg-muted/30">
                        <TableCell className="ps-6">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold",
                              row.type === "Donation"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                            )}
                          >
                            {row.type === "Donation" ? (
                              <HandCoinsIcon className="size-3" aria-hidden="true" />
                            ) : (
                              <ReceiptIcon className="size-3" aria-hidden="true" />
                            )}
                            {row.type}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-48 truncate font-medium text-foreground">
                          {row.label}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(row.date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tone as any} className="text-[0.7rem]">
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pe-6 text-end font-semibold tabular-nums text-foreground">
                          {formatCurrency(row.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Reveal>

      {/* Footer strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <DownloadIcon className="size-3.5" aria-hidden="true" />
        Export CSV registers from the Donations, Expenses or Reports pages.
        <span className="mx-1 hidden sm:inline" aria-hidden="true">·</span>
        <Link href="/transparency" className="font-medium text-primary hover:underline">
          Public transparency page
        </Link>
        shows aggregate, approved figures only.
        <span className="mx-1 hidden sm:inline" aria-hidden="true">·</span>
        Demo data — recorded only in this browser.
      </div>
    </div>
  );
}
