"use client";

import { toast } from "sonner";

import { SectionHeading } from "@/components/public/section-heading";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const TOKENS: { name: string; token: string; note: string }[] = [
  { name: "Primary", token: "var(--primary)", note: "Forest green" },
  { name: "Secondary", token: "var(--secondary)", note: "Sage wash" },
  { name: "Accent", token: "var(--accent)", note: "Sage" },
  { name: "Background", token: "var(--background)", note: "Warm cream / charcoal" },
  { name: "Muted", token: "var(--muted)", note: "Subtle surface" },
  { name: "Border", token: "var(--border)", note: "Hairline" },
  { name: "Success", token: "var(--success)", note: "Completed" },
  { name: "Warning", token: "var(--warning)", note: "At risk" },
  { name: "Info", token: "var(--info)", note: "In review" },
  { name: "Destructive", token: "var(--destructive)", note: "Blocked / failed" },
] as const;

const TONES: { tone: StatusTone; label: string }[] = [
  { tone: "neutral", label: "Draft" },
  { tone: "primary", label: "In review" },
  { tone: "success", label: "Completed" },
  { tone: "warning", label: "At risk" },
  { tone: "danger", label: "Blocked" },
  { tone: "info", label: "Scheduled" },
];

export function DesignFoundations() {
  return (
    <section className="bg-muted/30">
      <div className="container-wide py-16 lg:py-20">
        <SectionHeading
          eyebrow="Foundations"
          title="Design system"
          description="The tokens, type scale and controls every page is built from. Use the theme switch in the header to see each one adapt."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 card-lift hover:border-primary/30">
            <h3 className="text-sm font-semibold text-foreground">Colour tokens</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Semantic tokens only — components never hardcode a colour.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {TOKENS.map((token) => (
                <li key={token.name} className="flex items-center gap-3">
                  <span
                    className="size-9 shrink-0 rounded-lg border shadow-sm"
                    style={{ backgroundColor: token.token }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {token.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {token.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-2xl border bg-card p-6 card-lift hover:border-primary/30">
              <h3 className="text-sm font-semibold text-foreground">Typography</h3>
              <p className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground">
                Fraunces — display headings
              </p>
              <p className="mt-3 text-base text-foreground">
                Inter — body copy and interface text.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Inter — secondary text, captions and table cells.
              </p>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Geist Mono fallback — tabular figures & identifiers
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 card-lift hover:border-primary/30">
              <h3 className="text-sm font-semibold text-foreground">Status badges</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {TONES.map((item) => (
                  <StatusBadge key={item.tone} tone={item.tone} dot>
                    {item.label}
                  </StatusBadge>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
                <Button size="sm" variant="ghost">
                  Ghost
                </Button>
                <Button size="sm" variant="destructive">
                  Destructive
                </Button>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="grid gap-2">
                  <label htmlFor="foundation-input" className="text-sm font-medium text-foreground">
                    Form field
                  </label>
                  <Input
                    id="foundation-input"
                    placeholder="Validated, labelled input"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} aria-label="Example progress value 68 percent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 card-lift hover:border-primary/30">
            <h3 className="text-sm font-semibold text-foreground">
              Destructive actions require confirmation
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every reset, archive and delete in the console routes through this
              dialog.
            </p>
            <div className="mt-4">
              <ConfirmDialog
                destructive
                title="Reset demo data?"
                description="This restores all records to their seeded values. Your local changes will be discarded."
                confirmLabel="Reset data"
                onConfirm={() => {
                  toast.success("Confirmation flow works", {
                    description: "The data layer arrives in Phase 4.",
                  });
                }}
                trigger={<Button variant="destructive">Test confirmation</Button>}
              />
            </div>
          </div>

          <EmptyState
            title="No records yet"
            description="Reusable empty, loading and error states are shared by every module so no table is ever blank without explanation."
          />
        </div>
      </div>
    </section>
  );
}