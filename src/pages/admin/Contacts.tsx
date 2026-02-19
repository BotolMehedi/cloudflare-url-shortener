import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, Trash2, Mail } from "lucide-react";

export default function AdminContacts() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/contacts");
            const data = await res.json();
            if (res.ok) {
                setMessages(data.contacts || []);
            }
        } catch (e) {
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/admin/contacts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                toast.success(`Message marked as ${status}`);
                fetchMessages();
            }
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Message deleted");
                fetchMessages();
            }
        } catch (e) {
            toast.error("Failed to delete message");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Contact Messages</h2>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700 w-24">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700">Sender</TableHead>
                            <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                            <TableHead className="font-semibold text-slate-700">Message</TableHead>
                            <TableHead className="font-semibold text-slate-700">Date</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Loading messages...</TableCell></TableRow>
                        ) : messages.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">No messages found</TableCell></TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className={msg.status === 'unread' ? 'bg-emerald-50/30' : ''}>
                                    <TableCell>
                                        <Badge variant={msg.status === "unread" ? "default" : "secondary"}>
                                            {msg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{msg.name}</span>
                                            <span className="text-xs text-slate-500">{msg.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate font-medium text-slate-700" title={msg.subject || "No Subject"}>
                                        {msg.subject || "No Subject"}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] whitespace-pre-wrap text-sm text-slate-600">
                                        {msg.message}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {msg.status === "unread" && (
                                                <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8 px-2" onClick={() => handleStatus(msg.id, "read")}>
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Mark Read
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2" onClick={() => handleDelete(msg.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
