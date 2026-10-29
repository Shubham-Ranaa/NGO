import Link from "next/link";
import { ArrowLeftIcon, HomeIcon, SearchXIcon } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="container-wide py-6">
        <Logo />
      </div>

      <main className="container-wide flex flex-1 flex-col items-center justify-center gap-6 pb-24 text-center">
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-primary/10"
          />
          <span className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-secondary to-accent text-primary ring-1 ring-inset ring-primary/20">
            <SearchXIcon className="size-7" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            404
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            This page has not been built yet
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            {siteConfig.name} is being delivered phase by phase. Routes for
            campaigns, reports, events and donations are scheduled for Phase 3, so
            this address is not mapped to a page at the moment.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <HomeIcon className="size-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Open management console
            </Link>
          </Button>
        </div>
      </main>

      <footer className="container-wide pb-8">
        <p className="text-center text-xs text-muted-foreground">
          {siteConfig.demoNotice}
        </p>
      </footer>
    </div>
  );
}