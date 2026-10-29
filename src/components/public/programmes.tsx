import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  DropletsIcon,
  GraduationCapIcon,
  HeartIcon,
  HouseIcon,
  StethoscopeIcon,
  WheatIcon,
  WindIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import programsData from "@/data/programs.json";
import type { ContentIconName, Program } from "@/types/content";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/public/section-heading";

/**
 * The icon names in the content model map to lucide marks here. `globe` has
 * no glyph in this lucide version, so climate resilience renders the wind
 * icon that carries the same meaning.
 */
const PROGRAM_ICONS: Record<ContentIconName, LucideIcon> = {
  droplets: DropletsIcon,
  stethoscope: StethoscopeIcon,
  wheat: WheatIcon,
  graduation: GraduationCapIcon,
  home: HouseIcon,
  book: BookOpenIcon,
  globe: WindIcon,
  heart: HeartIcon,
};

/** Categorical tints rotate through the data-visualisation palette. */
const PROGRAM_TINTS = [
  "bg-chart-1/12 text-chart-1",
  "bg-chart-4/12 text-chart-4",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-5/12 text-chart-5",
] as const;

const FEATURED_PROGRAMS = (programsData as Program[]).filter(
  (program) => program.featured,
);

export function Programmes() {
  return (
    <section id="programmes" className="relative border-b bg-muted/30">
      <div className="container-wide py-16 lg:py-24">
        <SectionHeading
          eyebrow="Our work"
          title="Programmes built with communities, not for them"
          description="Six long-term programme areas connect every project, donation and volunteer hour. Each one keeps its data public, down to the village ledger."
          actions={
            <Link
              href="/our-work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Explore all our work
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PROGRAMS.map((program, index) => {
            const ProgramIcon = PROGRAM_ICONS[program.icon];
            return (
              <Reveal key={program.id} delay={index * 0.07}>
                <Link
                  href="/our-work"
                  className="card-lift group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  aria-label={`Learn about the ${program.name} programme`}
                >
                  <span
                    className={`grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${PROGRAM_TINTS[index % PROGRAM_TINTS.length]}`}
                  >
                    <ProgramIcon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {program.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {program.tagline}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more
                    <ArrowRightIcon
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
