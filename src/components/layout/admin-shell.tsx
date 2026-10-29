"use client";

import { useState, type ReactNode } from "react";

import {
  AdminMobileSidebar,
  AdminSidebar,
} from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

/**
 * Owns the navigation state for the console: whether the desktop rail is
 * collapsed and whether the mobile drawer is open. Both are per-session UI
 * state, so they live in component state rather than the persistence layer.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh w-full bg-muted/30">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((previous) => !previous)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[100rem]">{children}</div>
        </main>
      </div>

      <AdminMobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </div>
  );
}