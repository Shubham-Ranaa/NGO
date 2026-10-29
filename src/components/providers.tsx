"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * All client-side providers live here so the root layout stays server-rendered.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="ngo-theme"
    >
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster position="top-right" closeButton richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
