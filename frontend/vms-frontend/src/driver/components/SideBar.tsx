import { cn } from "@/lib/utils";
import { Button } from "@/shared/shad-ui/ui/button";
import {
    ListOrdered,
    UserSquare2,
    FileCheck2,
    GalleryVerticalEnd,
    FileBarChart2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }


const sidebarNavItems = [
    {
        title: "Personal information",
        href: "/driver/personal_page",
        icon: <UserSquare2 className="mr-2 h-4 w-4" />,
    },
    {
        title: "Currently assigned tasks",
        href: "/driver/tasks",
        icon: <ListOrdered className="mr-2 h-4 w-4" />,
    },
    {
        title: "Appointments",
        href: "/driver/appointments",
        icon: <FileCheck2 className="mr-2 h-4 w-4" />,
    },
    {
        title: "Routes history",
        href: "/driver/routes_history/",
        icon: <GalleryVerticalEnd className="mr-2 h-4 w-4" />,
    },
    {
        title: "Personal report",
        href: "/driver/report",
        icon: <FileBarChart2 className="mr-2 h-4 w-4" />,
    },

]

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="px-3">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Personla Page
                </h2>
                <div className="space-y-1">
                    {sidebarNavItems.map((item) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}
