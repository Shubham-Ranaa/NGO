"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  CalendarIcon,
  HandCoinsIcon,
  WalletIcon,
  UsersIcon,
  BoxesIcon,
  FileTextIcon,
  ShieldCheckIcon,
  SettingsIcon,
  ActivityIcon,
  MenuIcon,
  XIcon,
  HardDriveIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getSession,
  logout,
  hasRole,
  ROLE_CONFIG,
  type Role,
  type Session,
} from "@/lib/auth";
import { getStore, totals } from "@/lib/store";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboardIcon,
        roles: ["super-admin", "manager", "finance", "volunteer"],
      },
    ],
  },
  {
    label: "Programmes & people",
    items: [
      {
        href: "/dashboard/events",
        label: "Events",
        icon: CalendarIcon,
        roles: ["super-admin", "manager", "volunteer"],
      },
      {
        href: "/dashboard/volunteers",
        label: "Volunteers",
        icon: UsersIcon,
        roles: ["super-admin", "manager", "volunteer"],
      },
      {
        href: "/dashboard/inventory",
        label: "Inventory",
        icon: BoxesIcon,
        roles: ["super-admin", "manager"],
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        href: "/dashboard/donations",
        label: "Donations",
        icon: HandCoinsIcon,
        roles: ["super-admin", "finance", "manager"],
      },
      {
        href: "/dashboard/expenses",
        label: "Expenses",
        icon: WalletIcon,
        roles: ["super-admin", "finance", "manager"],
      },
      {
        href: "/dashboard/reports",
        label: "Reports",
        icon: FileTextIcon,
        roles: ["super-admin", "finance", "manager"],
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        href: "/dashboard/cep",
        label: "CEP Survey",
        icon: ShieldCheckIcon,
        roles: ["super-admin", "manager", "volunteer"],
      },
      {
        href: "/dashboard/audit",
        label: "Audit trail",
        icon: ActivityIcon,
        roles: ["super-admin", "manager", "finance"],
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: SettingsIcon,
        roles: ["super-admin"],
      },
    ],
  },
];

const ACCENTS = [
  "text-emerald-600 dark:text-emerald-400",
  "text-sky-600 dark:text-sky-400",
  "text-amber-600 dark:text-amber-400",
  "text-violet-600 dark:text-violet-400",
];

function useAlertCount() {
  return useMemo(() => {
    const store = getStore();
    const t = totals();
    const unverified = store.donations.filter((d) => d.status !== "verified").length;
    const missingReceipts =
      store.donations.filter((d) => !d.receiptNumber).length +
      store.expenses.filter((e) => !e.invoiceFile).length;
    const pendingApprovals = store.expenses.filter((e) => e.approvalStatus === "pending").length;
    const overdraft = t.balance < 0 ? 1 : 0;
    return unverified + missingReceipts + pendingApprovals + overdraft;
  }, []);
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
    setMounted(true);
  }, []);

  const user = session?.user;
  const role = (user?.role ?? "public-viewer") as Role;

  useEffect(() => {
    if (!mounted) return;
    if (!session) {
      window.location.href = "/login";
    } else if (role === "public-viewer") {
      window.location.href = "/transparency";
    }
  }, [mounted, session, role]);

  const roleCfg = ROLE_CONFIG[role];
  const alertCount = useAlertCount();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && href !== "/dashboard" && pathname.startsWith(`${href}/`));

  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasRole(role, item.roles)),
  })).filter((section) => section.items.length > 0);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-dvh bg-[oklch(0.985_0.005_160)] dark:bg-[oklch(0.17_0.01_180)]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 bg-sidebar border-r border-border/60 shadow-xl transition-transform duration-300 ease-out",
          "dark:bg-[oklch(0.19_0.015_180)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border/70 px-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-200 group-hover:scale-105">
              <SproutMark />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-sm font-semibold tracking-tight text-sidebar-foreground">
                Sahyog Foundation
              </span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                NGO Digital
              </span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-primary/8 px-3 py-2 text-[0.7rem] font-medium text-primary/90">
            <HardDriveIcon className="size-3.5 shrink-0" aria-hidden="true" />
            Demo workspace · saved in this browser
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Dashboard sections">
          {sections.map((section, sectionIndex) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 pb-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground/80">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
                        active
                          ? "bg-primary-foreground/15"
                          : "bg-muted/60 text-muted-foreground group-hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4",
                          !active && ACCENTS[sectionIndex % ACCENTS.length]
                        )}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/dashboard/donations" && alertCount > 0 ? (
                      <span className="rounded-full bg-amber-100 px-1.5 text-[0.65rem] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                        {alertCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border/70 p-4">
          {user ? (
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-primary/90 text-xs font-semibold text-primary-foreground">
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-xs font-semibold text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="block truncate text-[0.68rem] text-muted-foreground">
                  {roleCfg.label}
                </span>
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                aria-label="Sign out"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOutIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={logout}
              className="w-full text-sm gap-2"
              aria-hidden="true"
            >
              <LogOutIcon className="size-4" aria-hidden="true" />
              Sign out
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={closeOnEscape}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <MenuIcon aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight text-foreground lg:hidden"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <SproutMark />
            </span>
            NGO Digital
          </Link>

          <div className="ms-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-semibold text-emerald-700 sm:inline-flex dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              Live · demo data
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden rounded-full text-xs md:inline-flex"
            >
              <Link href="/transparency">Public transparency page</Link>
            </Button>
            <span className="hidden text-xs font-medium text-muted-foreground lg:block">
              {roleCfg.label}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide",
                "border-current/40",
                roleCfg.color
              )}
            >
              {role.replace("-", " ")}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="relative inline-flex">
                    <span className="size-8 rounded-full bg-muted text-xs font-semibold text-foreground flex items-center justify-center overflow-hidden">
                      {initials}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-background bg-emerald-500" />
                  </span>
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem className="text-sm" asChild={false}>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{user?.name ?? "—"}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Visit public site</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transparency">Public transparency</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive text-sm">
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-4 lg:p-8">
          {mounted ? children : <DashboardLoading />}
        </main>
      </div>
    </div>
  );
}

function SproutMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M12 21v-7m0 0c0-3 2-5 5-5-1 3-2 5-5 5Zm0 0c0-3-2-5-5-5 1 3 2 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c2-5 6-7 6-11M12 21c-2-5-6-7-6-11"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border bg-card" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl border bg-card" />
    </div>
  );
}
