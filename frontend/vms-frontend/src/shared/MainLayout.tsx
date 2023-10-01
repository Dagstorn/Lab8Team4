import { Outlet } from "react-router-dom";
import { Toaster } from "@/shared/shad-ui/ui/toaster";
const AdminLayout = () => {
    return (
        <>
            <div className="flex-grow">
                <div className="h-full">
                    <div className="pb-8 py-8 sm:px-4 md:px-10 px lg:px-20 px h-full flex flex-col">
                        <Outlet />
                        <Toaster />
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminLayout;
