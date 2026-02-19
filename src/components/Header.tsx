import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems: { label: string; href: string }[] = [];

const pageLinks = [
  { label: "History", href: "/history" },
  { label: "Contact", href: "/contact" },
  { label: "Report", href: "/report" },
];

const legalLinks: { label: string; href: string }[] = [];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-emerald-100/50 bg-white/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-emerald-50 ring-1 ring-emerald-200 group-hover:bg-emerald-100 transition-colors">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 font-sans group-hover:text-emerald-700 transition-colors">
            AHCX
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
          {pageLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
          {legalLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors border border-transparent hover:border-emerald-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-emerald-100 shadow-xl overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-base font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all min-h-[48px] flex items-center border border-transparent hover:border-emerald-100"
                >
                  {item.label}
                </a>
              ))}
              {pageLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-base font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all min-h-[48px] flex items-center border border-transparent hover:border-emerald-100"
                >
                  {item.label}
                </Link>
              ))}
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-base font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all min-h-[48px] flex items-center border border-transparent hover:border-emerald-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
