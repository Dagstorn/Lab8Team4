import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <>
            <div className="flex flex-col flex-grow space-y-10">
                <div className="flex h-full">
                    <div className="grow pb-8 py-8 sm:px-4 md:px-10 px lg:px-40 px h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminLayout;
