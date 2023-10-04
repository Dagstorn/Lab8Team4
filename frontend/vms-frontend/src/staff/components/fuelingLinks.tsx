import { CarFront, FileText, LayoutDashboard } from "lucide-react";

export const sidebarNavItems = [
    {
        title: "Personal Page",
        href: "/fueling/",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
        title: "Vehicles list",
        href: "/fueling/vehicles",
        icon: <CarFront className="mr-2 h-4 w-4" />,
    },
    {
        title: "Fueling Reports",
        href: "/fueling/reports",
        icon: <FileText className="mr-2 h-4 w-4" />,
    },
]