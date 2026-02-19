import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ExternalLink, Copy, Check, ChevronDown, Pause, Play } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ShortenedLink, formatDate, deleteLink, deleteAllLinks, toggleLinkActive, timeAgo } from "@/lib/links";
import { toast } from "sonner";

interface Props {
  links: ShortenedLink[];
  onUpdate: () => void;
}

export function LinkHistory({ links, onUpdate }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (link: ShortenedLink) => {
    navigator.clipboard.writeText(`${window.location.origin}/${link.short_code}`);
    setCopiedId(link.id);
    toast.success("Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink(id);
      onUpdate();
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete link");
    }
  };

  const handleToggleActive = async (link: ShortenedLink) => {
    try {
      await toggleLinkActive(link.id, link.is_active);
      onUpdate();
    } catch {
      toast.error("Failed to update link");
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllLinks();
      onUpdate();
      toast.success("All links cleared");
    } catch {
      toast.error("Failed to clear links");
    }
  };

  const filtered = links.filter(
    (l) =>
      l.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.original_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (links.length === 0) {
    return (
      <section id="history" className="py-16 md:py-24">
        <div className="container max-w-5xl text-center">
          <h2 className="text-3xl font-extrabold mb-3">Link History</h2>
          <p className="text-muted-foreground text-sm">No links yet. Shorten your first URL above!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="py-16 md:py-24">
      <div className="container max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-extrabold">
            Link History <span className="text-muted-foreground text-lg font-normal">({links.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm w-48"
            />
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition-colors min-h-[44px]"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((link, i) => {
            const isExpanded = expandedId === link.id;
            const isExpired = link.expires_at ? Date.now() > new Date(link.expires_at).getTime() : false;

            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass rounded-2xl overflow-hidden transition-all ${isExpired ? "opacity-50" : ""
                  } ${isExpanded ? "neon-border" : "border border-border"}`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-sm neon-text truncate font-bold">
                        {window.location.host}/{link.short_code}
                      </span>
                      {isExpired && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-destructive/15 text-destructive font-semibold">
                          Expired
                        </span>
                      )}
                      {!link.is_active && !isExpired && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{link.original_url}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {link.clicks} clicks · {timeAgo(link.created_at)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopy(link)}
                        className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Copy"
                      >
                        {copiedId === link.id ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : link.id)}
                        className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-2.5 rounded-xl hover:bg-destructive/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Original URL</p>
                            <a
                              href={link.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1.5 break-all"
                            >
                              {link.original_url} <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Created</p>
                            <p className="text-sm">{formatDate(link.created_at)}</p>
                          </div>
                          {link.expires_at && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Expires</p>
                              <p className="text-sm">{formatDate(link.expires_at)}</p>
                            </div>
                          )}
                          <button
                            onClick={() => handleToggleActive(link)}
                            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors min-h-[44px] font-semibold"
                          >
                            {link.is_active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {link.is_active ? "Pause Link" : "Activate Link"}
                          </button>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="p-5 rounded-2xl bg-foreground/95">
                            <QRCodeSVG
                              value={`${window.location.origin}/${link.short_code}`}
                              size={130}
                              bgColor="hsl(150, 15%, 92%)"
                              fgColor="hsl(160, 25%, 3%)"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
