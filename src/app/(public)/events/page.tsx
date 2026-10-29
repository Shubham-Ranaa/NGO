import type { Metadata } from "next";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";

import { DemoAction } from "@/components/public/demo-action";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import { getEvents, statusLabel, statusTone } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export default function EventsPage() {
  const events = getEvents();
  const upcoming = events.filter((event) => event.status === "upcoming");
  const past = events.filter((event) => event.status !== "upcoming");

  return (
    <>
      <PageBanner
        eyebrow="Community"
        title="Camps, audits and study circles near you."
        description="Registrations arrive with the events phase — capacity and status below reflect the seeded demo calendar."
      />

      <section className="container-wide py-14 lg:py-20">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Upcoming
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {upcoming.map((event, index) => {
            const percent = Math.round(event.registered / event.capacity * 100);
            return (
              <Reveal key={event.id} delay={(index % 2) * 0.07}>
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="grid w-14 shrink-0 place-items-center rounded-xl border bg-gradient-to-br from-secondary to-accent py-2 text-center text-secondary-foreground ring-1 ring-inset ring-primary/10">
                          <span className="text-lg font-semibold leading-none">
                            {new Intl.DateTimeFormat("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(event.date))}
                          </span>
                          <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-wider">
                            {new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).format(new Date(event.date))}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium leading-snug text-foreground">
                            {event.title}
                          </p>
                          <p className="mt-0.5 text-xs text-primary">
                            {event.category}
                          </p>
                        </div>
                      </div>
                      <StatusBadge tone={statusTone(event.status)} dot>
                        {statusLabel(event.status)}
                      </StatusBadge>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {event.summary}
                    </p>

                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <li className="inline-flex items-center gap-1.5">
                        <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
                        {dateFormatter.format(new Date(event.date))}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <MapPinIcon className="size-3.5" aria-hidden="true" />
                        {event.venue}, {event.city}
                      </li>
                    </ul>

                    <div className="mt-auto flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <UsersIcon className="size-3.5" aria-hidden="true" />
                          {formatNumber(event.registered)} of{" "}
                          {formatNumber(event.capacity)} registered
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <Progress value={percent} aria-label={`${event.title} registration level`} />
                      <DemoAction
                        label="Register for this event"
                        title="Registrations arrive in Phase 6"
                        description="The events module will open sign-ups with capacity checks and attendance recording."
                        className="h-10 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {past.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Recently completed
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <Card key={event.id} className="h-full opacity-90">
                  <CardContent className="flex h-full flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-snug text-foreground">
                        {event.title}
                      </p>
                      <StatusBadge tone={statusTone(event.status)}>
                        {statusLabel(event.status)}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.summary}</p>
                    <div className="mt-auto flex flex-col gap-2 pt-1">
                      <Badge variant="outline" className="w-fit font-normal">
                        {event.city}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(new Date(event.date))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
