import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/50 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-1.5 rounded-lg bg-emerald-50 ring-1 ring-emerald-200 group-hover:bg-emerald-100 transition-colors">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 font-sans group-hover:text-emerald-700 transition-colors">
                AHCX
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Enterprise-grade URL shortening for modern teams. Analytics, reliability, and speed built-in.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Github} href="https://github.com/botolmehedi" />
              <SocialLink icon={Mail} href="#" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/#features" className="hover:text-emerald-600 transition-colors">Features</Link></li>
              <li><Link to="/report" className="hover:text-emerald-600 transition-colors">Report Abuse</Link></li>

            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link></li>
              <li><Link to="/disclaimer" className="hover:text-emerald-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} AHCX. All rights reserved.</p>
          <p><div className="flex items-center gap-2 text-primary"><span className="text-sm font-medium">Made with</span><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-heart w-4 h-4 fill-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></span><span className="text-sm font-medium">by</span><a href="https://github.com/botolmehedi" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:underline underline-offset-2">AHCX</a></div></p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} className="p-2 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all">
      <Icon className="w-4 h-4" />
    </a>
  )
}
