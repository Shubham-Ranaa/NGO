import Link from "next/link";
import {
  ArrowRightIcon,
  BoxesIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  FolderKanbanIcon,
  HandCoinsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { adminNav } from "@/config/admin-nav";
import { formatCompactCurrency } from "@/lib/format";

/**
 * Platform metrics are wired to the data layer in Phase 6. Until then the
 * dashboard presents labelled sample figures so layout, trends and theme
 * behaviour can be reviewed without inventing "real" numbers.
 */
const SAMPLE_STATS = [
  {
    label: "Active programmes",
    value: 12,
    icon: FolderKanbanIcon,
    trend: { value: 8.3, label: "vs last quarter" },
  },
  {
    label: "Volunteers onboarded",
    value: 1840,
    icon: UsersIcon,
    trend: { value: 12.5, label: "vs last quarter" },
  },
  {
    label: "Donations recorded",
    value: 86,
    icon: HandCoinsIcon,
    trend: { value: 4.1, label: "vs last quarter" },
  },
  {
    label: "Funds deployed",
    value: formatCompactCurrency(4320000),
    icon: WalletIcon,
    trend: { value: 6.2, label: "vs last quarter" },
  },
] as const;

type ModuleGroup = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  count: number;
};

/** Sections of the console, each linking to its first module. */
const MODULE_GROUPS: ModuleGroup[] = [
  {
    icon: FolderKanbanIcon,
    title: "Programmes",
    description: "Projects, programmes and the tasks that move them forward.",
    href: adminNav[1]?.items[0]?.href ?? "/admin",
    count: adminNav[1]?.items.length ?? 0,
  },
  {
    icon: UsersIcon,
    title: "People",
    description: "Staff directory, volunteers, attendance and beneficiaries.",
    href: adminNav[2]?.items[0]?.href ?? "/admin",
    count: adminNav[2]?.items.length ?? 0,
  },
  {
    icon: HandCoinsIcon,
    title: "Finance",
    description: "Demo donations, expenses, budgets and fund allocation.",
    href: adminNav[3]?.items[0]?.href ?? "/admin",
    count: adminNav[3]?.items.length ?? 0,
  },
  {
    icon: CalendarIcon,
    title: "Outreach",
    description: "Campaigns and events with registrations and attendance.",
    href: adminNav[4]?.items[0]?.href ?? "/admin",
    count: adminNav[4]?.items.length ?? 0,
  },
  {
    icon: BoxesIcon,
    title: "Operations",
    description: "Inventory levels, receipts, distributions and low-stock alerts.",
    href: adminNav[5]?.items[0]?.href ?? "/admin",
    count: adminNav[5]?.items.length ?? 0,
  },
  {
    icon: FileTextIcon,
    title: "Insights",
    description: "Reports, exports, activity log and website content.",
    href: adminNav[6]?.items[0]?.href ?? "/admin",
    count: (adminNav[6]?.items.length ?? 0) + (adminNav[7]?.items.length ?? 0),
  },
];

/** Illustrative console events; the real audit trail arrives in Phase 7. */
const RECENT_ACTIVITY: { tone: StatusTone; title: string; detail: string; when: string }[] = [
  {
    tone: "success",
    title: "Donation recorded — ₹2,500 toward Water For All",
    detail: "Attributed to the Nandur borewell restoration project.",
    when: "just now",
  },
  {
    tone: "info",
    title: "Volunteer application received",
    detail: "Reading mentor, 4 hours per week, Balrampur cluster.",
    when: "2 hours ago",
  },
  {
    tone: "warning",
    title: "Inventory running low — water filters",
    detail: "12 of 40 packs remaining at the Gobindpur store.",
    when: "yesterday",
  },
  {
    tone: "neutral",
    title: "Quarterly ledger exported",
    detail: "Nandur cluster maintenance fund, April–June.",
    when: "3 days ago",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard overview"
        description="Programme, people and finance health for your organisation. Metrics are derived from the stored records — never hardcoded in the view."
        actions={
          <Link
            href="/admin/projects"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open projects
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <section aria-label="Platform metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SAMPLE_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              hint="Sample data"
              trend={stat.trend}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Totals, trends and charts populate from the JSON seed files in Phase 6
          once the storage service lands. Figures above are labelled samples.
        </p>
      </section>

      <section aria-labelledby="console-modules">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="console-modules"
            className="text-sm font-semibold text-foreground"
          >
            Console modules
          </h2>
          <span className="text-xs text-muted-foreground">
            {adminNav.reduce((sum, section) => sum + section.items.length, 0)}{" "}
            sections across {adminNav.length} groups
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULE_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <Link
                key={group.title}
                href={group.href}
                className="card-lift group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <GroupIcon className="size-4.5" aria-hidden="true" />
                  </span>
                  <StatusBadge tone="neutral">
                    {group.count} sections
                  </StatusBadge>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open
                  <ArrowRightIcon
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="recent-activity">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="recent-activity"
            className="text-sm font-semibold text-foreground"
          >
            Recent activity
          </h2>
          <span className="text-xs text-muted-foreground">
            Sample entries · audit trail in Phase 7
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <ul className="divide-y">
            {RECENT_ACTIVITY.map((entry) => (
              <li
                key={entry.title}
                className="flex flex-wrap items-start gap-x-4 gap-y-1 px-5 py-4"
              >
                <StatusBadge tone={entry.tone} dot>
                  {entry.when}
                </StatusBadge>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {entry.title}
                    <ClipboardCheckIcon
                      className="hidden size-3.5 text-muted-foreground lg:block"
                      aria-hidden="true"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">{entry.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
