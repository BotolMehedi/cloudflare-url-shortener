import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Trash2, ExternalLink, Search, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminLinks() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>({});
    const [search, setSearch] = useState("");
    const [editingLink, setEditingLink] = useState<any>(null);
    const [alias, setAlias] = useState("");

    useEffect(() => {
        fetchLinks();
    }, [page, search]);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams({ page: page.toString(), search });
            const res = await fetch(`/api/admin/links?${q}`);
            const data = await res.json();
            if (res.ok) {
                setLinks(data.links);
                setPagination(data.pagination);
            }
        } catch (e) {
            toast.error("Failed to fetch links");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this link?")) return;
        try {
            const res = await fetch(`/api/admin/links?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Link deleted");
                fetchLinks();
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            toast.error("Error deleting link");
        }
    };

    const handleToggleActive = async (link: any) => {
        try {
            const res = await fetch("/api/admin/links", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: link.id, is_active: !link.is_active })
            });
            if (res.ok) {
                toast.success(`Link ${!link.is_active ? "activated" : "paused"}`);
                fetchLinks();
            }
        } catch (e) {
            toast.error("Update failed");
        }
    };

    const handleUpdateAlias = async () => {
        if (!editingLink) return;
        try {
            const res = await fetch("/api/admin/links", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingLink.id, alias: alias })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Alias updated");
                setEditingLink(null);
                fetchLinks();
            } else {
                toast.error(data.error || "Update failed");
            }
        } catch (e) {
            toast.error("Update failed");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Manage Links</h2>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search links..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Short Link</TableHead>
                            <TableHead className="font-semibold text-slate-700">Original URL</TableHead>
                            <TableHead className="font-semibold text-slate-700">Visits</TableHead>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700">Created</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
                        ) : links.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24">No links found</TableCell></TableRow>
                        ) : (
                            links.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span>/{link.alias || link.short_code}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`${window.location.origin}/${link.alias || link.short_code}`)}>
                                                <Copy size={12} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="truncate max-w-[300px] text-muted-foreground" title={link.original_url}>
                                            {link.original_url}
                                        </div>
                                    </TableCell>
                                    <TableCell>{link.clicks}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={link.is_active}
                                            onCheckedChange={() => handleToggleActive(link)}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(link.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => { setEditingLink(link); setAlias(link.alias || ""); }}>Edit</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Alias</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="alias" className="text-right">Alias</Label>
                                                            <Input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} className="col-span-3" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleUpdateAlias}>Save changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" onClick={() => window.open(link.original_url, '_blank')}>
                                                <ExternalLink size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(link.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page} of {pagination.pages}</span>
                    <Button variant="outline" size="icon" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
