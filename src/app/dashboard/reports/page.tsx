"use client";

import { useState } from "react";
import {
  FileTextIcon,
  DownloadIcon,
  PrinterIcon,
  AlertTriangleIcon,
  HandCoinsIcon,
  WalletIcon,
  IndianRupeeIcon,
} from "lucide-react";

import {
  getStore,
  totals,
  monthlySummary,
  expensesByCategory,
  unverifiedTransactions,
  missingReceipts,
  setOpeningBalance,
} from "@/lib/store";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#16a34a", "#dc2626", "#2563eb", "#7c3aed", "#ca8a04", "#0891b2"];

export default function ReportsPage() {
  const store = getStore();
  const t = totals();
  const monthly = monthlySummary(6);
  const byCategory = expensesByCategory();
  const unverified = unverifiedTransactions();
  const missing = missingReceipts();
  const [opening, setOpeningLocal] = useState(String(store.openingBalance));

  return (
    <div className="space-y-6">
      {/* Disclaimer banner */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="mt-0.5 size-5 text-amber-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-amber-800">Transparency disclaimer</p>
              <p className="text-sm text-amber-700">
                This system improves recordkeeping but does not independently verify
                transactions, prevent all fraud, or replace formal accounting and
                audits. Figures are sourced from records entered in this demo — all
                clearly labelled as synthetic sample data unless you add real records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening balance control */}
      <Card>
        <CardHeader>
          <CardTitle>Recorded fund balance</CardTitle>
          <CardDescription>
            Balance = opening balance + all recorded inflows − all recorded outflows.
            Restricted donations are shown separately where applicable.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <IndianRupeeIcon className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted-foreground">Opening balance (₹)</p>
              <Input
                type="number"
                value={opening}
                onChange={e => setOpeningLocal(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
          <Button onClick={() => { setOpeningBalance(Number(opening) || 0); }} className="gap-2">
            <IndianRupeeIcon className="size-4" aria-hidden="true" />
            Set opening balance
          </Button>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-3xl font-semibold text-foreground tabular-nums">
              {formatCurrency(t.balance)}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              ({formatCurrency(t.verifiedBalance)} verified)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total donations" value={formatCurrency(t.totalDonations)} subtitle={`${t.donationCount} records`} icon={HandCoinsIcon} />
        <KpiCard title="Total expenses" value={formatCurrency(t.totalExpenses)} subtitle={`${t.expenseCount} records`} icon={WalletIcon} />
        <KpiCard title="Verified donations" value={formatCurrency(t.verifiedDonations)} subtitle={`${t.pendingDonations} pending`} icon={HandCoinsIcon} />
        <KpiCard title="Approved expenses" value={formatCurrency(t.approvedExpenses)} subtitle={`${t.pendingExpenses} awaiting`} icon={WalletIcon} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly income vs expense */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly income vs expense</CardTitle>
            <CardDescription>Last six months from recorded donations and expenses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis label={{ value: "₹", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar name="Income" dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar name="Expense" dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by category pie */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by category</CardTitle>
            <CardDescription>Recorded spend, all statuses.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width={260} height={260}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  fill="#8884d8"
                  labelLine={false}
                  label={{ position: "outside" }}
                >
                  {byCategory.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unverified transactions */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-destructive" aria-hidden="true" />
            <CardTitle>Unverified transactions</CardTitle>
            <Badge variant="destructive">{unverified.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unverified.length ? (
                unverified.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-destructive/50 bg-destructive/10 text-sm">
                    <div>
                      <p className="font-medium text-foreground truncate">{tx.type}: {tx.donor}</p>
                      <p className="text-xs text-muted-foreground">{tx.status} • {formatDate(tx.date)}</p>
                    </div>
                    <span className="font-mono text-xs text-destructive">{formatCurrency(tx.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">All transactions verified / approved.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Missing receipts */}
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
            <CardTitle>Missing receipts / invoices</CardTitle>
            <Badge variant="default" className="text-warning">{missing.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {missing.length ? (
                missing.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-warning/50 bg-warning/10 text-sm">
                    <div>
                      <p className="font-medium text-foreground truncate">{m.type}: {m.donor}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                    </div>
                    <span className="font-mono text-xs text-warning">{formatCurrency(m.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No missing documents.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={exportDonationsCsv} className="gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          Export donation register (CSV)
        </Button>
        <Button onClick={exportExpensesCsv} className="gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          Export expense register (CSV)
        </Button>
        <Button onClick={printReport} variant="outline" className="gap-2">
          <PrinterIcon className="size-4" aria-hidden="true" />
          Print transparency report
        </Button>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Reporting period: figures cover all records in the demo store. Public viewer role sees only this transparency page.
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
        <div className="font-heading text-2xl font-semibold text-foreground tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function exportDonationsCsv() {
  const store = getStore();
  const headers = ["Date","Donor","Organisation","Source","Amount (₹)","Purpose","Reference","Receipt #","Status","Remarks","Recorded by"];
  const lines = [headers.join(","), ...store.donations.map(d =>
    [d.date, `"${d.donorName}"`, `"${d.donorOrganisation || ""}"`, d.source, d.amount, `"${d.purpose}"`, `"${d.transactionReference || ""}"`, d.receiptNumber || "", d.status, `"${d.remarks || ""}"`, d.recordedBy].join(","))];
  downloadBlob("ngo-donation-register.csv", lines.join("\n"));
}

function exportExpensesCsv() {
  const store = getStore();
  const headers = ["Date","Category","Amount (₹)","Description","Event","Vendor","Payment method","Reference","Invoice","Submitted by","Reviewed by","Status","Audit note","Created"];
  const lines = [headers.join(","), ...store.expenses.map(e =>
    [e.date, e.category, e.amount, `"${e.description}"`, e.relatedEvent || "", `"${e.vendor || ""}"`, e.paymentMethod, `"${e.reference || ""}"`, e.invoiceFile || "", e.submittedBy, e.reviewedBy || "", e.approvalStatus, `"${e.auditNote || ""}"`, e.createdAt].join(","))];
  downloadBlob("ngo-expense-register.csv", lines.join("\n"));
}

function downloadBlob(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function printReport() {
  window.print();
}
