import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // Assuming sonner is available
import { AdminLayout } from "./AdminLayout";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // We can check if the user is authenticated by trying to fetch a protected resource
            // Since we don't have a dedicated /me endpoint, let's use /api/admin/stats as a check
            // or just rely on the fact that if a request 401s, we catch it.
            // A better way is to rely on client-side state + API failure redirect.
            // For this simple app, we can check localStorage as a hint, but real auth is API based.

            // Let's rely on a lightweight check or just proceed and let children fail? 
            // No, better to check.

            const res = await fetch("/api/admin/stats");
            if (res.status === 401) {
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
            }
        } catch (e) {
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!authenticated) {
        if (location.pathname !== "/admin/login") {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
    }

    return <AdminLayout>{children}</AdminLayout>;
};
