import { getSiteSettings } from "@/lib/settings";
import { getPageContent, HOME_CONTENT_DEFAULTS } from "@/lib/page-content";
import Hero from "@/components/home/Hero";
import FeatureCards from "@/components/home/FeatureCards";
import AboutPreview from "@/components/home/AboutPreview";
import MenuPreview from "@/components/home/MenuPreview";
import ComingSoonBanner from "@/components/home/ComingSoonBanner";
import AudienceSection from "@/components/home/AudienceSection";
import LocationSection from "@/components/LocationSection";

export default async function HomePage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getPageContent("home", HOME_CONTENT_DEFAULTS),
  ]);

  return (
    <>
      <Hero settings={settings} content={content} />
      <FeatureCards />
      <AboutPreview content={content} />
      <MenuPreview />
      <ComingSoonBanner settings={settings} content={content} />
      <AudienceSection />
      <LocationSection settings={settings} />
    </>
  );
}
