"use client";

import { DownloadIcon, FilterIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Toolbar shared by every console module: filters, import/export and record
 * creation. Real persistence lands in Phase 4–5, so actions explain their
 * status honestly rather than failing silently.
 */
export function ModuleToolbar({ moduleLabel }: { moduleLabel: string }) {
  const soon = (action: string) =>
    toast.info(`${action} — arrives with the data layer`, {
      description: `${moduleLabel} records become editable in Phase 4 and exportable in Phase 7.`,
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => soon("Filters")}>
        <FilterIcon className="size-3.5" aria-hidden="true" />
        Filters
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => soon("Export")}>
        <DownloadIcon className="size-3.5" aria-hidden="true" />
        Export
      </Button>
      <Button size="sm" className="ms-auto gap-1.5 shadow-sm" onClick={() => soon("New record")}>
        <PlusIcon className="size-3.5" aria-hidden="true" />
        New {moduleLabel.toLowerCase()}
      </Button>
    </div>
  );
}
