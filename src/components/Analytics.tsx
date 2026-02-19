import { motion } from "framer-motion";
import { BarChart3, MousePointerClick, TrendingUp, Link2, Activity } from "lucide-react";
import { ShortenedLink } from "@/lib/links";

interface Props {
  links: ShortenedLink[];
}

export function Analytics({ links }: Props) {
  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
  const activeLinks = links.filter((l) => l.is_active).length;
  const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;

  const stats = [
    { label: "Total Links", value: links.length, icon: Link2 },
    { label: "Total Clicks", value: totalClicks, icon: MousePointerClick },
    { label: "Active Links", value: activeLinks, icon: TrendingUp },
    { label: "Avg Clicks", value: avgClicks, icon: BarChart3 },
  ];

  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  const maxClicks = topLinks.length > 0 ? Math.max(...topLinks.map((l) => l.clicks), 1) : 1;

  return (
    <section id="analytics" className="py-16 md:py-28">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            <span className="text-gradient">Real-time</span> Analytics
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Monitor your link performance at a glance.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 border border-border hover-lift"
            >
              <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {topLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5 sm:p-7 border border-border"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Top Performing Links
              </h3>
            </div>
            <div className="space-y-4">
              {topLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate neon-text">
                      {window.location.host}/{link.short_code}
                    </p>
                    <div className="mt-1.5 h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">{link.clicks} clicks</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
