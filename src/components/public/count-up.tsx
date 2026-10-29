"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Counts up to `value` when it scrolls into view. The final value is rendered
 * into the HTML so the number always exists in the document (SSR and no-JS
 * safe); the animation only re-counts when motion is allowed and the element
 * is visible. Reduced-motion users simply see the final value.
 *
 * The animation writes into the DOM node directly, so no state is involved
 * and a completed count never re-renders the parent.
 *
 * Formatting is declarative (`notation`, `prefix`, `suffix`) rather than a
 * function prop, because this component may render inside server components
 * and functions cannot cross the server/client boundary.
 */
export function CountUp({
  value,
  notation = "standard",
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  /** Compact uses Indian units (L / Cr) via the en-IN locale. */
  notation?: "standard" | "compact";
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  // Memoised so the animation effect below depends on a stable identity and
  // only restarts when the shape of the number genuinely changes.
  const render = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-IN", {
      notation,
      maximumFractionDigits: notation === "compact" ? 1 : 0,
    });
    return (latest: number) => `${prefix}${formatter.format(latest)}${suffix}`;
  }, [notation, prefix, suffix]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || prefersReducedMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = render(latest);
      },
    });

    return () => controls.stop();
  }, [inView, value, duration, prefersReducedMotion, render]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {render(value)}
    </span>
  );
}
