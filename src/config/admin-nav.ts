import type { LucideIcon } from "lucide-react";
import {
  BoxesIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  FolderKanbanIcon,
  HandCoinsIcon,
  HeartHandshakeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MegaphoneIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SproutIcon,
  TruckIcon,
  UserCheckIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown in the mobile drawer and in tooltips when the rail is collapsed. */
  description: string;
};

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavSection[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboardIcon,
        description: "Programme, people and finance health at a glance.",
      },
    ],
  },
  {
    label: "Programmes",
    items: [
      {
        label: "Projects",
        href: "/admin/projects",
        icon: FolderKanbanIcon,
        description: "Deliverables, owners, deadlines and progress.",
      },
      {
        label: "Programmes",
        href: "/admin/programs",
        icon: SproutIcon,
        description: "Thematic areas that group related projects.",
      },
      {
        label: "Tasks",
        href: "/admin/tasks",
        icon: ListChecksIcon,
        description: "Work assigned across staff and volunteers.",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        label: "Directory",
        href: "/admin/people",
        icon: UsersIcon,
        description: "Staff, members and their responsibilities.",
      },
      {
        label: "Volunteers",
        href: "/admin/volunteers",
        icon: HeartHandshakeIcon,
        description: "Applications, approvals and assignments.",
      },
      {
        label: "Attendance",
        href: "/admin/attendance",
        icon: ClipboardCheckIcon,
        description: "Field and event participation records.",
      },
      {
        label: "Beneficiaries",
        href: "/admin/beneficiaries",
        icon: UserCheckIcon,
        description: "Synthetic enrolment and assistance records.",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Donations",
        href: "/admin/donations",
        icon: HandCoinsIcon,
        description: "Simulated donations and campaign attribution.",
      },
      {
        label: "Expenses",
        href: "/admin/expenses",
        icon: WalletIcon,
        description: "Spend, categories and reimbursement status.",
      },
      {
        label: "Budgets",
        href: "/admin/budgets",
        icon: ChartBarIcon,
        description: "Allocations per project and period.",
      },
    ],
  },
  {
    label: "Outreach",
    items: [
      {
        label: "Campaigns",
        href: "/admin/campaigns",
        icon: MegaphoneIcon,
        description: "Fundraising drives and published targets.",
      },
      {
        label: "Events",
        href: "/admin/events",
        icon: CalendarIcon,
        description: "Camps, registrations and attendance.",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: BoxesIcon,
        description: "Stock levels, receipts and low-stock alerts.",
      },
      {
        label: "Distributions",
        href: "/admin/distributions",
        icon: TruckIcon,
        description: "Goods handed out per project or event.",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: FileTextIcon,
        description: "Filterable reporting with CSV and JSON export.",
      },
      {
        label: "Activity log",
        href: "/admin/activity-log",
        icon: ScrollTextIcon,
        description: "Audit trail of demo changes.",
      },
    ],
  },
  {
    label: "Website",
    items: [
      {
        label: "Content",
        href: "/admin/content",
        icon: ImageIcon,
        description: "Stories, gallery, homepage blocks and announcements.",
      },
      {
        label: "Users & roles",
        href: "/admin/users",
        icon: ShieldCheckIcon,
        description: "Demo accounts and role assignment.",
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: SettingsIcon,
        description: "Organisation profile, branding and data tools.",
      },
    ],
  },
];

const adminNavIndex = new Map<string, AdminNavItem>(
  adminNav.flatMap((section) => section.items.map((item) => [item.href, item])),
);

/** Longest-prefix match so detail routes still resolve to a section title. */
export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  let best: AdminNavItem | undefined;
  for (const [href, item] of adminNavIndex) {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      if (!best || href.length > best.href.length) best = item;
    }
  }
  return best;
}

export type Crumb = { label: string; href?: string };

export function getAdminBreadcrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Management", href: "/admin" }];
  const match = findAdminNavItem(pathname);

  if (match && match.href !== "/admin") {
    crumbs.push({ label: match.label, href: match.href });
  }

  // Remaining path segments (detail pages) are title-cased.
  if (match) {
    const rest = pathname.slice(match.href.length).split("/").filter(Boolean);
    for (const segment of rest) {
      crumbs.push({
        label: segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      });
    }
  }

  return crumbs;
}
