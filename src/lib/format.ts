import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

/** Indian Rupee formatter used for every monetary demo value. */
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

/** `1234567` -> `₹12,34,567` */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return inrFormatter.format(0);
  return inrFormatter.format(value);
}

/** `1234567` -> `₹12.3L` — for stat cards and chart axes. */
export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return inrCompactFormatter.format(0);
  return inrCompactFormatter.format(value);
}

/** `1200` -> `1,200` */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return numberFormatter.format(value);
}

/** `1250` -> `1.3K` — for compact stat displays. */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Accepts an ISO string or Date and returns a readable date. */
export function formatDate(
  value: string | Date | null | undefined,
  pattern = "d MMM yyyy",
): string {
  const date = toDate(value);
  if (!date) return "—";
  return format(date, pattern);
}

/** `2026-01-04` -> `3 months ago` */
export function formatRelativeDate(
  value: string | Date | null | undefined,
): string {
  const date = toDate(value);
  if (!date) return "—";
  return `${formatDistanceToNowStrict(date)} ago`;
}

/** `0.456` -> `46%` (a 0–1 ratio). */
export function formatPercent(ratio: number, fractionDigits = 0): string {
  const safe = Number.isFinite(ratio) ? ratio : 0;
  return `${(safe * 100).toFixed(fractionDigits)}%`;
}

export function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : parseISO(value);
  return isValid(date) ? date : null;
}

/** Clamps a value to the 0–100 range used by progress indicators. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
