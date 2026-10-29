import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDaysIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  SproutIcon,
} from "lucide-react";

import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Get involved",
};

const PATHS = [
  {
    href: "/volunteer",
    icon: HeartHandshakeIcon,
    title: "Volunteer",
    description:
      "Join a water audit day, usher a health camp or mentor an evening study circle.",
    cta: "See open roles",
  },
  {
    href: "/events",
    icon: CalendarDaysIcon,
    title: "Attend an event",
    description:
      "Camps, audits and community workshops happen every month across our districts.",
    cta: "View the calendar",
  },
  {
    href: "/partners",
    icon: HandshakeIcon,
    title: "Partner with us",
    description:
      "Institutional donors, CSR teams and local vendors keep the programmes running.",
    cta: "Meet our partners",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageBanner
        eyebrow="Get involved"
        title="Three ways to be part of the work."
        description="Time, presence and partnership all compound. Pick the one that fits and we will take it from there."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {PATHS.map((path, index) => {
            const Icon = path.icon;
            return (
              <Reveal key={path.href} delay={index * 0.08}>
                <Card className="card-lift group h-full hover:ring-primary/30">
                  <CardContent className="flex h-full flex-col gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="font-heading text-xl font-semibold text-foreground">
                      {path.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {path.description}
                    </p>
                    <Link
                      href={path.href}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {path.cta}
                      <SproutIcon
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-dashed bg-card/60 px-6 py-8 text-center">
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Not sure where you fit?
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Write to {siteConfig.contact.email} or call {siteConfig.contact.phone}{" "}
            and we will match you with the next activity that needs hands and
            hearts.
          </p>
        </div>
      </section>
    </>
  );
}
