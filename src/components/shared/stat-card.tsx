import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatTrend = {
  /** Percentage change, e.g. 12.5 for +12.5%. Negative values render as a drop. */
  value: number;
  /** Optional caption such as "vs last quarter". */
  label?: string;
  /** Set when a lower value is the good outcome (e.g. overdue tasks). */
  lowerIsBetter?: boolean;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  footer,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  hint?: string;
  trend?: StatTrend;
  footer?: ReactNode;
  className?: string;
}) {
  const isFlat = !trend || trend.value === 0;
  const isUp = !!trend && trend.value > 0;
  const isGood = trend
    ? trend.lowerIsBetter
      ? !isUp
      : isUp
    : true;

  const TrendIcon = isFlat ? MinusIcon : isUp ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <Card className={cn("card-lift overflow-hidden", className)}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-[1.75rem]">
          {value}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                isFlat
                  ? "text-muted-foreground"
                  : isGood
                    ? "text-success"
                    : "text-destructive",
              )}
            >
              <TrendIcon className="size-3.5" aria-hidden="true" />
              <span className="tabular-nums">
                {isUp ? "+" : ""}
                {trend.value.toFixed(1)}%
              </span>
              <span className="sr-only">
                {isUp ? "increase" : isFlat ? "no change" : "decrease"}
                {trend.lowerIsBetter ? ", where lower is better" : ""}
              </span>
            </span>
          ) : null}

          {trend?.label ? (
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          ) : null}

          {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        </div>

        {footer ? <div className="pt-1">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
