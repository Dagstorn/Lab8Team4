import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/SideBar";
const PersonalPageLayout = () => {
    return (
        <div className="grid grid-cols-4 gap-4 h-full">
            <div className="col-span-1">
                <Sidebar className="hidden md:block mt-0 pt-0 py-0" />
            </div>
            <div className="col-span-3">
                <Outlet />

            </div>
        </div>


    )
}

export default PersonalPageLayout