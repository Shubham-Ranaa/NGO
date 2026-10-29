"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin client wrapper around next-themes so the root layout can stay a
 * Server Component. `attribute="class"` toggles the `.dark` class that the
 * `@custom-variant dark` rule in globals.css keys off.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
