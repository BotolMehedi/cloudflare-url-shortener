import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead title="Terms of Service | AHCX" description="Read AHCX's terms of service. Understand the rules and guidelines for using our URL shortening service." />
      <Header />
      <main className="pt-28 pb-16">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="text-gradient">Terms</span> of Service
            </h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: February 15, 2026</p>

            <div className="space-y-8 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">By accessing and using AHCX, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">2. Description of Service</h2>
                <p className="text-muted-foreground">AHCX provides a URL shortening service that allows users to create shortened versions of long URLs, track click analytics, generate QR codes, and manage their shortened links.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">3. Acceptable Use</h2>
                <p className="text-muted-foreground">You agree not to use AHCX to shorten URLs that link to illegal content, malware, phishing sites, spam, or any content that violates applicable laws. We reserve the right to disable any shortened link that violates these terms.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">4. User Responsibilities</h2>
                <p className="text-muted-foreground">You are solely responsible for the URLs you shorten and the content they link to. You agree to comply with all applicable local, state, national, and international laws and regulations.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">5. Intellectual Property</h2>
                <p className="text-muted-foreground">The AHCX name, logo, and all related branding are the intellectual property of AHCX. You may not use our branding without prior written consent.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">AHCX is provided "as is" without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">7. Service Availability</h2>
                <p className="text-muted-foreground">We strive to maintain high availability but do not guarantee uninterrupted access. We may modify or discontinue the service at any time without prior notice.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">8. Modifications to Terms</h2>
                <p className="text-muted-foreground">We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
