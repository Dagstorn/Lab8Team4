import { AlarmClock, CarFront, FileText, LayoutDashboard } from "lucide-react";

export const sidebarNavItems = [
    {
        title: "Personal page",
        href: "/maintenance/",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },

    {
        title: "Vehicles list",
        href: "/maintenance/vehicles",
        icon: <CarFront className="mr-2 h-4 w-4" />,
    },
    {
        title: "Scheduled jobs",
        href: "/maintenance/jobs",
        icon: <AlarmClock className="mr-2 h-4 w-4" />,
    },
    {
        title: "Reports list",
        href: "/admin/vehicles",
        icon: <FileText className="mr-2 h-4 w-4" />,
    },

]