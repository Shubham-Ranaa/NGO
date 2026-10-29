"use client";

import {
  Building2Icon,
  DatabaseBackupIcon,
  PaletteIcon,
  SaveIcon,
  ShieldIcon,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organisation settings"
        description="Organisation profile, branding and data tools. These fields feed the public website, receipts and published reports in the live platform."
        actions={<StatusBadge tone="info">Read-only in Phase 2</StatusBadge>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Card className="card-lift h-full hover:ring-primary/25">
            <CardContent className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                  <Building2Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-semibold tracking-tight">
                    Organisation profile
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Editable once the settings module lands in Phase 9.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="settings-name">Organisation name</FieldLabel>
                  <Input id="settings-name" defaultValue={siteConfig.name} disabled />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="settings-email">Public email</FieldLabel>
                    <Input id="settings-email" defaultValue={siteConfig.contact.email} disabled />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="settings-phone">Public phone</FieldLabel>
                    <Input id="settings-phone" defaultValue={siteConfig.contact.phone} disabled />
                  </Field>
                </div>
                <Field>
                  <FieldDescription>
                    Values come from the seeded organisation record; editing is
                    wired with persistence.
                  </FieldDescription>
                </Field>
              </div>

              <Button size="sm" disabled className="mt-auto w-fit gap-1.5">
                <SaveIcon className="size-3.5" aria-hidden="true" />
                Save changes
              </Button>
            </CardContent>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal delay={0.05}>
            <Card className="card-lift hover:ring-primary/25">
              <CardContent className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                  <PaletteIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-semibold tracking-tight">
                    Branding
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Primary tone and typeface come from the design tokens —
                    light and dark themes are already live via the header toggle.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="size-6 rounded-md bg-[var(--primary)] shadow-sm ring-1 ring-inset ring-black/5" aria-hidden="true" />
                    <span className="size-6 rounded-md bg-[var(--secondary)] shadow-sm ring-1 ring-inset ring-black/5" aria-hidden="true" />
                    <span className="size-6 rounded-md bg-[var(--accent)] shadow-sm ring-1 ring-inset ring-black/5" aria-hidden="true" />
                    <span className="size-6 rounded-md bg-[var(--success)] shadow-sm ring-1 ring-inset ring-black/5" aria-hidden="true" />
                    <Badge variant="outline" className="ms-1">oklch tokens</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="card-lift border-dashed ring-border/60">
              <CardContent className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <DatabaseBackupIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-1 flex-col items-start gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-semibold tracking-tight">
                      Data tools
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reset restores every seed file. Destructive routes always
                      confirm first.
                    </p>
                  </div>
                  <ConfirmDialog
                    destructive
                    title="Reset demo data?"
                    description="This restores all records to their seeded values. Your local changes will be discarded."
                    confirmLabel="Reset data"
                    onConfirm={() => {
                      toast.success("Demo data restored", {
                        description: "Seed values will be re-applied by the storage layer in Phase 4.",
                      });
                    }}
                    trigger={<Button variant="destructive" size="sm">Reset demo data</Button>}
                  />
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldIcon className="size-3.5" aria-hidden="true" />
                    Nothing leaves your browser — ever.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
