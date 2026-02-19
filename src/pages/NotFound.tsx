import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Zap } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white bg-grid-pattern flex items-center justify-center px-4 font-sans text-slate-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <SeoHead title="404 — Page Not Found | AHCX" description="The page you're looking for doesn't exist." />
      <div className="text-center bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl shadow-slate-200/50">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
          <Zap className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-slate-900">Page Not Found</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/20 w-full"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
