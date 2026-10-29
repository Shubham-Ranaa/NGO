import Link from "next/link";
import {
  ArrowRightIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";

const ACTIONS: { title: string; description: string; href: string; icon: LucideIcon }[] = [
  {
    title: "Become a volunteer",
    description: "Give a few hours a month — field work, mentoring or data entry, matched to your skills.",
    href: "/volunteer",
    icon: HeartHandshakeIcon,
  },
  {
    title: "Partner with us",
    description: "Fund a programme, lend technical capacity or co-design the next intervention.",
    href: "/partners",
    icon: HandshakeIcon,
  },
  {
    title: "Donate",
    description: "Choose a campaign line and follow exactly where every rupee lands.",
    href: "/donate",
    icon: HandCoinsIcon,
  },
];

export function GetInvolved() {
  return (
    <section id="get-involved" className="border-b bg-background py-16 lg:py-24">
      <div className="container-wide">
        <Reveal>
          {/* The panel keeps every colour on-token: primary surface inverts its
              own foreground pair in both themes, so no hardcoded hexes. */}
          <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-12 shadow-xl shadow-primary/20 sm:px-10 lg:px-14 lg:py-16">
            {/* Texture + soft highlights layered over the brand surface. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-grid [--grid-line:oklch(1_0_0_/_0.09)]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-72 -z-10 rounded-full bg-chart-3/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[-10rem] -left-20 size-80 -z-10 rounded-full bg-primary-foreground/15 blur-3xl"
            />

            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary-foreground/80 uppercase">
                Get involved
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-primary-foreground text-balance sm:text-4xl">
                Every rupee and every hour lands somewhere visible.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                Pick how you want to help. Whichever door you choose, the same
                public ledger tracks what it produced.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {ACTIONS.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex flex-col gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-foreground/40 hover:bg-primary-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                      <ActionIcon className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-primary-foreground">
                        {action.title}
                      </span>
                      <span className="text-sm leading-relaxed text-primary-foreground/75">
                        {action.description}
                      </span>
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground">
                      Take me there
                      <ArrowRightIcon
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="mt-8 text-xs text-primary-foreground/70">
              Prototype notice — no real donations are collected, volunteers are
              matched only in demo data.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
