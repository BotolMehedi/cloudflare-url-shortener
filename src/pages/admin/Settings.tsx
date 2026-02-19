import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Password updated successfully");
                setOldPassword("");
                setNewPassword("");
            } else {
                toast.error(data.error || "Failed to update password");
            }
        } catch (e) {
            toast.error("Error updating password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your admin account password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input
                                id="current"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
