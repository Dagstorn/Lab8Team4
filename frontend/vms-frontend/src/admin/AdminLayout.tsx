import { Sidebar } from "@/shared/components/SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col flex-grow space-y-10 ">
      <div className="flex h-full">
        <Sidebar className="hidden md:block w-64"></Sidebar>
        <div className="grow px-8 pb-8 py-8 lg:border-l h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
