import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminDomains() {
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDomain, setNewDomain] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/domains");
            const data = await res.json();
            if (res.ok) {
                setDomains(data);
            }
        } catch (e) {
            toast.error("Failed to fetch domains");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain) return;

        try {
            const res = await fetch("/api/admin/domains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: newDomain, reason })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Domain blocked");
                setNewDomain("");
                setReason("");
                fetchDomains();
            } else {
                toast.error(data.error || "Failed to block domain");
            }
        } catch (e) {
            toast.error("Error adding domain");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Unblock this domain?")) return;
        try {
            const res = await fetch(`/api/admin/domains?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Domain unblocked");
                fetchDomains();
            }
        } catch (e) {
            toast.error("Error removing domain");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Blocked Domains</h2>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 h-fit shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Block New Domain</CardTitle>
                        <CardDescription>Prevent users from shortening links to this domain.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="example.com"
                                    value={newDomain}
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Reason (optional)"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                <ShieldAlert className="mr-2 h-4 w-4" /> Block Domain
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700">Domain</TableHead>
                                <TableHead className="font-semibold text-slate-700">Reason</TableHead>
                                <TableHead className="font-semibold text-slate-700">Date Added</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">Loading...</TableCell></TableRow>
                            ) : domains.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">No blocked domains</TableCell></TableRow>
                            ) : (
                                domains.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-mono">{d.domain}</TableCell>
                                        <TableCell className="text-muted-foreground">{d.reason || "-"}</TableCell>
                                        <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
