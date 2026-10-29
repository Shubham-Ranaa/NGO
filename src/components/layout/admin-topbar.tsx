"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminBreadcrumbs } from "@/config/admin-nav";

export function AdminTopbar({
  onOpenMobileNav,
}: {
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const crumbs = getAdminBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur-lg sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open management navigation"
      >
        <MenuIcon aria-hidden="true" />
      </Button>

      <Breadcrumbs items={crumbs} className="min-w-0 flex-1" />

      {/* Search affordance — wired to a scope notice until the module lands. */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.info("Global search arrives in Phase 5", {
            description:
              "One shortcut will jump to projects, people, donations and more.",
          })
        }
        className="hidden h-9 w-52 justify-start gap-2 rounded-xl text-muted-foreground md:inline-flex"
        aria-label="Search the console (coming in a later phase)"
      >
        <SearchIcon className="size-4 opacity-70" aria-hidden="true" />
        <span className="flex-1 text-start text-[0.8rem]">Search…</span>
        <kbd className="pointer-events-none rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          toast.info("Global search arrives in Phase 5", {
            description:
              "One shortcut will jump to projects, people, donations and more.",
          })
        }
        aria-label="Search the console (coming in a later phase)"
        className="md:hidden"
      >
        <SearchIcon aria-hidden="true" />
      </Button>

      <Badge variant="outline" className="hidden lg:inline-flex">
        Demo data
      </Badge>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-shadow hover:shadow-sm"
            aria-label="Open account menu"
          >
            <span className="relative inline-flex">
              <Avatar className="size-8 ring-1 ring-border">
                <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-xs font-semibold text-secondary-foreground">
                  DO
                </AvatarFallback>
              </Avatar>
              <span
                aria-hidden="true"
                className="absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background bg-success"
              />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-xl">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Demo operator</span>
            <span className="text-xs font-normal text-muted-foreground">
              Simulated session · no real credentials
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboardIcon aria-hidden="true" />
              Management dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <UserIcon aria-hidden="true" />
              My dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <SettingsIcon aria-hidden="true" />
              Organisation settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogOutIcon aria-hidden="true" />
              Sign in / switch account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
