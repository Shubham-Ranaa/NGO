"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheckIcon,
  BanIcon,
  ClipboardCheckIcon,
  HandCoinsIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";

import {
  addDonation,
  updateDonation,
  deleteDonation,
  getStore,
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
import { cn } from "@/lib/utils";

type DonationStatus = "pending" | "verified" | "rejected";
type Source = "cash" | "cheque" | "bank-transfer" | "upi" | "other";

const SOURCE_LABELS: Record<Source, string> = {
  cash: "Cash",
  cheque: "Cheque",
  "bank-transfer": "Bank transfer",
  upi: "UPI",
  other: "Other",
};

const STATUS_TONE: Record<DonationStatus, PillTone> = {
  pending: "amber",
  verified: "emerald",
  rejected: "rose",
};

const SOURCE_TONE: Record<Source, PillTone> = {
  cash: "slate",
  cheque: "sky",
  "bank-transfer": "violet",
  upi: "emerald",
  other: "slate",
};

type DonationForm = {
  date: string;
  donorName: string;
  donorOrganisation: string;
  source: Source;
  amount: string;
  purpose: string;
  paymentMethod: string;
  transactionReference: string;
  receiptNumber: string;
  status: DonationStatus;
  remarks: string;
  recordedBy: string;
};

const EMPTY_FORM: DonationForm = {
  date: "",
  donorName: "",
  donorOrganisation: "",
  source: "upi",
  amount: "",
  purpose: "",
  paymentMethod: "",
  transactionReference: "",
  receiptNumber: "",
  status: "pending",
  remarks: "",
  recordedBy: "demo@sahyog.example.org",
};

export default function DonationsPage() {
  const store = getStore();
  const t = totals();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<DonationForm>(EMPTY_FORM);

  const monthly = useMemo(() => monthlySummary(6), []);
  const bestMonth = Math.max(1, ...monthly.map((m) => m.income));

  const pendingList = store.donations.filter((d) => d.status === "pending");
  const missingReceipt = store.donations.filter((d) => !d.receiptNumber);
  const verifiedShare =
    t.totalDonations > 0 ? Math.round((t.verifiedDonations / t.totalDonations) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) || 0 };
    if (editing) {
      updateDonation(editing, payload);
    } else {
      addDonation(payload);
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(false);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.donations
      .filter((d) => filterStatus === "all" || d.status === filterStatus)
      .filter((d) =>
        q
          ? [d.donorName, d.donorOrganisation, d.purpose, d.receiptNumber]
              .filter(Boolean)
              .some((f) => String(f).toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [store.donations, filterStatus, query]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Reveal>
        <ModuleHero
          gradient="teal"
          eyebrow={
            <>
              <HandCoinsIcon className="size-3.5" aria-hidden="true" />
              Finance · donations register
            </>
          }
          title="Donations, verified down to the receipt."
          description="Record gifts, verify them against payment references and keep the register export-ready for auditors and the public transparency page."
          actions={
            <>
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                  setOpen(true);
                }}
                className="gap-2 bg-white text-teal-950 hover:bg-white/90"
              >
                Record donation
              </Button>
              <DownloadButton
                label="Export CSV"
                onClick={exportCsv}
              />
            </>
          }
          stats={
            <>
              <HeroStat label="Total received" value={t.totalDonations} unit="₹" note={`${t.donationCount} records`} />
              <HeroStat label="Verified amount" value={t.verifiedDonations} unit="₹" note={`${verifiedShare}% of total`} />
              <HeroStat label="Pending verification" value={pendingList.reduce((s, d) => s + d.amount, 0)} unit="₹" note={`${pendingList.length} waiting`} />
              <HeroStat label="Missing receipts" value={missingReceipt.length} note="records without receipt no." />
            </>
          }
        />
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <ModuleStat
            title="Total donations"
            value={t.totalDonations}
            unit="₹"
            icon={HandCoinsIcon}
            tone="emerald"
            note={`${store.donations.length} records on file`}
          />
        </Reveal>
        <Reveal delay={1}>
          <ModuleStat
            title="Verified (clean) income"
            value={t.verifiedDonations}
            unit="₹"
            icon={BadgeCheckIcon}
            tone="teal"
            note={`${verifiedShare}% of received amount`}
          />
        </Reveal>
        <Reveal delay={2}>
          <ModuleStat
            title="Awaiting verification"
            value={pendingList.reduce((s, d) => s + d.amount, 0)}
            unit="₹"
            icon={ClipboardCheckIcon}
            tone="amber"
            note={`${pendingList.length} record${pendingList.length !== 1 ? "s" : ""} pending`}
          />
        </Reveal>
        <Reveal delay={3}>
          <ModuleStat
            title="Receipts issued"
            value={store.donations.length - missingReceipt.length}
            icon={ReceiptTextIcon}
            tone="violet"
            note={`${missingReceipt.length} record${missingReceipt.length !== 1 ? "s" : ""} still missing receipt no.`}
          />
        </Reveal>
      </div>

      {/* Chart */}
      <Reveal delay={1}>
        <SectionCard
          icon={HandCoinsIcon}
          title="Income by month"
          description="All recorded donations (demo data), last six calendar months."
        >
          {monthly.every((m) => m.income === 0) ? (
            <EmptyState
              icon={HandCoinsIcon}
              title="No donations recorded yet"
              description="Recorded gifts will chart here by month."
            />
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  <Tooltip
                    cursor={{ fill: "currentColor", opacity: 0.06 }}
                    content={({ active, payload, label }: any) =>
                      active && payload?.length ? (
                        <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl">
                          <p className="font-semibold text-foreground">{label}</p>
                          <p className="text-muted-foreground">
                            Donations:{" "}
                            <span className="font-semibold tabular-nums text-foreground">
                              {formatCurrency(payload[0].value)}
                            </span>
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="income" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </Reveal>

      {/* Filters + table */}
      <Reveal delay={1}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip label="All" active={filterStatus === "all"} onClick={() => setFilterStatus("all")} />
              <FilterChip label={`Pending (${pendingList.length})`} active={filterStatus === "pending"} onClick={() => setFilterStatus("pending")} />
              <FilterChip label="Verified" active={filterStatus === "verified"} onClick={() => setFilterStatus("verified")} />
              <FilterChip label="Rejected" active={filterStatus === "rejected"} onClick={() => setFilterStatus("rejected")} />
            </div>
            <SearchBar
              className="sm:ms-auto sm:w-80"
              value={query}
              onChange={setQuery}
              placeholder="Search donor, purpose or receipt no…"
              label="Search donations"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Donor</TableHead>
                  <TableHead className="text-end">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Source</TableHead>
                  <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pe-6 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6">
                      <EmptyState
                        icon={UserRoundIcon}
                        title={store.donations.length === 0 ? "No donations recorded yet" : "No donations match your filters"}
                        description={
                          store.donations.length === 0
                            ? "Record your first gift — it will appear in the register, totals and the public transparency aggregates once verified."
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
                            Record donation
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((d) => (
                    <TableRow key={d.id} className="transition-colors hover:bg-muted/30">
                      <TableCell className="ps-6">
                        <p className="font-medium text-foreground">{d.donorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.donorOrganisation || d.paymentMethod || "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-end font-semibold tabular-nums text-foreground">
                        {formatCurrency(d.amount)}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {formatDate(d.date)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusPill label={SOURCE_LABELS[d.source]} tone={SOURCE_TONE[d.source]} />
                      </TableCell>
                      <TableCell className="hidden max-w-36 truncate text-sm text-muted-foreground lg:table-cell">
                        {d.purpose || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <StatusPill label={d.status} tone={STATUS_TONE[d.status]} />
                          {!d.receiptNumber ? (
                            <span className="inline-flex items-center gap-1 text-[0.65rem] font-medium text-amber-600 dark:text-amber-400">
                              <TriangleAlertIcon className="size-3" aria-hidden="true" />
                              no receipt
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="pe-6 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {d.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateDonation(d.id, { status: "verified" })}
                                className="h-7 gap-1 px-2.5 text-[0.7rem] bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateDonation(d.id, { status: "rejected" })}
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
                              setEditing(d.id);
                              setForm({
                                date: d.date,
                                donorName: d.donorName,
                                donorOrganisation: d.donorOrganisation ?? "",
                                source: d.source,
                                amount: String(d.amount),
                                purpose: d.purpose,
                                paymentMethod: d.paymentMethod,
                                transactionReference: d.transactionReference ?? "",
                                receiptNumber: d.receiptNumber ?? "",
                                status: d.status,
                                remarks: d.remarks ?? "",
                                recordedBy: d.recordedBy ?? "",
                              });
                              setOpen(true);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                            aria-label="Edit donation"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Delete this donation record?")) deleteDonation(d.id);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete donation"
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
            Showing {rows.length} of {store.donations.length} donation records ·{" "}
            {missingReceipt.length}
            {missingReceipt.length === 1 ? " record needs" : " records need"} a receipt number ·{" "}
            demo data recorded only in this browser.
          </p>
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ModuleFooter
          note={
            <>
              Verified donations flow into the verified balance on the dashboard, Reports and the
              public transparency page. Verification here is a demo control — in a real system it
              would be tied to bank statements and receipts.
            </>
          }
        />
      </Reveal>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit donation" : "Record a donation"}</DialogTitle>
            <DialogDescription>
              Verification status controls whether this amount counts toward the verified balance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Donor name *" required value={form.donorName} onChange={(v) => setForm({ ...form, donorName: v })} placeholder="Ananya Kulkarni" />
              <FormField label="Organisation (optional)" value={form.donorOrganisation} onChange={(v) => setForm({ ...form, donorOrganisation: v })} placeholder="e.g. Vaidya Trust" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date *" required type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <FormField label="Amount (₹) *" required type="number" min="0" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Source" as="select" value={form.source} onChange={(v: string) => setForm({ ...form, source: v as Source })} hint="How the money arrived.">
                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </FormField>
              <FormField label="Payment method" value={form.paymentMethod} onChange={(v) => setForm({ ...form, paymentMethod: v })} placeholder="UPI / Cheque / Cash" />
            </div>
            <FormField label="Purpose / restricted fund" value={form.purpose} onChange={(v) => setForm({ ...form, purpose: v })} placeholder="e.g. Water & sanitation" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Transaction reference" value={form.transactionReference} onChange={(v) => setForm({ ...form, transactionReference: v })} placeholder="NEFT / UPI ref" hint="Link to the bank entry for verification." />
              <FormField label="Receipt number" value={form.receiptNumber} onChange={(v) => setForm({ ...form, receiptNumber: v })} placeholder="RCV-1001" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Status" as="select" value={form.status} onChange={(v: string) => setForm({ ...form, status: v as DonationStatus })}>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </FormField>
              <FormField label="Recorded by" value={form.recordedBy} onChange={(v) => setForm({ ...form, recordedBy: v })} placeholder="finance@sahyog.example.org" />
            </div>
            <FormField label="Remarks" as="textarea" value={form.remarks} onChange={(v) => setForm({ ...form, remarks: v })} placeholder="Notes…" />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Record donation"}</Button>
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
    "Donor",
    "Organisation",
    "Source",
    "Amount (₹)",
    "Purpose",
    "Payment method",
    "Transaction ref",
    "Receipt no",
    "Status",
    "Recorded by",
    "Remarks",
  ];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...store.donations.map((d) =>
      [
        d.date,
        d.donorName,
        d.donorOrganisation ?? "",
        SOURCE_LABELS[d.source],
        d.amount,
        d.purpose,
        d.paymentMethod,
        d.transactionReference ?? "",
        d.receiptNumber ?? "",
        d.status,
        d.recordedBy,
        d.remarks ?? "",
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-donations.csv";
  a.click();
  URL.revokeObjectURL(url);
}
