import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead title="Disclaimer | AHCX" description="AHCX disclaimer. Understand the limitations and scope of our URL shortening service." />
      <Header />
      <main className="pt-28 pb-16">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="text-gradient">Disclaimer</span>
            </h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: February 15, 2026</p>

            <div className="space-y-8 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">General Disclaimer</h2>
                <p className="text-muted-foreground">The information and services provided by AHCX are for general informational and utility purposes only. While we strive to keep the service reliable and accurate, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the service.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">No Warranty</h2>
                <p className="text-muted-foreground">AHCX is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">External Links</h2>
                <p className="text-muted-foreground">AHCX allows users to shorten URLs pointing to third-party websites. We are not responsible for the content, accuracy, or practices of any third-party websites accessible through shortened links created using our service.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Analytics Data</h2>
                <p className="text-muted-foreground">Click analytics and statistics provided by AHCX are for informational purposes only. While we aim for accuracy, we cannot guarantee that all click data is 100% precise due to factors such as bot traffic, ad blockers, and other technical limitations.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Data Loss</h2>
                <p className="text-muted-foreground">Since AHCX currently stores data in your browser's localStorage, data may be lost if you clear your browser data, switch browsers, or use a different device. We are not responsible for any data loss that may occur.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Limitation of Liability</h2>
                <p className="text-muted-foreground">In no event shall AHCX, its operators, or contributors be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of our service.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
