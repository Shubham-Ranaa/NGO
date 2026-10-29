import { ShieldCheckIcon } from "lucide-react";

import partnersData from "@/data/partners.json";
import type { Partner } from "@/types/content";
import { cn } from "@/lib/utils";

const PARTNERS = partnersData as Partner[];

/**
 * Looping partner strip. The list is rendered twice for a seamless loop;
 * the duplicate carries aria-hidden so screen readers announce one copy,
 * and the animation is killed globally under prefers-reduced-motion.
 */
export function Partners() {
  return (
    <section id="partners" className="border-b bg-background">
      <div className="container-wide py-10 lg:py-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
            Partners
          </p>
          <h2 className="text-sm text-muted-foreground">
            Corporate, institutional and community partners who track the same
            public ledger we publish.
          </h2>
        </div>

        <div className="relative mt-8">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee items-stretch gap-3 hover:[animation-play-state:paused]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1 ? "true" : undefined}
                  className="flex items-stretch gap-3 pe-3"
                >
                  {PARTNERS.map((partner) => (
                    <li
                      key={`${copy}-${partner.id}`}
                      className={cn(
                        "flex min-w-56 flex-col items-start justify-center gap-0.5 rounded-xl border bg-card/70 px-4 py-3",
                      )}
                    >
                      <span className="text-sm font-semibold whitespace-nowrap text-foreground">
                        {partner.name}
                      </span>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {partner.category} · since {partner.since}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
