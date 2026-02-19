import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/reports");
            const data = await res.json();
            if (res.ok) {
                setReports(data);
            }
        } catch (e) {
            toast.error("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/admin/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                toast.success(`Report marked as ${status}`);
                fetchReports();
            }
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Reported Links</h2>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700">Link</TableHead>
                            <TableHead className="font-semibold text-slate-700">Reason</TableHead>
                            <TableHead className="font-semibold text-slate-700">Reporter</TableHead>
                            <TableHead className="font-semibold text-slate-700">Date</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
                        ) : reports.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24">No reports found</TableCell></TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <Badge variant={report.status === "pending" ? "outline" : report.status === "resolved" ? "default" : "secondary"}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={report.link_url}>
                                        {report.link_url}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={report.reason}>
                                        {report.reason}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{report.reporter_name}</span>
                                            <span className="text-xs text-muted-foreground">{report.reporter_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {report.status === "pending" && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600 hover:bg-green-50" onClick={() => handleStatus(report.id, "resolved")}>
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-gray-500" onClick={() => handleStatus(report.id, "ignored")}>
                                                    <XCircle className="h-4 w-4 mr-1" /> Ignore
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
