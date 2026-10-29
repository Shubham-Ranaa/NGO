import Link from "next/link";
import { ArrowRightIcon, TargetIcon } from "lucide-react";

import campaignsData from "@/data/campaigns.json";
import type { Campaign } from "@/types/content";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import {
  clampPercent,
  formatCompactCurrency,
  formatDate,
} from "@/lib/format";

/**
 * Featured fundraising drives come straight from the campaign seed records,
 * so the progress bars stay in sync with the demo data.
 */
const FEATURED_CAMPAIGNS = (campaignsData as Campaign[])
  .filter((campaign) => campaign.featured && campaign.status === "active")
  .slice(0, 3);

export function CampaignSpotlight() {
  return (
    <section id="campaigns" className="border-b bg-background">
      <div className="container-wide py-16 lg:py-24">
        <SectionHeading
          eyebrow="Fundraising"
          title="Live campaigns, tracked to the rupee"
          description="Every drive publishes its goal, its collections and its completion as it happens. These are the three currently running."
          actions={
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all campaigns
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURED_CAMPAIGNS.map((campaign, index) => {
            const percent = clampPercent((campaign.raisedInr / campaign.goalInr) * 100);
            return (
              <Reveal key={campaign.id} delay={index * 0.07}>
                <article className="card-lift flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <StatusBadge tone="info" dot>
                      Live
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      Ends {formatDate(campaign.endDate)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {campaign.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {campaign.summary}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-foreground tabular-nums">
                        Raised {formatCompactCurrency(campaign.raisedInr)}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        of {formatCompactCurrency(campaign.goalInr)}
                      </span>
                    </div>
                    <Progress value={percent} className="h-2" aria-label={`${campaign.title} funding progress`} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <TargetIcon className="size-3.5" aria-hidden="true" />
                        {Math.round(percent)}% funded
                      </span>
                      <Link
                        href="/donate"
                        className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Support it
                        <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
