import type { Metadata } from "next";
import Link from "next/link";

import { PageBanner } from "@/components/public/page-banner";
import { ProgramIcon } from "@/components/public/program-icon";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { clampPercent, formatCompactCurrency, formatNumber } from "@/lib/format";
import { getFeaturedProjects, getPrograms, getProjects, statusLabel, statusTone } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our work",
};

export default function OurWorkPage() {
  const programs = getPrograms();
  const projects = getProjects();
  const featured = getFeaturedProjects(3);

  return (
    <>
      <PageBanner
        eyebrow="Our work"
        title="Programmes with plans, budgets and owned upkeep."
        description="Every programme below maps to named projects with published objectives, live progress and a maintenance handover plan."
      />

      <section className="container-wide py-14 lg:py-20">
        {/* Programmes */}
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Programmes
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            const count = projects.filter(
              (project) => project.programSlug === program.slug,
            ).length;
            return (
              <Reveal key={program.id} delay={(index % 3) * 0.06}>
                <Card className="card-lift group h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                        <ProgramIcon name={program.icon} className="size-5" />
                      </span>
                      <Badge variant="outline">
                        {count} {count === 1 ? "project" : "projects"}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-heading text-lg font-semibold text-foreground">
                        {program.name}
                      </p>
                      <p className="mt-1 text-sm text-primary">{program.tagline}</p>
                    </div>
                    <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                      {program.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Featured projects */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured projects
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A sample from the project register — progress is demo data until
              the live data layer is switched on.
            </p>
          </div>
          <Badge variant="outline">{projects.length} total projects</Badge>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.07}>
              <Card className="card-lift h-full hover:ring-primary/25">
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge tone={statusTone(project.status)} dot>
                      {statusLabel(project.status)}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground">
                      {project.location}
                    </span>
                  </div>
                  <p className="font-medium leading-snug text-foreground">
                    {project.title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <div className="mt-auto flex flex-col gap-3 pt-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={clampPercent(project.progress)} aria-label={`${project.title} completion`} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Raised{" "}
                        <strong className="text-foreground">
                          {formatCompactCurrency(project.raisedInr)}
                        </strong>{" "}
                        of {formatCompactCurrency(project.budgetInr)}
                      </span>
                      <span>
                        {formatNumber(project.beneficiaries)} people
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/campaigns"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Support a live campaign
          </Link>
        </div>
      </section>
    </>
  );
}
