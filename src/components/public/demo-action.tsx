"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Stands in for actions that need the persistence layer (form submissions,
 * downloads, registrations…). Shows an honest toast explaining when the real
 * flow lands instead of pretending a form saved.
 */
export function DemoAction({
  label,
  title = "Wiring in a later phase",
  description,
  className,
  variant = "default",
  size = "default",
  icon,
}: {
  label: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  icon?: ReactNode;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() =>
        toast(title, {
          description,
        })
      }
    >
      {icon}
      {label}
    </Button>
  );
}
