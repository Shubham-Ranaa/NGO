import { findAdminNavItem } from "@/config/admin-nav";
import { getModuleSeed, getModuleEmptyIcon } from "@/lib/admin-module-data";
import type { ModuleRecord } from "@/lib/admin-module-data";

import { ModuleTable } from "@/components/admin/module-table";
import { ModuleToolbar } from "@/components/admin/module-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

/**
 * One shell renders every console module: header, toolbar, then a seeded
 * table when JSON content exists or the shared empty state when it does not.
 */
export function AdminModule({
  moduleHref,
  className,
}: {
  moduleHref: string;
  className?: string;
}) {
  const item = findAdminNavItem(moduleHref);

  if (!item) {
    throw new Error(`Unknown module: ${moduleHref}`);
  }

  const seed = getModuleSeed(moduleHref);
  const EmptyIcon = getModuleEmptyIcon(moduleHref);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader
        title={item.label}
        description={item.description}
        actions={
          <StatusBadge tone={seed ? "success" : "neutral"}>
            {seed ? `${seed.rows.length} seeded records` : "Seed pending · Phase 4"}
          </StatusBadge>
        }
      />

      <ModuleToolbar moduleLabel={item.label} />

      {seed ? (
        <Reveal y={12}>
          <ModuleTable columns={seed.columns} rows={seed.rows as ModuleRecord[]} />
        </Reveal>
      ) : (
        <Card className="border-dashed ring-border/60">
          <CardContent>
            <EmptyState
              icon={EmptyIcon}
              title={`No ${item.label.toLowerCase()} recorded yet`}
              description={`The ${item.label.toLowerCase()} module shares the console's empty, loading and error states. Seed data arrives with the storage layer in Phase 4.`}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
