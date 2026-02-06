import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Car,
    UserCog,
    Key
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "Users", icon: Users },
    { href: "/rides", label: "Ride Requests", icon: Car },
    { href: "/drivers", label: "Drivers", icon: UserCog },
    { href: "/tokens", label: "Driver Tokens", icon: Key },
];

export function Sidebar({ className }) {
    return (
        <aside className={cn("flex flex-col border-r bg-card w-64 min-h-screen", className)}>
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight">Admin</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {sidebarLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground">Logged in as Admin</p>
            </div>
        </aside>
    );
}
