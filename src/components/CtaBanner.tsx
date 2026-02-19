import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 sm:px-12 sm:py-24 text-center shadow-2xl shadow-emerald-200"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to simplify your links?
            </h2>
            <p className="text-emerald-50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of marketers, creators, and developers using AHCX for fast, reliable URL shortening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-md justify-center">
              <a
                href="/#shorten"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-600 font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto min-h-[56px]"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-sm text-emerald-100">
              No credit card required. No signup needed.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
