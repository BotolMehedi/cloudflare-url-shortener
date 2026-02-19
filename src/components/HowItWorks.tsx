import { motion } from "framer-motion";
import { Link2, Zap, BarChart3, Share2 } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste Your URL",
    desc: "Drop any long URL into the input field — we support all valid web addresses.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Instantly Shorten",
    desc: "Get a clean, memorable short link generated in milliseconds.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Anywhere",
    desc: "Copy your link or download the QR code to share across any platform.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Track Performance",
    desc: "Monitor clicks, referrers, and engagement with real-time analytics.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Works</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            Four simple steps to supercharge your links.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center group hover:bg-white hover:shadow-lg hover:border-emerald-100 transition-all"
            >
              <span className="absolute top-4 right-6 text-5xl font-bold text-slate-200 font-mono select-none group-hover:text-emerald-50 transition-colors">
                {s.step}
              </span>
              <div className="p-4 rounded-full bg-white border border-slate-100 w-fit mx-auto mb-6 group-hover:border-emerald-100 group-hover:bg-emerald-50 transition-colors">
                <s.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-3">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-emerald-200 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
