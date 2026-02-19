import { useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UrlShortener } from "@/components/UrlShortener";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import { CtaBanner } from "@/components/CtaBanner";
import { SeoHead } from "@/components/SeoHead";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AHCX",
  description: "Free lightning-fast URL shortener with QR codes, custom aliases, link expiration, and real-time click analytics.",
  url: window.location.origin,
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const Index = () => {
  const refreshLinks = useCallback(() => { }, []);

  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead
        title="URL Shortener, Branded Short Links & Analytics | AHCX"
        description="Shorten URLs instantly with AHCX. Free custom aliases, QR codes, link expiration, and real-time click analytics. No signup required."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <UrlShortener onLinkCreated={refreshLinks} />
        <StatsBar />
        <HowItWorks />
        <Features />
        <Testimonials />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
