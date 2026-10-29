import { MapPinIcon, QuoteIcon } from "lucide-react";

import storiesData from "@/data/stories.json";
import type { Story } from "@/types/content";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/public/section-heading";

/** Field testimonials pulled from the stories seed file. */
const TESTIMONIALS = (storiesData as Story[])
  .filter((story) => story.kind === "testimonial" && Boolean(story.quote))
  .slice(0, 3);

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Stories() {
  return (
    <section id="stories" className="relative overflow-hidden border-b bg-muted/30">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-60 mask-radial" />
      </div>

      <div className="container-wide py-16 lg:py-24">
        <SectionHeading
          eyebrow="Voices"
          title="What people say about working with us"
          description="Donors, volunteers and village partners describe the same thing from three sides: the numbers are public, so trust is earned rather than claimed."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.08}>
              <figure className="card-lift flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                <QuoteIcon
                  className="size-6 text-primary/40"
                  aria-hidden="true"
                />

                <blockquote className="font-heading flex-1 text-lg leading-snug font-medium text-foreground">
                  {story.quote}
                </blockquote>

                <figcaption className="flex items-center gap-3 border-t pt-4">
                  <Avatar className="size-9 border shadow-sm">
                    <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                      {story.author ? initialsOf(story.author) : "·"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {story.author}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {story.role}
                    </span>
                  </span>
                  <span className="ms-auto flex shrink-0 items-center gap-1 text-[0.7rem] text-muted-foreground">
                    <MapPinIcon className="size-3" aria-hidden="true" />
                    {story.location}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
