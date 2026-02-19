import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkHistory } from "@/components/LinkHistory";
import { Analytics } from "@/components/Analytics";
import { SeoHead } from "@/components/SeoHead";
import { getLinks, ShortenedLink } from "@/lib/links";

const History = () => {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshLinks = useCallback(async () => {
    try {
      const data = await getLinks();
      setLinks(data);
    } catch (err) {
      console.error("Failed to fetch links:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLinks();
  }, [refreshLinks]);

  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead
        title="Link History & Analytics — AHCX"
        description="View your shortened link history and real-time click analytics. Track performance and manage all your short links."
      />
      <Header />
      <main className="pt-20">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <LinkHistory links={links} onUpdate={refreshLinks} />
            <Analytics links={links} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default History;
