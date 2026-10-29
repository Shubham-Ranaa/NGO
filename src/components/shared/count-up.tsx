"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const INDIAN_NUMBERING = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/**
 * Counts up from zero the first time the element scrolls into view.
 *
 * The element renders the FINAL value in HTML (server and no-JS safe) and
 * only re-counts when motion is allowed and the element is visible, so the
 * number is never missing from the document.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });
  const prefersReducedMotion = useReducedMotion();
  const target = `${prefix}${INDIAN_NUMBERING.format(value)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !inView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = `${prefix}${INDIAN_NUMBERING.format(latest)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, prefersReducedMotion, value, duration, prefix, suffix]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {target}
    </span>
  );
}
