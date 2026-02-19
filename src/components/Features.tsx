import { motion } from "framer-motion";
import { Shield, Gauge, QrCode, BarChart3, Clock, Fingerprint, Globe, Smartphone, Lock } from "lucide-react";

const features = [
  { icon: Gauge, title: "Instant Shortening", desc: "Generate short links in milliseconds with our optimized engine." },
  { icon: QrCode, title: "QR Code Generation", desc: "Auto-generated QR codes for every shortened link, ready to download." },
  { icon: BarChart3, title: "Click Analytics", desc: "Track clicks, referrers, and performance with real-time dashboards." },
  { icon: Clock, title: "Link Expiration", desc: "Set auto-expiry from 1 hour to 30 days for time-sensitive campaigns." },
  { icon: Fingerprint, title: "Custom Aliases", desc: "Create memorable, branded short links that represent your identity." },
  { icon: Shield, title: "Secure & Private", desc: "All links are encrypted and private by default with full control." },
  { icon: Globe, title: "Worldwide CDN", desc: "Lightning-fast redirects powered by edge servers across the globe." },
  { icon: Smartphone, title: "Mobile Optimized", desc: "Fully responsive experience designed for every screen size." },
  { icon: Lock, title: "Link Management", desc: "Pause, activate, or delete links anytime with full history." },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-transparent">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Powerful</span> Features
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need for professional link management and analytics, built for scale.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group"
            >
              <div className="p-3 rounded-xl bg-emerald-50 w-fit mb-5 group-hover:bg-emerald-100 transition-colors">
                <f.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
