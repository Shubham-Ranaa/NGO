import { HandCoinsIcon, MapPinnedIcon, SproutIcon, UsersIcon } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import { CountUp } from "@/components/shared/count-up";
import { Reveal } from "@/components/shared/reveal";

/**
 * These are SAMPLE figures used to demonstrate the metric presentation.
 * Phase 10 replaces them with values derived from the stored data layer.
 */
const SAMPLE_STATS = [
  {
    label: "Active programmes",
    value: 12,
    icon: SproutIcon,
    tint: "bg-chart-1/12 text-chart-1",
  },
  {
    label: "Communities reached",
    value: 248,
    icon: MapPinnedIcon,
    tint: "bg-chart-4/12 text-chart-4",
  },
  {
    label: "Registered volunteers",
    value: 1840,
    icon: UsersIcon,
    tint: "bg-chart-3/15 text-chart-3",
  },
  {
    label: "Donations recorded",
    value: 86,
    icon: HandCoinsIcon,
    tint: "bg-chart-5/12 text-chart-5",
  },
] as const;

export function ImpactStats() {
  return (
    <section className="border-b bg-background">
      <div className="container-wide py-16 lg:py-20">
        <div className="mb-9">
          <SectionHeading
            eyebrow="Impact"
            title="Impact statistics"
            description="Sample figures shown to demonstrate the metric presentation in both themes. Verified numbers are wired in once the data layer lands."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_STATS.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Reveal key={stat.label} delay={index * 0.06}>
                <div className="card-lift group relative rounded-2xl border bg-card p-5 shadow-sm">
                  {/* Hairline accent that brightens as the card is hovered. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.tint}`}
                    >
                      <StatIcon className="size-4.5" aria-hidden="true" />
                    </span>
                  </div>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    <CountUp value={stat.value} />
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Sample data · wire in Phase 10
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
