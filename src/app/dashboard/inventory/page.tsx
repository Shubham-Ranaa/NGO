"use client";

import { useMemo, useState } from "react";
import {
  BoxesIcon,
  PackageMinusIcon,
  PackagePlusIcon,
  PackageSearchIcon,
  PlusIcon,
  Trash2Icon,
  TruckIcon,
} from "lucide-react";

import {
  addInventory,
  updateInventory,
  deleteInventory,
  getStore,
} from "@/lib/store";
import { Reveal } from "@/components/shared/reveal";
import {
  DownloadButton,
  EmptyState,
  FilterChip,
  FormField,
  HeroStat,
  ModuleFooter,
  ModuleHero,
  ModuleStat,
  SearchBar,
  StatusPill,
  type PillTone,
} from "@/components/dashboard/module-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InventoryForm = {
  name: string;
  category: string;
  quantityReceived: string;
  quantityDistributed: string;
  relatedEvent: string;
  supportingRecord: string;
};

const EMPTY_FORM: InventoryForm = {
  name: "",
  category: "",
  quantityReceived: "",
  quantityDistributed: "",
  relatedEvent: "",
  supportingRecord: "",
};

function stockTone(balance: number): { label: string; tone: PillTone } {
  if (balance <= 0) return { label: "Out of stock", tone: "rose" };
  if (balance <= 5) return { label: "Low stock", tone: "amber" };
  return { label: "In stock", tone: "emerald" };
}

export default function InventoryPage() {
  const store = getStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState<InventoryForm>(EMPTY_FORM);

  const received = store.inventory.reduce((s, i) => s + i.quantityReceived, 0);
  const distributed = store.inventory.reduce((s, i) => s + i.quantityDistributed, 0);
  const balance = store.inventory.reduce((s, i) => s + i.stockBalance, 0);
  const lowItems = store.inventory.filter((i) => i.stockBalance > 0 && i.stockBalance <= 5);
  const outItems = store.inventory.filter((i) => i.stockBalance <= 0);

  const categories = useMemo(
    () => [...new Set(store.inventory.map((i) => i.category).filter(Boolean))].sort(),
    [store.inventory.length]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, { received: number; distributed: number }>();
    for (const i of store.inventory) {
      const key = i.category || "Uncategorised";
      const cur = map.get(key) ?? { received: 0, distributed: 0 };
      cur.received += i.quantityReceived;
      cur.distributed += i.quantityDistributed;
      map.set(key, cur);
    }
    return [...map.entries()]
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.received - a.received)
      .slice(0, 8);
  }, [store.inventory]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.inventory
      .filter((i) => categoryFilter === "all" || (i.category || "Uncategorised") === categoryFilter)
      .filter((i) =>
        q
          ? [i.name, i.category, i.relatedEvent, i.supportingRecord]
              .filter(Boolean)
              .some((f) => String(f).toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => a.stockBalance - b.stockBalance || a.name.localeCompare(b.name));
  }, [store.inventory, categoryFilter, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      quantityReceived: Number(form.quantityReceived) || 0,
      quantityDistributed: Number(form.quantityDistributed) || 0,
    };
    if (editing) {
      updateInventory(editing, payload);
    } else {
      addInventory(payload);
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(false);
  };

  const eventLabel = (id?: string) => store.events.find((e) => e.id === id)?.title;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Reveal>
        <ModuleHero
          gradient="amber"
          eyebrow={
            <>
              <BoxesIcon className="size-3.5" aria-hidden="true" />
              Programmes &amp; people · inventory
            </>
          }
          title="Goods in, goods out, nothing lost."
          description="Track donated goods and purchased supplies — what arrived, what was distributed and what remains on the shelf."
          actions={
            <>
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                  setOpen(true);
                }}
                className="gap-2 bg-white text-amber-950 hover:bg-white/90"
              >
                <PlusIcon className="size-4" aria-hidden="true" />
                New item
              </Button>
              <DownloadButton onClick={exportCsv} label="Export CSV" />
            </>
          }
          stats={
            <>
              <HeroStat label="Stock lines" value={store.inventory.length} note="demo data" />
              <HeroStat label="Units received" value={received} note="across all items" />
              <HeroStat label="Units distributed" value={distributed} note="handed out" />
              <HeroStat label="Current stock" value={balance} note={`${lowItems.length + outItems.length} low/out`} />
            </>
          }
        />
      </Reveal>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <ModuleStat title="Stock lines" value={store.inventory.length} icon={BoxesIcon} tone="amber" note="distinct items tracked" />
        </Reveal>
        <Reveal delay={1}>
          <ModuleStat title="Units received" value={received} icon={PackagePlusIcon} tone="emerald" note="donated + purchased" />
        </Reveal>
        <Reveal delay={2}>
          <ModuleStat title="Units distributed" value={distributed} icon={TruckIcon} tone="sky" note="reaching beneficiaries" />
        </Reveal>
        <Reveal delay={3}>
          <ModuleStat title="Needs restock" value={lowItems.length + outItems.length} icon={PackageMinusIcon} tone="rose" note={`${outItems.length} out · ${lowItems.length} low`} />
        </Reveal>
      </div>

      {/* Category breakdown */}
      {byCategory.length > 0 ? (
        <Reveal delay={1}>
          <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Received by category
            </p>
            <div className="flex flex-wrap gap-2">
              {byCategory.map((c) => (
                <span
                  key={c.category}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-50 px-2.5 py-1 text-[0.72rem] font-medium text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200"
                >
                  {c.category}
                  <span className="tabular-nums">
                    {c.distributed}/{c.received}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ) : null}

      {/* Filters + table */}
      <Reveal delay={1}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip
                label={`All (${store.inventory.length})`}
                active={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
              />
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  active={categoryFilter === c}
                  onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)}
                />
              ))}
            </div>
            <SearchBar
              className="sm:ms-auto sm:w-80"
              value={query}
              onChange={setQuery}
              placeholder="Search item, event or record ref…"
              label="Search inventory"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-y bg-muted/40 hover:bg-muted/40">
                  <TableHead className="ps-6">Item</TableHead>
                  <TableHead className="text-end">Received</TableHead>
                  <TableHead className="text-end">Distributed</TableHead>
                  <TableHead className="text-end">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell">Linked</TableHead>
                  <TableHead className="pe-6 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6">
                      <EmptyState
                        icon={PackageSearchIcon}
                        title={store.inventory.length === 0 ? "No stock recorded yet" : "No items match your filters"}
                        description={
                          store.inventory.length === 0
                            ? "Add your first stock line — balances are computed automatically as received minus distributed."
                            : "Try a different search or category filter."
                        }
                        action={
                          <Button size="sm" onClick={() => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); }} className="gap-2">
                            <PlusIcon className="size-4" aria-hidden="true" />
                            New item
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((i) => {
                    const stock = stockTone(i.stockBalance);
                    return (
                      <TableRow key={i.id} className="transition-colors hover:bg-muted/30">
                        <TableCell className="ps-6">
                          <p className="font-medium text-foreground">{i.name}</p>
                          <p className="text-xs text-muted-foreground">{i.category || "Uncategorised"}</p>
                        </TableCell>
                        <TableCell className="text-end text-sm tabular-nums text-muted-foreground">
                          {i.quantityReceived}
                        </TableCell>
                        <TableCell className="text-end text-sm tabular-nums text-muted-foreground">
                          {i.quantityDistributed}
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-semibold tabular-nums text-foreground">{i.stockBalance}</span>
                            <StatusPill label={stock.label} tone={stock.tone} />
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-44 text-sm text-muted-foreground lg:table-cell">
                          {i.relatedEvent ? (
                            <p className="truncate">{eventLabel(i.relatedEvent) ?? i.relatedEvent}</p>
                          ) : null}
                          {i.supportingRecord ? (
                            <p className="truncate text-[0.68rem] font-mono text-muted-foreground/80">
                              {i.supportingRecord}
                            </p>
                          ) : null}
                          {!i.relatedEvent && !i.supportingRecord ? "—" : null}
                        </TableCell>
                        <TableCell className="pe-6 text-end">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditing(i.id);
                                setForm({
                                  name: i.name,
                                  category: i.category,
                                  quantityReceived: String(i.quantityReceived),
                                  quantityDistributed: String(i.quantityDistributed),
                                  relatedEvent: i.relatedEvent ?? "",
                                  supportingRecord: i.supportingRecord ?? "",
                                });
                                setOpen(true);
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground"
                              aria-label="Edit item"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm("Remove this stock item?")) deleteInventory(i.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete item"
                            >
                              <Trash2Icon className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {rows.length} of {store.inventory.length} stock lines · balances computed as
            received − distributed · demo data stored only in this browser.
          </p>
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ModuleFooter
          note={
            <>
              Link stock lines to events and expenses so auditors can trace goods from receipt to
              distribution. Low-stock and out-of-stock lines sort to the top automatically.
            </>
          }
        />
      </Reveal>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "New inventory item"}</DialogTitle>
            <DialogDescription>Balance is calculated as received minus distributed.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Item name *" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="First-aid kits" />
              <FormField label="Category *" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Medical supplies" hint="Categories roll up in the breakdown above." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Quantity received *" required type="number" min="0" value={form.quantityReceived} onChange={(v) => setForm({ ...form, quantityReceived: v })} />
              <FormField label="Quantity distributed" type="number" min="0" value={form.quantityDistributed} onChange={(v) => setForm({ ...form, quantityDistributed: v })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Related event" as="select" value={form.relatedEvent || "none"} onChange={(v: string) => setForm({ ...form, relatedEvent: v === "none" ? "" : v })} hint="Ties this stock to an event distribution.">
                <SelectItem value="none">None</SelectItem>
                {store.events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </FormField>
              <FormField label="Supporting record" value={form.supportingRecord} onChange={(v) => setForm({ ...form, supportingRecord: v })} placeholder="e.g. expense ID" hint="Reference to the expense that purchased it." />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add item"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function exportCsv() {
  const store = getStore();
  const headers = ["Item", "Category", "Received", "Distributed", "Balance", "Related event", "Supporting record"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...store.inventory.map((i) =>
      [
        i.name,
        i.category,
        i.quantityReceived,
        i.quantityDistributed,
        i.stockBalance,
        store.events.find((e) => e.id === i.relatedEvent)?.title || i.relatedEvent || "",
        i.supportingRecord || "",
      ]
        .map(escape)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ngo-inventory.csv";
  a.click();
  URL.revokeObjectURL(url);
}
