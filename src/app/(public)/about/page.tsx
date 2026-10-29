import type { Metadata } from "next";

import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getMilestones, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
};

const PILLARS = [
  {
    title: "Our mission",
    body: "Work with village committees, schools and clinics so public infrastructure keeps working long after the ribbon-cutting.",
  },
  {
    title: "Our approach",
    body: "Co-design with the community, publish every rupee of spend and hand over maintenance with a written budget.",
  },
  {
    title: "Our promise",
    body: "Transparency is the product. If a number can be shown openly, it will be shown openly.",
  },
];

export default function AboutPage() {
  const team = getTeam();
  const milestones = getMilestones();

  return (
    <>
      <PageBanner
        eyebrow="About"
        title="Built to stay accountable, not just to launch."
        description="Sahyog Foundation runs development programmes across Maharashtra with one operating principle: what is promised publicly must be measurable publicly."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.07}>
              <Card className="card-lift h-full hover:ring-primary/25">
                <CardContent className="flex flex-col gap-2">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    {pillar.title}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            The people behind it
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A small core team that spends most of its week in the field. These
            profiles are fictional samples for the demonstration build.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={(index % 3) * 0.06}>
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-secondary to-accent text-sm font-bold text-secondary-foreground ring-1 ring-inset ring-primary/10">
                        {member.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-primary">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Milestones
          </h2>
          <ol className="relative mt-8 flex flex-col gap-0 border-s-2 border-dashed border-primary/30 ps-6">
            {milestones.map((milestone, index) => (
              <li key={milestone.id} className="relative pb-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -start-[1.9rem] top-1 grid size-4 place-items-center rounded-full border-2 border-primary/40 bg-background"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>
                <Reveal delay={index * 0.05} y={10}>
                  <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                    {milestone.year}
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {milestone.title}
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Careers — footer deep-links here via /about#careers */}
        <Card id="careers" className="mt-16 scroll-mt-24 border-dashed ring-border/60">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                Careers at Sahyog
              </h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Field coordinators, data fellows and a communications lead are
                the roles we grow into each year. The hiring module lands in
                Phase 8 — until then, email us and we hold your application.
              </p>
            </div>
            <a
              href="mailto:careers@example.org"
              className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Email careers@example.org
            </a>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
