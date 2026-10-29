import type { ReactNode } from "react";

import { SectionHeading } from "@/components/public/section-heading";

/**
 * Compact hero band shared by every public content page so routes opened from
 * the nav all feel like one system.
 */
export function PageBanner({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-muted/30">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[12%] size-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container-wide relative flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
