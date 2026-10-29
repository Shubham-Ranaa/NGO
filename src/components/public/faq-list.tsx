"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types/content";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2.5">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        return (
          <Collapsible
            key={faq.id}
            open={open}
            onOpenChange={(next) => setOpenId(next ? faq.id : null)}
          >
            <div
              className={cn(
                "overflow-hidden rounded-2xl border bg-card transition-all",
                open && "border-primary/30 shadow-sm",
              )}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-between gap-3 rounded-2xl px-4 py-3.5 text-start font-medium text-foreground hover:bg-transparent aria-expanded:bg-transparent sm:text-base"
                  aria-expanded={open}
                >
                  <span className="min-w-0 break-words">{faq.question}</span>
                  <ChevronDownIcon
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180 text-primary",
                    )}
                    aria-hidden="true"
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
