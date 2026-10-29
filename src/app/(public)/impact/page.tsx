import type { Metadata } from "next";

import { CountUp } from "@/components/public/count-up";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { getImpactStats, getStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impact",
};

export default function ImpactPage() {
  const stats = getImpactStats();
  const stories = getStories();
  const testimonials = stories.filter((story) => story.kind === "testimonial");
  const fieldStories = stories.filter((story) => story.kind === "story");

  return (
    <>
      <PageBanner
        eyebrow="Impact"
        title="Numbers with provenance, not decoration."
        description="These figures demonstrate the presentation layer. Once the data layer is live each metric links to the records behind it."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.06}>
              <StatCard
                label={stat.label}
                value={
                  <CountUp
                    value={stat.value}
                    notation={stat.value >= 1000000 ? "compact" : "standard"}
                  />
                }
                hint={stat.note}
                className="card-lift h-full"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Voices from the field
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((quote, index) => (
              <Reveal key={quote.id} delay={(index % 3) * 0.07}>
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-4">
                    <span
                      aria-hidden="true"
                      className="font-heading text-4xl leading-none text-primary/40"
                    >
                      “
                    </span>
                    <p className="text-base leading-relaxed text-foreground">
                      {quote.quote ?? quote.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-secondary to-accent text-xs font-bold text-secondary-foreground">
                        {(quote.author ?? "S").slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 text-sm">
                        <p className="truncate font-medium text-foreground">
                          {quote.author}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {quote.role} · {quote.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Field stories
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {fieldStories.map((story, index) => (
              <Reveal key={story.id} delay={(index % 2) * 0.08}>
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      {story.location}
                    </p>
                    <p className="font-heading text-lg font-semibold leading-snug text-foreground">
                      {story.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {story.excerpt}
                    </p>
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                      }).format(new Date(story.date))}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
