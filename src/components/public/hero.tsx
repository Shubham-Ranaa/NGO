import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  HandHeartIcon,
  HeartHandshakeIcon,
  SproutIcon,
  TrendingUpIcon,
  HeartIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const FOCUS_AREAS = [
  { label: "Water & sanitation", icon: SproutIcon, detail: "14 projects", tint: "bg-chart-1/15 text-chart-1" },
  { label: "Community health", icon: HeartHandshakeIcon, detail: "9 projects", tint: "bg-chart-3/20 text-chart-3" },
  { label: "Livelihoods", icon: CalendarIcon, detail: "6 projects", tint: "bg-chart-4/20 text-chart-4" },
] as const;

/* Weekly sample series behind the sparkline (values 0–12, drawn to fit). */
const SPARK_POINTS = [3, 5, 4, 6, 9, 7, 11, 8, 12];

function sparkPath(values: readonly number[], width: number, height: number) {
  const step = width / (values.length - 1);
  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - (value / Math.max(...values)) * (height - 4) - 2;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return points.join(" ");
}

const SPARK_LINE = sparkPath(SPARK_POINTS, 240, 72);
const SPARK_AREA = `${SPARK_LINE} L240,72 L0,72 Z`;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b">
      {/* ── Atmosphere: drifting aurora blobs over a hairline grid ── */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial" />
        <div className="absolute -top-32 -left-24 size-[30rem] animate-aurora rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute top-1/4 -right-32 size-[26rem] animate-aurora rounded-full bg-info/15 blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="absolute bottom-[-12rem] left-1/3 size-[24rem] animate-aurora rounded-full bg-chart-3/15 blur-3xl"
          style={{ animationDelay: "-16s" }}
        />
      </div>

      <div className="container-wide grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="flex flex-col items-start gap-6">
          {/* Not a Badge: it must wrap on narrow screens instead of forcing
              the page wider (the Badge primitive is intentionally nowrap). */}
          <p className="inline-flex max-w-full animate-rise-in items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span
              className="relative size-1.5 shrink-0 rounded-full bg-success"
              aria-hidden="true"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
            </span>
            <span className="min-w-0 break-words">{siteConfig.demoNotice}</span>
          </p>

          <h1
            className="font-heading animate-rise-in text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            Community-led change, measured{" "}
            <span className="text-gradient">openly.</span>
          </h1>

          <p
            className="max-w-xl animate-rise-in text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "0.16s" }}
          >
            {siteConfig.name} is a demonstration platform showing how a modern
            non-profit can run its programmes, volunteers, events, donations and
            public reporting from one connected system.
          </p>

          <div
            className="flex animate-rise-in flex-wrap items-center gap-3"
            style={{ animationDelay: "0.24s" }}
          >
            <Button asChild size="lg" className="h-11 gap-1.5 px-6 shadow-md shadow-primary/25">
              <Link href="/donate">
                Donate now
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 bg-background/80 px-6 backdrop-blur"
            >
              <Link href="/volunteer">Become a volunteer</Link>
            </Button>
          </div>

          <p
            className="flex animate-rise-in items-center gap-2 text-xs text-muted-foreground"
            style={{ animationDelay: "0.32s" }}
          >
            <HandHeartIcon className="size-3.5 text-primary" aria-hidden="true" />
            Prototype build — Phase 2 (design system). Donation, volunteer and
            report pages arrive in Phase 3.
          </p>
        </div>

        {/* ── Product visual: a mini operations console with floating live cards ── */}
        <div
          className="relative animate-rise-in"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Floating card — donation */}
          <div
            aria-hidden="true"
            className="absolute -top-7 -right-4 z-10 hidden animate-float items-center gap-3 rounded-2xl border bg-card/95 p-3 pe-4 shadow-lg shadow-primary/10 backdrop-blur sm:flex lg:-right-8"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
              <HeartIcon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-semibold text-foreground tabular-nums">
                ₹2,500 received
              </span>
              <span className="text-[0.7rem] text-muted-foreground">
                Water For All · just now
              </span>
            </span>
          </div>

          {/* Floating card — volunteer activity */}
          <div
            aria-hidden="true"
            className="absolute -bottom-7 -left-4 z-10 hidden animate-float-slow items-center gap-3 rounded-2xl border bg-card/95 p-3 pe-4 shadow-lg shadow-info/10 backdrop-blur sm:flex lg:-left-8"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-info/15 text-info">
              <ClipboardCheckIcon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                Volunteer logged 4 field hours
              </span>
              <span className="text-[0.7rem] text-muted-foreground">
                Balrampur learning centres
              </span>
            </span>
          </div>

          <div
            aria-hidden="true"
            className="relative aspect-4/3 w-full rounded-3xl border bg-card/80 p-6 shadow-xl shadow-primary/5 ring-1 ring-foreground/5 backdrop-blur-sm sm:p-8"
          >
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 size-44 rounded-full bg-secondary/40 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
                  <TrendingUpIcon className="size-3.5" aria-hidden="true" />
                  Live operations
                </span>
                <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                  Sample data
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {FOCUS_AREAS.map((area) => {
                  const AreaIcon = area.icon;
                  return (
                    <div
                      key={area.label}
                      className="flex items-center gap-3 rounded-2xl border bg-background/80 px-4 py-3 shadow-sm transition-colors backdrop-blur hover:border-primary/30"
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${area.tint}`}
                      >
                        <AreaIcon className="size-4" />
                      </span>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {area.label}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {area.detail}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Donations this quarter</span>
                    <span className="font-medium text-foreground tabular-nums">
                      ₹3.2L
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 240 72"
                    preserveAspectRatio="none"
                    className="h-12 w-full sm:h-14"
                  >
                    <defs>
                      <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={SPARK_AREA} fill="url(#hero-spark-fill)" />
                    <path
                      d={SPARK_LINE}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="240"
                      cy={
                        72 -
                        (SPARK_POINTS[SPARK_POINTS.length - 1] /
                          Math.max(...SPARK_POINTS)) *
                          (72 - 4) -
                        2
                      }
                      r="3.5"
                      fill="var(--primary)"
                      stroke="var(--card)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="rounded-xl border bg-card/90 p-3">
                  <div className="mb-2 text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                    Programme completion
                  </div>
                  <div className="flex h-14 items-end gap-1.5">
                    {[42, 58, 71, 64, 88, 76].map((value, index) => (
                      <div
                        key={index}
                        className="w-3 origin-bottom animate-grow-y rounded-t-full bg-primary/70 sm:w-3.5"
                        style={{
                          height: `${value * 0.62}px`,
                          animationDelay: `${0.35 + index * 0.09}s`,
                          opacity: 1 - index * 0.06,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
