import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Admin } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AdminDetail = () => {
    // Get the 'admin_id' from route parameters
    const admin_id = useParams().adminId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // store data in component state
    const [admin, setAdmin] = useState<Admin>();
    // custom HTTP hook to make  API calls
    const { loading, sendRequest } = useHttp();

    // function to retrieve data
    const getStaff = async () => {
        if (admin_id) {
            const responseData = await sendRequest(`/api/staff/admin/${admin_id}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                setAdmin(responseData);
            }
        }
    }
    useEffect(() => {
        getStaff();
    }, [admin_id])


    return (
        <>
            {admin && <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-4">Staff details</h1>
                <Link className="mr-4" to={`/admin/staff/admin/${admin.id}/edit/`}><Button variant="secondary"><Pencil className="w-4 mr-1" /> Edit data</Button></Link>

            </div>}
            <Separator />
            <div>
                {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
                {admin && < div className="grid grid-cols-3 mt-4 mb-4">
                    <div className="xl:col-span-2 sm:col-span-3">
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <span className="col-span-3">{admin.user.first_name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <span className="col-span-3">{admin.user.last_name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <span className="col-span-3">{admin.phone}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{admin.user.email}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Username</label>
                            <span className="col-span-3">{admin.user.username}</span>
                        </div>
                    </div>
                </div >}
                <Separator />
            </div>

        </>
    );
};

export default AdminDetail;
