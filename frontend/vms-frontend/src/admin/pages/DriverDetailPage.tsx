import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Driver } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const DriverDetailPage = () => {
    const driverID = useParams().driverID;
    const auth = useAuth();

    const [driver, setDriver] = useState<Driver>();
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const getDriver = async () => {
        if (driverID) {
            try {
                const driverData = await sendRequest(`/api/drivers/${driverID}/`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                setDriver(driverData);
            } catch (err: any) {
                // show error toast message if any
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
    }
    useEffect(() => {
        getDriver();
    }, [driverID])

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Driver details</h1>
            <Separator />
            {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
            {driver && < div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">First name</label>
                        <span className="col-span-3">{driver.name}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Last name</label>
                        <span className="col-span-3">{driver.surname}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Middle name</label>
                        <span className="col-span-3">{driver.middle_name}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Email</label>
                        <span className="col-span-3">{driver.email}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Goverment ID</label>
                        <span className="col-span-3">{driver.goverment_id}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Address</label>
                        <span className="col-span-3">{driver.address}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Phone</label>
                        <span className="col-span-3">{driver.phone}</span>
                    </div>
                    <div className="mb-2 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Department</label>
                        <span className="col-span-3">{driver.department}</span>
                    </div>
                    <div className="mb-1 grid grid-cols-4">
                        <label className="col-span-1" htmlFor="">Driver License code</label>
                        <span className="col-span-3">{driver.license_code}</span>
                    </div>

                    <Link to={`/admin/drivers/${driver.id}/edit/`}><Button className="mt-4">Edit driver data</Button></Link>
                </div>

            </div >}
        </>
    );
};

export default DriverDetailPage;
