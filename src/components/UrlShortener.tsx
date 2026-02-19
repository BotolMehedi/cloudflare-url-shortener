import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Sparkles, Clock, Copy, Check, ArrowRight } from "lucide-react";
import { ShortenedLink, generateShortCode, isValidUrl, isShortCodeTaken, createLink } from "@/lib/links";
import { toast } from "sonner";

interface Props {
  onLinkCreated: () => void;
}

export function UrlShortener({ onLinkCreated }: Props) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState<string>("never");
  const [result, setResult] = useState<ShortenedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const shortCode = alias || generateShortCode();

      if (alias && (await isShortCodeTaken(alias))) {
        toast.error("Alias already taken");
        setLoading(false);
        return;
      }

      let expiresAt: string | undefined;
      if (expiry === "1h") expiresAt = new Date(Date.now() + 3600000).toISOString();
      else if (expiry === "24h") expiresAt = new Date(Date.now() + 86400000).toISOString();
      else if (expiry === "7d") expiresAt = new Date(Date.now() + 604800000).toISOString();
      else if (expiry === "30d") expiresAt = new Date(Date.now() + 2592000000).toISOString();

      const newLink = await createLink({
        original_url: url,
        short_code: shortCode,
        alias: alias || undefined,
        expires_at: expiresAt,
      });

      setResult(newLink);
      setUrl("");
      setAlias("");
      setExpiry("never");
      onLinkCreated();
      toast.success("Link shortened successfully!");
    } catch (err) {
      toast.error("Failed to shorten link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = result ? `${window.location.origin}/${result.short_code}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="shorten" className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden bg-transparent">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-emerald-100/60 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-multiply" />

      <div className="container max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 mb-8 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Simple & Fast Link Shortening</span>
          </motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900">
            Shorten links, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">expand reach.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            The reliable URL shortener designed for modern growth. optimized for mobile, fast, and secure.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white border border-emerald-100 rounded-3xl p-3 sm:p-4 shadow-xl shadow-emerald-100/20"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Paste your long link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all font-medium text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2 min-w-[160px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Shorten
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Alias (optional)"
                value={alias}
                onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all text-sm"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all text-sm appearance-none cursor-pointer"
                style={{ colorScheme: 'light' }}
              >
                <option value="never" className="bg-white text-slate-900">Never expires</option>
                <option value="1h" className="bg-white text-slate-900">Expires in 1 hour</option>
                <option value="24h" className="bg-white text-slate-900">Expires in 24 hours</option>
                <option value="7d" className="bg-white text-slate-900">Expires in 7 days</option>
                <option value="30d" className="bg-white text-slate-900">Expires in 30 days</option>
              </select>
            </div>
          </div>
        </motion.form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-8 bg-white border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between animate-in fade-in shadow-xl shadow-emerald-100/10"
          >
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Your Short Link</p>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-emerald-600 transition-colors truncate font-mono">
                  {shortUrl}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-all min-h-[48px]"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
