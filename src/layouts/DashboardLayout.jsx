import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 flex flex-col">
                <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-6">
                    <div className="md:hidden">
                        {/* Mobile Menu Trigger could go here */}
                        <span className="font-bold">Admin</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
