import type { Metadata } from "next";

import { PageBanner } from "@/components/public/page-banner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Terms of use",
};

const SECTIONS = [
  {
    title: "Demo status",
    body: "This platform is a working prototype. Content, names, people and figures are fictional. Nothing here constitutes an offer, a receipt of a real donation or professional advice.",
  },
  {
    title: "Use of the site",
    body: "You may explore, click, submit and break things — it is what prototypes are for. Recompiling, misrepresenting the platform as a live NGO or commercialising its content is not permitted.",
  },
  {
    title: "Content and marks",
    body: "Text, figures and layouts belong to the demonstrated project template unless credited otherwise. The Sahyog wordmark and sprout device are reserved for the launched organisation.",
  },
  {
    title: "Limitation of liability",
    body: "The prototype is provided as-is. The build team is not liable for decisions taken on demo data; verify figures on any live successor before relying on them.",
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Terms of use"
        description="Short, readable and unconventional — because a transparency-first organisation owes clarity here too."
        actions={<StatusBadge tone="info">Version 2 · {formatDate("2026-05-01")}</StatusBadge>}
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {SECTIONS.map((section, index) => (
            <Card key={section.title}>
              <CardContent className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
