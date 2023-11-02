import { AlarmClock, CarFront, FileText, Fuel, ListOrdered, User2, Users2, Wrench } from "lucide-react";

export const sidebarNavItems = [

    {
        title: "Personal data",
        href: "/admin/personal_data",
        icon: <User2 className="mr-2 h-4 w-4" />,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
        title: "Vehicles List",
        href: "/admin/vehicles",
        icon: <CarFront className="mr-2 h-4 w-4" />,
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
        title: "Fueling Tasks",
        href: "/admin/fueling/tasks",
        icon: <Fuel className="mr-2 h-4 w-4" />,
    },
    {
        title: "Maintenance Tasks",
        href: "/admin/maintenance/tasks",
        icon: <Wrench className="mr-2 h-4 w-4" />,
    },



    {
        title: "Auction Vehicles",
        href: "/admin/auction/",
        icon: <CarFront className="mr-2 h-4 w-4" />,
    },
]