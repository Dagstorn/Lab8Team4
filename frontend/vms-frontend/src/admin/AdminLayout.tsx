import { Sidebar } from "@/shared/components/SideBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/shared/shad-ui/ui/toaster";

interface SidebarItem {
  title: string,
  href: string,
  icon: JSX.Element
}

interface LayoutProps {
  links: SidebarItem[]
}

const AdminLayout: React.FC<LayoutProps> = ({ links }) => {

  return (
    <div className="flex flex-col flex-grow space-y-10 ">
      <div className="flex h-full">
        <Sidebar links={links} className="hidden md:block w-64"></Sidebar>
        <div className="grow px-8 pb-8 py-8 lg:border-l h-full">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
