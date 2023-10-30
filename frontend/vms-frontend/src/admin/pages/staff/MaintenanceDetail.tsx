import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { MaintenancePerson } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const MaintenanceDetail = () => {
    // Get the 'maintenancePersonId' from route parameters
    const maintenance_id = useParams().maintenancePersonId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // store data in component state
    const [maintenancePerson, setMaintenancePerson] = useState<MaintenancePerson>();
    // state for boolean variable responsible for showing/hiding password value
    const [showPassword, setShowPassword] = useState(false);
    // custom HTTP hook to make  API calls
    const { loading, sendRequest } = useHttp();

    // function to retrieve data
    const getStaff = async () => {
        if (maintenance_id) {
            const responseData = await sendRequest(`/api/staff/maintenance/${maintenance_id}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                setMaintenancePerson(responseData);
            }
        }
    }
    useEffect(() => {
        getStaff();
    }, [maintenance_id])


    return (
        <>
            {maintenancePerson && <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-4">Staff details</h1>
                <Link className="mr-4" to={`/admin/staff/maintenance/${maintenance_id}/edit/`}><Button variant="secondary"><Pencil className="w-4 mr-1" /> Edit data</Button></Link>

            </div>}
            <Separator />
            <div>
                {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
                {maintenancePerson && < div className="grid grid-cols-3 mt-4 mb-4">
                    <div className="xl:col-span-2 sm:col-span-3">
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <span className="col-span-3">{maintenancePerson.name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <span className="col-span-3">{maintenancePerson.surname}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Middle name</label>
                            <span className="col-span-3">{maintenancePerson.middle_name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <span className="col-span-3">{maintenancePerson.phone}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{maintenancePerson.email}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1 flex items-center" htmlFor="">Password</label>
                            <span className="col-span-3">{
                                showPassword ? (
                                    <div className="flex items-center">
                                        {maintenancePerson.password}
                                        <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal)}><EyeOff className="mr-1" /> Hide</Button>
                                    </div>
                                ) : <div className="flex items-center">
                                    •••••••••••
                                    <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal)}><Eye className="mr-1" /> Show</Button>
                                </div>
                            }</span>
                        </div>
                    </div>
                </div >}
                <Separator />
            </div>

        </>
    );
};

export default MaintenanceDetail;
