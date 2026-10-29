import type { Metadata } from "next";
import { ShieldCheckIcon } from "lucide-react";

import { DonateForm, type DonateCampaign } from "@/components/public/donate-form";
import { PageBanner } from "@/components/public/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { clampPercent, formatCompactCurrency } from "@/lib/format";
import { getCampaigns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
};

const ASSURANCES = [
  "Payments phase lands next — this page shows the exact flow.",
  "Campaign allocation is chosen by you, visible on the receipt.",
  "Grievance and refund contacts published for every drive.",
];

export default function DonatePage() {
  const campaigns: DonateCampaign[] = getCampaigns()
    .filter((campaign) => campaign.status === "active")
    .map((campaign) => ({
      slug: campaign.slug,
      title: campaign.title,
      raised: formatCompactCurrency(campaign.raisedInr),
      goal: formatCompactCurrency(campaign.goalInr),
      percent: Math.round(clampPercent((campaign.raisedInr / campaign.goalInr) * 100)),
    }));

  return (
    <>
      <PageBanner
        eyebrow="Donate"
        title="Every rupee, traceable to the last mile."
        description="This page demonstrates the validation, allocation and receipts flow of the live giving experience."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  Give where it counts
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Amount tiers map to real line items from our programme budgets
                  (sample figures).
                </p>
              </div>
              <DonateForm campaigns={campaigns} />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="bg-gradient-to-br from-primary/8 via-card to-secondary/50 ring-border/60">
              <CardContent className="flex flex-col gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheckIcon className="size-5" aria-hidden="true" />
                </span>
                <p className="font-heading text-lg font-semibold text-foreground">
                  What makes giving here different
                </p>
                <ul className="flex flex-col gap-2.5">
                  {ASSURANCES.map((assurance) => (
                    <li
                      key={assurance}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {assurance}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-foreground">
                  Where your money goes (sample)
                </p>
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.slug} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-muted-foreground">
                      {campaign.title}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-foreground">
                      {campaign.raised} / {campaign.goal}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
