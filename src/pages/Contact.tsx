import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const errorData = await response.json() as any;
        toast.error(errorData.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Connection error. Please check your internet and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead title="Contact Us | AHCX" description="Get in touch with the AHCX team. We'd love to hear your questions, suggestions, or feedback." />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Get in</span> Touch
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Have a question, suggestion, or need help? We'd love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    required
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="Your email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>

              <textarea
                placeholder="Your message *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm resize-none"
                required
              />

              <button
                type="submit"
                disabled={sending}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base transition-all shadow-lg hover:shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
