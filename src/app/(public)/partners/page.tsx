import type { Metadata } from "next";
import { Building2Icon, HandshakeIcon } from "lucide-react";

import { DemoAction } from "@/components/public/demo-action";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
};

export default function PartnersPage() {
  const partners = getPartners();
  const categories = [...new Set(partners.map((partner) => partner.category))];

  return (
    <>
      <PageBanner
        eyebrow="Partners"
        title="Backed by institutions that stay for years."
        description="From trusts to CSR units, our partners fund outcomes — not visibility. these are sample profiles for the prototype."
      />

      <section className="container-wide py-14 lg:py-20">
        {categories.map((category, categoryIndex) => (
          <div
            key={category}
            className={categoryIndex > 0 ? "mt-12" : undefined}
          >
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                {category}
              </h2>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-border"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partners
                .filter((partner) => partner.category === category)
                .map((partner, index) => (
                  <Reveal key={partner.id} delay={(index % 3) * 0.06}>
                    <Card className="card-lift h-full hover:ring-primary/25">
                      <CardContent className="flex h-full flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                            <Building2Icon className="size-5" aria-hidden="true" />
                          </span>
                          <Badge variant="outline">Since {partner.since}</Badge>
                        </div>
                        <p className="font-medium text-foreground">
                          {partner.name}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {partner.contribution}
                        </p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}

        <Card className="mt-14 border-dashed bg-gradient-to-br from-primary/8 via-card to-secondary/50 ring-border/60">
          <CardContent className="flex flex-col gap-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <HandshakeIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  Want your organisation on this page?
                </p>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  We onboard a small number of CSR and institutional partners each
                  quarter, each with a published allocation and review cadence.
                </p>
              </div>
            </div>
            <DemoAction
              label="Start a partnership"
              title="Forms arrive in Phase 6"
              description="Partnership applications will land in the console with review states."
              className="h-10"
            />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
