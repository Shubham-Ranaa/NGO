import Link from "next/link";
import { SproutIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Brand mark: a sprouting seed inside a soft green disc, echoing the
 * organisation's "community-led change" positioning. Used by the public
 * navbar/footer, the admin sidebar and the 404 page.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm ring-1 ring-primary/25",
        className,
      )}
    >
      {/* Soft highlight so the disc reads as a chip rather than a flat square. */}
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary-foreground/25 blur-[2px]"
      />
      <SproutIcon className="relative size-4.5" aria-hidden="true" />
    </span>
  );
}

export function Logo({
  href = "/",
  showText = true,
  className,
}: {
  href?: string;
  showText?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={siteConfig.name}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      {showText ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-heading text-base font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </span>
          <span className="text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Demo platform
          </span>
        </span>
      ) : null}
    </Link>
  );
}
