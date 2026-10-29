import type { Metadata } from "next";

import { PageBanner } from "@/components/public/page-banner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Privacy policy",
};

const SECTIONS = [
  {
    title: "What this prototype stores",
    body: "Sahyog Foundation is a demonstration build. No personal data is transmitted to any server. Everything you type stays inside your own browser storage and clears when you reset the demo.",
  },
  {
    title: "What the live platform will collect",
    body: "Name, contact details, donation receipts and volunteer assignments — collected only when required, never sold, and visible to you on your dashboard at all times.",
  },
  {
    title: "Beneficiary protection",
    body: "Person-level beneficiary records are always pseudonymised in public reporting. Individual consent is recorded before any story or photograph is published.",
  },
  {
    title: "Your rights",
    body: "Access, correction, export and deletion requests go to privacy@example.org. Under the demonstrated privacy workflow, the desk must respond within 15 working days.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Privacy policy"
        description="Plain-language commitments. The published policy is drafted in this register, reviewed annually."
        actions={<StatusBadge tone="info">Last reviewed {formatDate("2026-05-01")}</StatusBadge>}
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
