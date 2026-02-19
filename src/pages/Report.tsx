import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { motion } from "framer-motion";
import { Send, Mail, Link2, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Report = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reportLink, setReportLink] = useState("");
    const [reason, setReason] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !reportLink || !reason) {
            toast.error("Please fill in all required fields");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reporter_name: name,
                    reporter_email: email,
                    link_url: reportLink,
                    reason
                })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Report submitted successfully. We will investigate shortly.");
                setName("");
                setEmail("");
                setReportLink("");
                setReason("");
            } else {
                toast.error(data.error || "Failed to submit report");
            }
        } catch (e) {
            toast.error("Error submitting report");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white bg-grid-pattern font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
            <SeoHead title="Report Abuse | AHCX" description="Report abusive or illegal links shortened with AHCX. We take abuse seriously and will investigate all reports." />
            <Header />
            <main className="pt-32 pb-20">
                <div className="container max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-center mb-12">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Report</span> Abuse
                            </h1>
                            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                                Found a link that violates our terms? Let us know and we'll take action immediately.
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
                                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Link to report *"
                                    value={reportLink}
                                    onChange={(e) => setReportLink(e.target.value)}
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                                    required
                                />
                            </div>

                            <textarea
                                placeholder="Reason for reporting (e.g. spam, phishing, illegal content) *"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm resize-none"
                                required
                            />

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full h-14 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-base transition-all shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <>
                                        Submit Report
                                        <AlertTriangle className="w-4 h-4" />
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

export default Report;
