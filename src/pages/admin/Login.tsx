import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Store basic user info in local storage for UI (real auth is cookie)
            localStorage.setItem("admin_user", JSON.stringify(data.user));

            toast.success("Welcome back, Admin!");
            navigate("/admin/dashboard");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 admin-theme">
            <Card className="w-full max-w-md shadow-xl border-slate-200">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Admin Portal
                    </CardTitle>
                    <CardDescription>Sign in to manage your link hub</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="username"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-9 bg-white border-slate-200 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 bg-white border-slate-200 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* DB Setup Helper for Demo */}

        </div>
    );
}
