"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  FileTextIcon,
  GlobeIcon,
  HeartIcon,
  MailIcon,
  MenuIcon,
  SproutIcon,
  HeartHandshakeIcon,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { getSession, logout, type Role, type Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Icons for the mobile drawer, keyed by top-level nav order. */
const NAV_ICONS = [GlobeIcon, SproutIcon, HeartHandshakeIcon, FileTextIcon, MailIcon];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user;
  const [scrolled, setScrolled] = useState(false);

  // Read the demo session after mount so SSR and hydration match.
  useEffect(() => {
    setSession(getSession());
  }, []);

  // Lift the header once the page scrolls so it reads clearly over content.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      {/* Keyboard users can jump straight past the header. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-border/70 bg-background/90 shadow-sm backdrop-blur-lg"
            : "border-transparent bg-background/80 backdrop-blur-md",
        )}
      >
        <div className="container-wide flex h-16 items-center gap-3 sm:h-[4.5rem]">
          <Logo />

          <nav
            aria-label="Main"
            className="mx-2 hidden items-center gap-1 lg:flex"
          >
            {siteConfig.nav.map((item) =>
              item.children ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-1 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
                        isActive(pathname, item.href) &&
                          "bg-secondary/70 text-foreground hover:bg-secondary/70",
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className="size-3.5 opacity-70"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={10}
                    className="w-80 rounded-2xl border-border/70 bg-popover/95 p-2 shadow-xl backdrop-blur"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        key={child.href}
                        asChild
                        className="items-start gap-3 rounded-xl px-3 py-2.5"
                      >
                        <Link
                          href={child.href}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                            <SproutIcon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-medium">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="justify-center rounded-xl text-primary">
                      <Link href={item.href}>
                        View all {item.label.toLowerCase()}
                        <ChevronDownIcon className="size-3.5 -rotate-90" aria-hidden="true" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full px-3.5 text-sm text-muted-foreground hover:text-foreground",
                    isActive(pathname, item.href) &&
                      "bg-secondary/70 text-foreground hover:bg-secondary/70",
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={
                      isActive(pathname, item.href) ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </Button>
              ),
            )}
          </nav>

          <div className="ms-auto flex items-center gap-1.5">
            <ThemeToggle className="hidden sm:inline-flex" />

            {session ? (
              <>
                <Link
                  href={
                    user?.role === "public-viewer" ? "/transparency" : "/dashboard"
                  }
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  My dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:inline-flex gap-2"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
            )}

            <Button
              asChild
              size="sm"
              className="group gap-1.5 rounded-full px-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href="/donate">
                <HeartIcon
                  className="size-4 transition-transform duration-300 group-hover:scale-125 group-hover:text-destructive/90"
                  fill="currentColor"
                  aria-hidden="true"
                />
                Donate
              </Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon aria-hidden="true" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full max-w-sm gap-0 overflow-y-auto p-0"
              >
                <SheetHeader className="border-b px-5 py-4">
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation
                  </SheetDescription>
                </SheetHeader>

                <nav
                  aria-label="Mobile"
                  className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
                >
                  <p className="px-2 pb-2 text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Explore
                  </p>

                  {siteConfig.nav.map((item, index) => {
                    const Icon = NAV_ICONS[index % NAV_ICONS.length];
                    const active =
                      isActive(pathname, item.href) ||
                      (item.children ?? []).some((child) =>
                        isActive(pathname, child.href),
                      );

                    return (
                      <div key={item.href} className="flex flex-col">
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "-mx-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-1.5 transition-colors",
                            active
                              ? "bg-secondary text-foreground"
                              : "text-foreground/90 hover:bg-muted",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
                              active
                                ? "bg-primary/10 text-primary ring-primary/20"
                                : "bg-secondary text-secondary-foreground ring-transparent",
                            )}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-[0.95rem] font-semibold">
                              {item.label}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                          {item.children ? (
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                active ? "bg-primary" : "bg-border",
                              )}
                              aria-hidden="true"
                            />
                          ) : null}
                        </Link>

                        {item.children ? (
                          <div className="ms-6 flex flex-col border-s border-border py-1 ps-3">
                            {item.children.map((child) => {
                              const childActive = isActive(pathname, child.href);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex min-h-9 items-center gap-2 rounded-lg py-1.5 text-sm transition-colors",
                                    childActive
                                      ? "font-medium text-primary"
                                      : "text-muted-foreground hover:text-foreground",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "size-1 rounded-full",
                                      childActive ? "bg-primary" : "bg-border",
                                    )}
                                    aria-hidden="true"
                                  />
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="mt-4 flex items-center justify-between rounded-xl border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm font-medium text-foreground">
                      Colour theme
                    </span>
                    <ThemeToggle />
                  </div>
                </nav>

                <div className="grid gap-2 border-t bg-card px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                  <Button asChild variant="outline" size="lg" className="h-11 justify-center">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="h-11 justify-center gap-2 shadow-sm"
                  >
                    <Link href="/donate" onClick={() => setMobileOpen(false)}>
                      <HeartIcon
                        className="size-4"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      Donate now
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
