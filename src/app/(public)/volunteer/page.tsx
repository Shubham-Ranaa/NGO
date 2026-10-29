import type { Metadata } from "next";
import {
  BadgeCheckIcon,
  ClockIcon,
  MapPinIcon,
  SproutIcon,
  UsersIcon,
} from "lucide-react";

import { DemoAction } from "@/components/public/demo-action";
import { PageBanner } from "@/components/public/page-banner";
import { ProgramIcon } from "@/components/public/program-icon";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProgram, getVolunteerOpportunities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Volunteer",
};

const BENEFITS = [
  { icon: BadgeCheckIcon, label: "Orientation & certificates" },
  { icon: UsersIcon, label: "Field supervisors nearby" },
  { icon: SproutIcon, label: "Real programme ownership" },
  { icon: ClockIcon, label: "Flexible micro-shifts" },
];

export default function VolunteerPage() {
  const opportunities = getVolunteerOpportunities();

  return (
    <>
      <PageBanner
        eyebrow="Get involved"
        title="Volunteer where the work actually happens."
        description="Roles below are refreshingly concrete — a day, a camp or a season. Applications are reviewed on a rolling basis."
      />

      <section className="container-wide py-14 lg:py-20">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.label}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {benefit.label}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {opportunities.map((role, index) => {
            const program = getProgram(role.programSlug);
            return (
              <Reveal key={role.id} delay={(index % 2) * 0.08}>
                <Card
                  className={
                    role.open
                      ? "card-lift h-full hover:ring-primary/25"
                      : "h-full opacity-85"
                  }
                >
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {program ? (
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                            <ProgramIcon name={program.icon} className="size-5" />
                          </span>
                        ) : null}
                        <div>
                          <p className="font-medium leading-snug text-foreground">
                            {role.title}
                          </p>
                          <p className="text-xs text-primary">
                            {program?.name ?? role.programSlug}
                          </p>
                        </div>
                      </div>
                      <Badge variant={role.open ? "secondary" : "outline"}>
                        {role.open ? `${role.seats} seats` : "Applications closed"}
                      </Badge>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {role.summary}
                    </p>

                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <li className="inline-flex items-center gap-1.5">
                        <ClockIcon className="size-3.5" aria-hidden="true" />
                        {role.commitment}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <MapPinIcon className="size-3.5" aria-hidden="true" />
                        {role.location}
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-auto pt-1">
                      <DemoAction
                        label={role.open ? "Apply for this role" : "Join the waitlist"}
                        variant={role.open ? "default" : "outline"}
                        title="Applications arrive in Phase 6"
                        description="The volunteer module will store applications, approvals and assignments in the console."
                        className="h-10 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
