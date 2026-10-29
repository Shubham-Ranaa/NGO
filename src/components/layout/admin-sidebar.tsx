"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftIcon } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminNav } from "@/config/admin-nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  // "/admin" is a prefix of every other admin route, so match it exactly.
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Management sections"
      className="flex flex-col gap-6 px-3 py-5"
    >
      {adminNav.map((section, sectionIndex) => (
        <div key={section.label} className="flex flex-col gap-1.5">
          {collapsed ? (
            <>
              <span className="sr-only">{section.label}</span>
              {sectionIndex > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-auto mb-1 h-px w-6 bg-sidebar-border"
                />
              ) : null}
            </>
          ) : (
            <h2 className="flex items-center gap-2 px-3 pb-1 text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {section.label}
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-sidebar-border/70"
              />
            </h2>
          )}

          {section.items.map((item) => {
            const active = isActive(pathname, item.href);
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg text-sm font-medium outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {/* Active route indicator bar */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-200",
                    collapsed ? "left-0.5" : "-left-3",
                    !active && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-md transition-colors",
                    active
                      ? "bg-primary/15"
                      : "bg-transparent text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                </span>
                <span className={cn("truncate", collapsed && "sr-only")}>
                  {item.label}
                </span>
                {!collapsed && active ? (
                  <span
                    aria-hidden="true"
                    className="ms-auto size-1.5 rounded-full bg-primary"
                  />
                ) : null}
              </Link>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" className="max-w-56">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs opacity-80">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[4.75rem]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Logo showText={!collapsed} href="/admin" />
      </div>

      <ScrollArea className="flex-1">
        <SidebarNav collapsed={collapsed} />
      </ScrollArea>

      {!collapsed ? (
        <p className="px-6 pb-2 text-[0.65rem] leading-relaxed text-muted-foreground">
          {siteConfig.demoNotice}
        </p>
      ) : null}

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center",
          )}
        >
          <PanelLeftIcon className="size-4" aria-hidden="true" />
          <span className={cn(collapsed && "sr-only")}>Collapse</span>
        </Button>
      </div>
    </aside>
  );
}

export function AdminMobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-xs gap-0 bg-sidebar p-0">
        <SheetHeader className="border-b border-sidebar-border px-4 py-4">
          <SheetTitle className="text-left">
            <Logo href="/admin" />
          </SheetTitle>
          <SheetDescription className="sr-only">
            {siteConfig.name} management sections
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <SidebarNav collapsed={false} onNavigate={() => onOpenChange(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
