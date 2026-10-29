"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

// The server cannot know which theme the user has chosen, so the resolved icon
// stays hidden until after hydration. useSyncExternalStore gives the server
// snapshot on the first client render (avoiding a mismatch) and switches to the
// real snapshot immediately afterwards — without a setState-in-effect cycle.
const subscribeToNothing = () => () => {};
const getIsHydrated = () => true;
const getServerIsHydrated = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getIsHydrated,
    getServerIsHydrated,
  );

  const active = OPTIONS.find((option) => option.value === theme);
  const TriggerIcon = !isHydrated
    ? MonitorIcon
    : (active?.icon ?? (resolvedTheme === "dark" ? MoonIcon : SunIcon));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("shrink-0", className)}
          aria-label="Change colour theme"
        >
          <TriggerIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {OPTIONS.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
              aria-checked={theme === option.value}
              role="menuitemradio"
            >
              <OptionIcon aria-hidden="true" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}