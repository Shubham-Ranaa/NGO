import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  actions,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  actions?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        actions && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-2",
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow ? (
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            <span
              aria-hidden="true"
              className="inline-block h-px w-6 bg-primary/50"
            />
            {eyebrow}
          </p>
        ) : null}

        <Heading className="font-heading text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl lg:text-4xl">
          {title}
        </Heading>

        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
