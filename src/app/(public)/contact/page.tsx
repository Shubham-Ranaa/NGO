import type { Metadata } from "next";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { ContactForm } from "@/components/public/contact-form";
import { PageBanner } from "@/components/public/page-banner";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
};

const CHANNELS = [
  {
    icon: MailIcon,
    title: "Email",
    lines: [siteConfig.contact.email],
    href: `mailto:${siteConfig.contact.email}`,
    note: "Replies within two working days",
  },
  {
    icon: PhoneIcon,
    title: "Phone",
    lines: [siteConfig.contact.phone],
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    note: "Mon–Fri, 10:00–17:30 IST",
  },
  {
    icon: MapPinIcon,
    title: "Office",
    lines: siteConfig.contact.addressLines,
    note: "Visitors welcome with prior intimation",
  },
  {
    icon: ClockIcon,
    title: "Grievance desk",
    lines: ["grievance@example.org"],
    href: "mailto:grievance@example.org",
    note: "Per our transparency policy",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Talk to the team, human to human."
        description="No ticket mazes. Write, call or drop in — the same people who run the field answer these inboxes."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {CHANNELS.map((channel, index) => {
              const Icon = channel.icon;
              const body = (
                <Card className="card-lift h-full hover:ring-primary/25">
                  <CardContent className="flex h-full flex-col gap-2">
                    <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-secondary to-accent text-secondary-foreground ring-1 ring-inset ring-primary/10">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {channel.title}
                    </p>
                    {channel.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                    <p className="mt-auto pt-1 text-xs text-muted-foreground">
                      {channel.note}
                    </p>
                  </CardContent>
                </Card>
              );

              return (
                <Reveal key={channel.title} delay={index * 0.06}>
                  {"href" in channel && channel.href ? (
                    <a href={channel.href} className="block h-full">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </Reveal>
              );
            })}
          </div>

          <Card>
            <CardContent className="flex flex-col gap-6">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Validation, topic routing and the ethics of an empty state —
                  all demonstrated in one form.
                </p>
              </div>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
