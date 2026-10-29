import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Backable seed tables for console modules. Columns are simple strings; cells
 * may include badges and formatted values. Row keys come from the data layer.
 */
export function ModuleTable({
  columns,
  rows,
}: {
  columns: string[];
  /** One entry per record: id + ordered cells matching `columns`. */
  rows: { id: string; cells: ReactNode[] }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="transition-colors hover:bg-primary/[0.03]">
              {row.cells.map((cell, index) => (
                <TableCell key={`${row.id}-${index}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
