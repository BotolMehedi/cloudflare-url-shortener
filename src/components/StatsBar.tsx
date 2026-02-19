import { motion } from "framer-motion";

const stats = [
  { value: "150K+", label: "Links Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "50ms", label: "Avg Redirect" },
  { value: "180+", label: "Countries" },
];

export function StatsBar() {
  return (
    <section className="py-12 border-y border-emerald-100 bg-white/50 backdrop-blur-sm">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl sm:text-5xl font-bold text-emerald-600 font-mono tracking-tighter">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-2 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
