import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, AlertTriangle, ShieldAlert, MousePointerClick } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentLinks, setRecentLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (res.ok) {
                setStats(data.stats);
                setRecentLinks(data.recentLinks || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading stats...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Links</CardTitle>
                        <Link2 className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats?.totalLinks || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Clicks</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats?.totalClicks || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending Reports</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats?.pendingReports || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Blocked Domains</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats?.blockedDomains || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="font-medium truncate max-w-[200px]">{link.short_code}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{link.original_url}</div>
                                    </div>
                                    <div className="text-sm font-medium">{new Date(link.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                            {recentLinks.length === 0 && <div className="text-muted-foreground text-sm">No links found.</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder for future specific widget like 'Recent Reports' */}
                <Card className="col-span-1 border-dashed flex items-center justify-center text-muted-foreground">
                    <div className="p-10">More analytics coming soon</div>
                </Card>
            </div>
        </div>
    );
}
