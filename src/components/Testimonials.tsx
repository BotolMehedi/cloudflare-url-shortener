import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Lead, TechFlow",
    text: "AHCX transformed our campaign tracking. The analytics are incredibly detailed and the short links look clean and professional.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Content Creator",
    text: "I use AHCX for every social post. The QR codes and custom aliases make my brand look polished. Absolutely essential tool.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "E-commerce Manager",
    text: "The expiration feature is perfect for flash sales. We can create time-limited links that automatically deactivate. Game changer!",
    rating: 5,
  },
  {
    name: "James Okoro",
    role: "Startup Founder",
    text: "Fastest URL shortener I've ever used. Links are generated instantly and the dashboard gives me everything I need at a glance.",
    rating: 5,
  },
  {
    name: "Elena Volkov",
    role: "Digital Strategist",
    text: "The real-time click tracking helps us optimize campaigns on the fly. AHCX is now a core part of our marketing stack.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Product Designer",
    text: "Beautiful UI, blazing fast, and the QR code generation saves me so much time. This is how developer tools should be built.",
    rating: 5,
  },
];

export function Testimonials() {
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
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Thousands</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            See what our users have to say about AHCX.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
