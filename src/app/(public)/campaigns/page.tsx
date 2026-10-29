import type { Metadata } from "next";

import { DemoAction } from "@/components/public/demo-action";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { clampPercent, formatCompactCurrency, formatDate } from "@/lib/format";
import { getCampaigns, statusLabel, statusTone } from "@/lib/content";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default function CampaignsPage() {
  const campaigns = getCampaigns();
  const active = campaigns.filter((campaign) => campaign.status === "active");
  const archived = campaigns.filter((campaign) => campaign.status !== "active");

  return (
    <>
      <PageBanner
        eyebrow="Fundraising"
        title="Live drives with posted goals and daily receipts."
        description="Campaign figures in this prototype are samples. When the payments phase lands, every rupee raised lands here with a receipt trail."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-2">
          {active.map((campaign, index) => {
            const percent = clampPercent(campaign.raisedInr / campaign.goalInr * 100);
            return (
              <Reveal key={campaign.id} delay={index * 0.06}>
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
                        {campaign.title}
                      </p>
                      <StatusBadge tone={statusTone(campaign.status)} dot>
                        {statusLabel(campaign.status)}
                      </StatusBadge>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {campaign.summary}
                    </p>
                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          {formatCompactCurrency(campaign.raisedInr)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          of {formatCompactCurrency(campaign.goalInr)} goal
                        </span>
                      </div>
                      <Progress value={percent} aria-label={`${campaign.title} funding progress`} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDate(campaign.startDate)} →{" "}
                          {formatDate(campaign.endDate)}
                        </span>
                        <span className="font-medium text-primary">
                          {Math.round(percent)}%
                        </span>
                      </div>
                      <DemoAction
                        label="Donate to this campaign"
                        title="Payments arrive in Phase 5"
                        description="The donation flow will pre-select this campaign with UPI, card and receipt generation."
                        className="h-10 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {archived.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Past drives
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {archived.map((campaign) => {
                const percent = Math.round(campaign.raisedInr / campaign.goalInr * 100);
                return (
                  <Card key={campaign.id} className="h-full opacity-90">
                    <CardContent className="flex h-full flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-snug text-foreground">
                          {campaign.title}
                        </p>
                        <StatusBadge tone={statusTone(campaign.status)}>
                          {statusLabel(campaign.status)}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {campaign.summary}
                      </p>
                      <div className="mt-auto pt-1 text-xs text-muted-foreground">
                        Closed at {percent}% of the{" "}
                        {formatCompactCurrency(campaign.goalInr)} goal
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
