"use client";

import { useMemo, useState } from "react";
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
  BadgeCheckIcon,
  BanIcon,
  FileTextIcon,
  ShoppingCartIcon,
  StoreIcon,
  Trash2Icon,
  TriangleAlertIcon,
  WalletIcon,
} from "lucide-react";

import {
  addExpense,
  updateExpense,
  deleteExpense,
  getStore,
  expensesByCategory,
  monthlySummary,
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
  SectionCard,
  StatusPill,
  type PillTone,
} from "@/components/dashboard/module-kit";
import { Button } from "@/components/ui/button";
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

type Approval = "pending" | "approved" | "rejected";

const STATUS_TONE: Record<Approval, PillTone> = {
  pending: "amber",
  approved: "emerald",
  rejected: "rose",
};

const PIE_COLORS = ["#f43f5e", "#fb923c", "#eab308", "#38bdf8", "#8b5cf6", "#14b8a6", "#16a34a"];

type ExpenseForm = {
  date: string;
  category: string;
  amount: string;
  description: string;
  relatedEvent: string;
  vendor: string;
  paymentMethod: string;
  reference: string;
  invoiceFile: string;
  submittedBy: string;
  approvalStatus: Approval;
  auditNote: string;
};

const EMPTY_FORM: ExpenseForm = {
  date: "",
  category: "",
  amount: "",
  description: "",
  relatedEvent: "",
  vendor: "",
  paymentMethod: "",
  reference: "",
  invoiceFile: "",
  submittedBy: "",
  approvalStatus: "pending",
  auditNote: "",
};

export default function ExpensesPage() {
  const store = getStore();
  const t = totals();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ExpenseForm>(EMPTY_FORM);

  const monthly = useMemo(() => monthlySummary(6), []);
  const byCategory = useMemo(() => expensesByCategory(), []);

  const pending = store.expenses.filter((e) => e.approvalStatus === "pending");
  const approved = store.expenses.filter((e) => e.approvalStatus === "approved");
  const missingInvoice = store.expenses.filter((e) => e.approvalStatus === "approved" && !e.invoiceFile);
  const events = store.events.map((e) => ({ value: e.id, label: e.title }));

  const approve = (id: string) => {
    updateExpense(id, { approvalStatus: "approved", reviewedBy: "finance@sahyog.example.org" });
  };
  const reject = (id: string) => {
    updateExpense(id, { approvalStatus: "rejected", reviewedBy: "finance@sahyog.example.org" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) || 0 };
    if (editing) {
      updateExpense(editing, payload);
    } else {
      addExpense(payload, form.submittedBy || "demo@sahyog.example.org");
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(false);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.expenses
      .filter((e) => filterStatus === "all" || e.approvalStatus === filterStatus)
      .filter((e) =>
        q
          ? [e.description, e.category, e.vendor, e.reference]
              .filter(Boolean)
              .some((f) => String(f).toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [store.expenses, filterStatus, query]);

  const eventLabel = (id?: string) => store.events.find((e) => e.id === id)?.title;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Reveal>
        <ModuleHero
          gradient="rose"
          eyebrow={
            <>
              <WalletIcon className="size-3.5" aria-hidden="true" />
              Finance · expense register
            </>
          }
          title="Every rupee out, with the trail to prove it."
          description="Record spend, route it through approval, attach invoices and keep auditors, funders and the transparency page satisfied."
          actions={
            <>
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                  setOpen(true);
                }}
                className="gap-2 bg-white text-rose-950 hover:bg-white/90"
              >
                New expense
              </Button>
              <DownloadButton onClick={exportCsv} label="Export CSV" />
            </>
          }
          stats={
            <>
              <HeroStat label="Total recorded" value={t.totalExpenses} unit="₹" note={`${t.expenseCount} records`} />
              <HeroStat label="Approved spend" value={approved.reduce((s, e) => s + e.amount, 0)} unit="₹" note={`${approved.length} approved`} />
              <HeroStat label="Awaiting approval" value={pending.reduce((s, e) => s + e.amount, 0)} unit="₹" note={`${pending.length} pending`} />
              <HeroStat label="Missing invoices" value={missingInvoice.length} note="approved but no invoice" />
            </>
          }
        />
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <ModuleStat
            title="Total expenses"
            value={t.totalExpenses}
            unit="₹"
            icon={WalletIcon}
            tone="rose"
            note={`${store.expenses.length} records on file`}
          />
        </Reveal>
        <Reveal delay={1}>
          <ModuleStat
            title="Awaiting approval"
            value={pending.reduce((s, e) => s + e.amount, 0)}
            unit="₹"
            icon={TriangleAlertIcon}
            tone="amber"
            note={`${pending.length} record${pending.length !== 1 ? "s" : ""} pending`}
          />
        </Reveal>
        <Reveal delay={2}>
          <ModuleStat
            title="Invoices on file"
            value={store.expenses.length - missingInvoice.length}
            icon={FileTextIcon}
            tone="emerald"
            note={`${missingInvoice.length} approved record${missingInvoice.length !== 1 ? "s" : ""} missing an invoice`}
          />
        </Reveal>
        <Reveal delay={3}>
          <ModuleStat
            title="Linked to events"
            value={store.expenses.filter((e) => e.relatedEvent).length}
            icon={BadgeCheckIcon}
            tone="sky"
            note="expenses feeding event budgets"
          />
        </Reveal>
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Reveal className="xl:col-span-2" delay={1}>
          <SectionCard
            icon={WalletIcon}
            title="Spend by month"
            description="All recorded expenses (demo data), last six calendar months."
          >
            {monthly.every((m) => m.expense === 0) ? (
              <EmptyState icon={WalletIcon} title="No expenses yet" description="Recorded spend will chart here by month." />
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expenseFillCep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.26} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="currentColor" className="text-border/60" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      tickFormatter={(v: number) => (v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`)}
                      width={56}
                    />
                    <Tooltip
                      content={({ active, payload, label }: any) =>
                        active && payload?.length ? (
                          <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl">
                            <p className="font-semibold text-foreground">{label}</p>
                            <p className="text-muted-foreground">
                              Expenses:{" "}
                              <span className="font-semibold tabular-nums text-foreground">
                                {formatCurrency(payload[0].value)}
                              </span>
                            </p>
                          </div>
                        ) : null
                      }
                    />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.4} fill="url(#expenseFillCep)" activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
        </Reveal>

        <Reveal delay={2}>
          <SectionCard icon={ShoppingCartIcon} title="Spend by category" description="Where the money went.">
            {byCategory.length === 0 ? (
              <EmptyState icon={ShoppingCartIcon} title="Nothing spent yet" description="Categories appear once expenses are recorded." />
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-[150px] w-full max-w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byCategory} dataKey="amount" nameKey="category" innerRadius={46} outerRadius={76} paddingAngle={3} strokeWidth={0}>
                        {byCategory.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }: any) =>
                          active && payload?.length ? (
                            <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl">
                              <p className="font-semibold text-foreground">{payload[0].name}</p>
                              <p className="tabular-nums text-muted-foreground">{formatCurrency(payload[0].value)}</p>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {byCategory.slice(0, 4).map((cat, i) => (
                    <li key={cat.category} className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} aria-hidden="true" />
                        <span className="truncate">{cat.category}</span>
                      </span>
                      <span className="font-semibold tabular-nums text-foreground">{formatCurrency(cat.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </SectionCard>
        </Reveal>
      </div>

      {/* Filters + table */}
      <Reveal delay={1}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip label="All" active={filterStatus === "all"} onClick={() => setFilterStatus("all")} />
              <FilterChip label={`Pending (${pending.length})`} active={filterStatus === "pending"} onClick={() => setFilterStatus("pending")} />
              <FilterChip label="Approved" active={filterStatus === "approved"} onClick={() => setFilterStatus("approved")} />
              <FilterChip label="Rejected" active={filterStatus === "rejected"} onClick={() => setFilterStatus("rejected")} />
            </div>
            <SearchBar
              className="sm:ms-auto sm:w-80"
              value={query}
              onChange={setQuery}
              placeholder="Search description, vendor or reference…"
              label="Search expenses"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Description</TableHead>
                  <TableHead className="text-end">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Vendor / event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pe-6 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6">
                      <EmptyState
                        icon={ShoppingCartIcon}
                        title={store.expenses.length === 0 ? "No expenses recorded yet" : "No expenses match your filters"}
                        description={
                          store.expenses.length === 0
                            ? "Record spend with a vendor, invoice reference and approval status — approved expenses flow into event budgets and the balance."
                            : "Try a different search or clear the status filter."
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
                            New expense
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((e) => (
                    <TableRow key={e.id} className="transition-colors hover:bg-muted/30">
                      <TableCell className="ps-6">
                        <p className="font-medium text-foreground">{e.description || e.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.invoiceFile ? (
                            <span className="inline-flex items-center gap-1">
                              <FileTextIcon className="size-3" aria-hidden="true" />
                              {e.invoiceFile}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <TriangleAlertIcon className="size-3" aria-hidden="true" />
                              no invoice
                            </span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell className="text-end font-semibold tabular-nums text-foreground">
                        {formatCurrency(e.amount)}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{formatDate(e.date)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusPill label={e.category} tone="slate" />
                      </TableCell>
                      <TableCell className="hidden max-w-40 text-sm text-muted-foreground lg:table-cell">
                        <p className="flex items-center gap-1.5 truncate">
                          <StoreIcon className="size-3.5 shrink-0" aria-hidden="true" />
                          {e.vendor || "—"}
                        </p>
                        {e.relatedEvent ? (
                          <p className="truncate text-[0.68rem] text-muted-foreground/80">{eventLabel(e.relatedEvent) ?? e.relatedEvent}</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <StatusPill label={e.approvalStatus} tone={STATUS_TONE[e.approvalStatus]} />
                      </TableCell>
                      <TableCell className="pe-6 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {e.approvalStatus === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => approve(e.id)}
                                className="h-7 gap-1 px-2.5 text-[0.7rem] bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <BadgeCheckIcon className="size-3.5" aria-hidden="true" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => reject(e.id)}
                                className="h-7 gap-1 px-2.5 text-[0.7rem] bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
                              >
                                <BanIcon className="size-3.5" aria-hidden="true" />
                                Reject
                              </Button>
                            </>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditing(e.id);
                              setForm({
                                date: e.date,
                                category: e.category,
                                amount: String(e.amount),
                                description: e.description,
                                relatedEvent: e.relatedEvent ?? "",
                                vendor: e.vendor ?? "",
                                paymentMethod: e.paymentMethod,
                                reference: e.reference ?? "",
                                invoiceFile: e.invoiceFile ?? "",
                                submittedBy: e.submittedBy,
                                approvalStatus: e.approvalStatus,
                                auditNote: e.auditNote ?? "",
                              });
                              setOpen(true);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                            aria-label="Edit expense"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Delete this expense record?")) deleteExpense(e.id);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete expense"
                          >
                            <Trash2Icon className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {rows.length} of {store.expenses.length} expense records ·{" "}
            {missingInvoice.length}
            {missingInvoice.length === 1 ? " approved record lacks" : " approved records lack"} an
            invoice · demo data stored only in this browser.
          </p>
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ModuleFooter
          note={
            <>
              Approved expenses count toward event <code className="font-mono">actual</code>{" "}
              budgets and the recorded balance. Rejections keep an audit note — never delete to
              "unsee" spend.
            </>
          }
        />
      </Reveal>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit expense" : "Record an expense"}</DialogTitle>
            <DialogDescription>
              Approved expenses count toward the linked event budget and the recorded balance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date *" required type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <FormField label="Amount (₹) *" required type="number" min="0" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category *" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Infrastructure / Medical / Transport" hint="Categories roll up in charts and Reports." />
              <FormField label="Related event" as="select" value={form.relatedEvent || "none"} onChange={(v: string) => setForm({ ...form, relatedEvent: v === "none" ? "" : v })}>
                <SelectItem value="none">None</SelectItem>
                {events.map((ev) => (
                  <SelectItem key={ev.value} value={ev.value}>
                    {ev.label}
                  </SelectItem>
                ))}
              </FormField>
            </div>
            <FormField label="Vendor / payee" value={form.vendor} onChange={(v) => setForm({ ...form, vendor: v })} placeholder="e.g. City Pharmacy" />
            <FormField label="Description" as="textarea" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What was purchased?" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Payment method" value={form.paymentMethod} onChange={(v) => setForm({ ...form, paymentMethod: v })} placeholder="Cash / UPI / Bank transfer" />
              <FormField label="Reference" value={form.reference} onChange={(v) => setForm({ ...form, reference: v })} placeholder="Invoice / cheque ref" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Invoice file name" value={form.invoiceFile} onChange={(v) => setForm({ ...form, invoiceFile: v })} placeholder="inv-001.pdf" hint="Name of the invoice document kept in your records." />
              <FormField label="Submitted by" value={form.submittedBy} onChange={(v) => setForm({ ...form, submittedBy: v })} placeholder="volunteer@sahyog.example.org" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Approval status" as="select" value={form.approvalStatus} onChange={(v: string) => setForm({ ...form, approvalStatus: v as Approval })}>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </FormField>
              <FormField label="Audit note" value={form.auditNote} onChange={(v) => setForm({ ...form, auditNote: v })} placeholder="Why approved / rejected…" />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Record expense"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function exportCsv() {
  const store = getStore();
  const headers = [
    "Date",
    "Category",
    "Amount (₹)",
    "Description",
    "Event",
    "Vendor",
    "Payment method",
    "Reference",
    "Invoice",
    "Submitted by",
    "Reviewed by",
    "Status",
    "Audit note",
    "Created",
  ];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...store.expenses.map((e) =>
      [
        e.date,
        e.category,
        e.amount,
        e.description,
        e.relatedEvent || "",
        e.vendor || "",
        e.paymentMethod,
        e.reference || "",
        e.invoiceFile || "",
        e.submittedBy,
        e.reviewedBy || "",
        e.approvalStatus,
        e.auditNote || "",
        e.createdAt,
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}
