import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is AHCX free to use?",
    a: "Yes! AHCX is completely free with no signup required. You can shorten unlimited URLs, generate QR codes, and access real-time analytics.",
  },
  {
    q: "How long do short links last?",
    a: "By default, short links never expire. You can optionally set an expiration from 1 hour to 30 days for time-sensitive campaigns.",
  },
  {
    q: "Can I customize my short link?",
    a: "Absolutely. You can create custom aliases to make your links memorable and on-brand, like yoursite.com/my-promo.",
  },
  {
    q: "How does click tracking work?",
    a: "Every time someone clicks your short link, we record the click with a timestamp. You can view total clicks, performance trends, and top-performing links in the analytics dashboard.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. Your link data is stored locally in your browser. We don't transmit any data to external servers. You have full control over your data.",
  },
  {
    q: "Can I delete or pause a link?",
    a: "Yes, you can pause any link to temporarily stop redirects, or delete it permanently from your history at any time.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Questions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            Everything you need to know about AHCX.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-100 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left min-h-[44px]"
              >
                <span className="text-base font-semibold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180 text-emerald-600" : ""
                    }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
