import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowUpIcon, MailIcon, MapPinIcon, PhoneIcon, SproutIcon } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

/**
 * Minimal stroke-style glyphs for the social links (this lucide build ships no
 * brand icons). Kept inline so the footer stays a single dependency-free file.
 */
const SOCIAL_GLYPHS: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  linkedin: function LinkedInGlyph(props) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
        <path d="M7 10.5v6" />
        <circle cx="7" cy="7.6" r="0.5" fill="currentColor" stroke="none" />
        <path d="M11.2 16.5v-3.4a2.65 2.65 0 0 1 5.3 0v3.4" />
        <path d="M11.2 10.5v1.6" />
      </svg>
    );
  },
  instagram: function InstagramGlyph(props) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.1" cy="6.9" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    );
  },
  x: function XGlyph(props) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" {...props}>
        <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />
      </svg>
    );
  },
  youtube: function YouTubeGlyph(props) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
        <path d="m10.2 9.4 4.9 2.6-4.9 2.6z" fill="currentColor" stroke="none" />
      </svg>
    );
  },
};

function socialGlyph(label: string) {
  const key = label.toLowerCase().replace(/[^a-z]/g, "");
  return SOCIAL_GLYPHS[key] ?? SOCIAL_GLYPHS.x;
}

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t bg-muted/40">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="container-wide relative pb-10 pt-12">
        {/* CTA band */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-9 text-primary-foreground shadow-lg shadow-primary/20 sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-20 size-64 rounded-full border-[10px] border-primary-foreground/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-24 size-52 rounded-full bg-primary-foreground/10 blur-xl"
          />
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-30"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-80">
                Get involved
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Every contribution becomes measurable change.
              </h2>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                Donate, volunteer at an upcoming camp or partner with us — the
                whole journey is transparent.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <SproutIcon className="size-4" aria-hidden="true" />
                Donate now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-xl border border-primary-foreground/35 bg-transparent px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{siteConfig.contact.addressLines.join(", ")}</span>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <MailIcon className="size-4 shrink-0" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <PhoneIcon className="size-4 shrink-0" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>

            <ul className="mt-1 flex items-center gap-2">
              {siteConfig.social.map((link) => {
                const Glyph = socialGlyph(link.label);
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      aria-label={link.label}
                      rel="noreferrer noopener"
                      target="_blank"
                      className="grid size-9 place-items-center rounded-full border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Glyph className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {siteConfig.footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[0.7rem] font-semibold tracking-[0.14em] text-foreground uppercase sm:text-sm sm:tracking-normal sm:normal-case">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Made for community-first teams
            </p>

            <a
              href="#main-content"
              aria-label="Back to top"
              className="grid size-9 shrink-0 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ArrowUpIcon className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <p className="mt-6 rounded-xl border border-dashed bg-background/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Prototype notice.</strong>{" "}
          {siteConfig.demoNotice} No real donations are collected, no receipts are
          issued and no real beneficiary information is stored. Data entered in this
          demo is saved only in your own browser and is not shared between devices.
        </p>
      </div>
    </footer>
  );
}
