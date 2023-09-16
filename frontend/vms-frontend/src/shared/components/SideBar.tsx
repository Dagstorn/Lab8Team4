import { cn } from "@/lib/utils";
import { Button } from "@/shared/shad-ui/ui/button";
import {
    Users2,
    ListOrdered,
    AlarmClock,
    LayoutDashboard,
    CarFront,
    FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }


const sidebarNavItems = [
    {
        title: "Main Dashboard",
        href: "/admin/",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
        title: "Drivers List",
        href: "/admin/drivers",
        icon: <Users2 className="mr-2 h-4 w-4" />,
    },
    {
        title: "Appointments",
        href: "/admin/appointments",
        icon: <AlarmClock className="mr-2 h-4 w-4" />,
    },
    {
        title: "Driver Tasks & Jobs",
        href: "/admin/tasks",
        icon: <ListOrdered className="mr-2 h-4 w-4" />,
    },
    {
        title: "Staff List",
        href: "/admin/staff",
        icon: <Users2 className="mr-2 h-4 w-4" />,
    },
    {
        title: "Vehicles List",
        href: "/admin/vehicles",
        icon: <CarFront className="mr-2 h-4 w-4" />,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: <FileText className="mr-2 h-4 w-4" />,
    },
]

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-4">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Manage
                    </h2>
                    <div className="space-y-1">
                        {
                            sidebarNavItems.map((item) => (
                                <NavLink key={item.href} to={item.href}>
                                    {({ isActive }) => (
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className="w-full justify-start">
                                            {item.icon}
                                            {item.title}
                                        </Button>
                                    )}

                                </NavLink>
                            ))
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
