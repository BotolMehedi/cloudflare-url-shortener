import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead title="Privacy Policy | AHCX" description="Learn how AHCX handles your data. We store link data locally in your browser for complete privacy." />
      <Header />
      <main className="pt-28 pb-16">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="text-gradient">Privacy</span> Policy
            </h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: February 15, 2026</p>

            <div className="space-y-8 text-sm leading-relaxed text-foreground/85">
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">1. Information We Collect</h2>
                <p className="text-muted-foreground">We collect information you provide directly when using AHCX, including URLs you shorten, custom aliases, and usage data. We also automatically collect device information, IP addresses, and browser type for analytics purposes.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">2. How We Use Your Information</h2>
                <p className="text-muted-foreground">We use the information we collect to provide, maintain, and improve our services, including generating shortened URLs, tracking click analytics, and ensuring the security and integrity of our platform.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">3. Data Storage & Security</h2>
                <p className="text-muted-foreground">Your data is stored locally in your browser using localStorage. We do not transmit your link data to external servers. We implement appropriate security measures to protect against unauthorized access, alteration, or destruction of data.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">4. Cookies & Tracking</h2>
                <p className="text-muted-foreground">AHCX may use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">5. Third-Party Services</h2>
                <p className="text-muted-foreground">We may use third-party services for analytics and performance monitoring. These services may collect information about your use of our platform in accordance with their own privacy policies.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">6. Your Rights</h2>
                <p className="text-muted-foreground">You have the right to access, correct, or delete your personal data. Since data is stored locally, you can clear it at any time by clearing your browser's localStorage for this site.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">7. Changes to This Policy</h2>
                <p className="text-muted-foreground">We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated revision date.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">8. Contact Us</h2>
                <p className="text-muted-foreground">If you have any questions about this privacy policy, please contact us through our contact page.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
