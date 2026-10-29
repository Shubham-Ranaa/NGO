import { CampaignSpotlight } from "@/components/public/campaign-spotlight";
import { DesignFoundations } from "@/components/public/design-foundations";
import { GetInvolved } from "@/components/public/get-involved";
import { Hero } from "@/components/public/hero";
import { ImpactStats } from "@/components/public/impact-stats";
import { Partners } from "@/components/public/partners";
import { Programmes } from "@/components/public/programmes";
import { Stories } from "@/components/public/stories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <Programmes />
      <CampaignSpotlight />
      <Stories />
      <Partners />
      <GetInvolved />
      <DesignFoundations />
    </>
  );
}
