import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Link2, AlertTriangle, ShieldAlert, Settings, LogOut, Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        // Check if user is stored in localStorage (simple client-side check, real auth is cookie based)
        const stored = localStorage.getItem("admin_user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            // If not in local storage, maybe check an endpoint? 
            // For now, we rely on the AdminRoute to handle the redirect if the cookie is invalid.
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            localStorage.removeItem("admin_user");
            toast.success("Logged out successfully");
            navigate("/admin/login");
        } catch (e) {
            toast.error("Logout failed");
        }
    };

    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Links", href: "/admin/links", icon: Link2 },
        { label: "Reports", href: "/admin/reports", icon: AlertTriangle },
        { label: "Messages", href: "/admin/contacts", icon: Mail },
        { label: "Blocked Domains", href: "/admin/domains", icon: ShieldAlert },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background admin-theme">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
                <span className="font-bold text-xl">AHCX Admin</span>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X /> : <Menu />}
                </Button>
            </header>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:relative lg:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-lg">A</div>
                            AHCX Admin
                        </h1>
                    </div>

                    <nav className="px-4 space-y-1 mt-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-3 px-4 py-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 border border-slate-700">
                                <span className="font-bold text-xs">{user?.username?.[0]?.toUpperCase() || "A"}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.username || "Admin"}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.role || "Super User"}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Backdrop for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
