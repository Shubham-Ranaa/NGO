"use client";

import { getStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  HandCoinsIcon,
  WalletIcon,
  CalendarIcon,
  ReceiptIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";

export default function TransparencyPage() {
  const store = getStore();
  const donations = store.donations.filter((d) => d.status === "verified");
  const expenses = store.expenses.filter((e) => e.approvalStatus === "approved");
  const completed = store.events.filter((e) => e.status === "completed");
  const totalDisclosed = donations.reduce((s, d) => s + d.amount, 0);
  const totalReported = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const period = `${now.toLocaleDateString("en-IN", { month: "short" })} ${now.getFullYear()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Public transparency report
          </h1>
          <p className="text-sm text-muted-foreground">
            Approved aggregate information only. Reporting period:{" "}
            <span className="font-medium">{period}</span>. Figures are clearly
            labelled with verification status. This is a demonstration build —
            all data is synthetic unless real records are added.
          </p>
        </div>
        <Link href="/login" className="text-sm text-primary hover:underline">
          Sign in to manage records →
        </Link>
      </div>

      <div className="border border-border rounded-xl bg-card p-6">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          What is shared publicly
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PublicKpi title="Completed events" value={completed.length} icon={CalendarIcon} />
          <PublicKpi title="Disclosed donations (verified)" value={formatCurrency(totalDisclosed)} icon={HandCoinsIcon} />
          <PublicKpi title="Reported expenditure (approved)" value={formatCurrency(totalReported)} icon={WalletIcon} />
          <PublicKpi title="Net disclosed balance" value={formatCurrency(totalDisclosed - totalReported)} icon={ReceiptIcon} />
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Completed events</h2>
          <div className="space-y-2">
            {completed.length ? (
              completed.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border bg-muted/50 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(e.date)} · {e.venue}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{formatCurrency(e.actualExpenses)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No completed events reported yet.</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            Verification status
          </p>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
              <span className="text-muted-foreground">
                Verified donations count toward disclosed totals
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-muted-foreground">
                Pending items are excluded until verified
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Private donor contact details, beneficiary information, internal
            notes and unapproved documents are never published on this page.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <AlertTriangleIcon className="mr-2 size-4 text-amber-600" aria-hidden="true" />
          <p className="text-sm text-amber-700">
            Disclaimer: this system improves recordkeeping but does not
            independently verify transactions, prevent all fraud, or replace
            formal accounting and audits. Published figures are aggregate
            summaries for the period shown above.
          </p>
        </div>
      </div>
    </div>
  );
}

function PublicKpi({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="font-semibold tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  );
}
