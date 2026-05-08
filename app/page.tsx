import { FeaturesSection } from "@/components/homepage/features-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { Header } from "@/components/inventory/inventory-header";
import { Footer } from "@/components/shared/footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
