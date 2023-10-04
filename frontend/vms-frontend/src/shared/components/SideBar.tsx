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
interface SidebarItem {
    title: string,
    href: string,
    icon: JSX.Element
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    links: SidebarItem[]
}





export function Sidebar({ className, links }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-4">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Manage
                    </h2>
                    <div className="space-y-1">
                        {
                            links.map((item) => (
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
