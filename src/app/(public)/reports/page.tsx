import type { Metadata } from "next";
import { FileDownIcon, FileTextIcon, ScrollTextIcon } from "lucide-react";

import { DemoAction } from "@/components/public/demo-action";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getReports } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reports",
};

const KIND_LABELS: Record<string, string> = {
  annual: "Annual report",
  financial: "Financial statement",
  programme: "Programme review",
  impact: "Impact report",
};

export default function ReportsPage() {
  const reports = getReports();
  const years = [...new Set(reports.map((report) => report.year))];

  return (
    <>
      <PageBanner
        eyebrow="Transparency"
        title="Read the work in our own words."
        description="Sample documents demonstrate the reporting interface. Each is dated, paginated and downloadable in the live phase."
      />

      <section className="container-wide py-14 lg:py-20">
        {years.map((year, yearIndex) => (
          <div key={year} className={yearIndex > 0 ? "mt-12" : undefined}>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                {year}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports
                .filter((report) => report.year === year)
                .map((report, index) => (
                  <Reveal key={report.id} delay={(index % 3) * 0.06}>
                    <Card className="card-lift flex h-full hover:ring-primary/25">
                      <CardContent className="flex h-full w-full flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                            {report.kind === "financial" ? (
                              <ScrollTextIcon className="size-5" aria-hidden="true" />
                            ) : (
                              <FileTextIcon className="size-5" aria-hidden="true" />
                            )}
                          </span>
                          <StatusBadge tone="info">{KIND_LABELS[report.kind] ?? report.kind}</StatusBadge>
                        </div>
                        <p className="font-medium leading-snug text-foreground">
                          {report.title}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {report.summary}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">
                            {report.pages} pages · published{" "}
                            {formatDate(report.publishedOn)}
                          </p>
                          <DemoAction
                            label="Download PDF"
                            variant="outline"
                            size="sm"
                            icon={<FileDownIcon className="size-4" aria-hidden="true" />}
                            title="Downloads arrive in Phase 7"
                            description="Report files attach to the content module with versioning."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
