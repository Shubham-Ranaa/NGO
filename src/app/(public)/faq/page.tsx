import type { Metadata } from "next";

import { FaqList } from "@/components/public/faq-list";
import { PageBanner } from "@/components/public/page-banner";
import { Badge } from "@/components/ui/badge";
import { getFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  const faqs = getFaqs();
  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <>
      <PageBanner
        eyebrow="FAQ"
        title="Answers, before you even ask."
        description="The questions our field teams, donors and volunteers ask most often — grouped by topic."
      />

      <section className="container-wide py-14 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {categories.map((category) => (
            <div key={category} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {category}
                </h2>
                <Badge variant="outline" className="shrink-0">
                  {faqs.filter((faq) => faq.category === category).length}
                </Badge>
              </div>
              <FaqList faqs={faqs.filter((faq) => faq.category === category)} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
