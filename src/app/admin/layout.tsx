import type { Metadata } from "next";

import { AdminShell } from "@/components/layout/admin-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "Management console",
    template: `%s · Management console — ${siteConfig.name}`,
  },
  description:
    "Demo Sahyog Foundation management console for programmes, people, finance, outreach and operations.",
  // A demonstration console should never be indexed.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}