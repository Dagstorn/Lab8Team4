import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Driver } from "@/shared/types/types";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditDriverPage = () => {
    const driverID = useParams().driverID;
    const auth = useAuth();
    const navigate = useNavigate();

    const [driver, setDriver] = useState<Driver>();
    const { error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const getDriver = async () => {
        if (driverID) {
            const driverData = await sendRequest(`/api/drivers/${driverID}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                setDriver(driverData);
                setValue('name', driverData.name);
                setValue('surname', driverData.surname);
                setValue('middle_name', driverData.middle_name);
                setValue('goverment_id', driverData.goverment_id);
                setValue('address', driverData.address);
                setValue('phone', driverData.phone);
                setValue('email', driverData.email);
                setValue('department', driverData.department);
                setValue('license_code', driverData.license_code);
            }
        }
    }

    useEffect(() => {
        getDriver();
    }, [driverID])

    async function onSubmit(values: FieldValues) {
        console.log(values)
        if (driverID) {
            clearError();
            // send task data to backend
            const response = await sendRequest(`/api/drivers/${driverID}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)
            if (response) {
                toast({ title: "Changes saved!" })
                navigate(`/admin/drivers/${driverID}/detail`);
            }

        }
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit driver data:  {driver?.name} {driver?.surname} </h1>
            <Separator />
            <div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <div className="col-span-3">
                                <input
                                    {...register('name')}
                                    type='text' required
                                    className="custom-input"
                                />
                                {errors.name && <p className="text-red-500">{`${errors.name.message}`}</p>}
                            </div>

                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <div className="col-span-3">

                                <input
                                    {...register('surname')}
                                    type='text' required
                                    className="custom-input"
                                />
                                {errors.surname && <p className="text-red-500">{`${errors.surname.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Middle name</label>
                            <div className="col-span-3">

                                <input
                                    {...register('middle_name')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.middle_name && <p className="text-red-500">{`${errors.middle_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Goverment ID</label>
                            <div className="col-span-3">

                                <input
                                    {...register('goverment_id')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.goverment_id && <p className="text-red-500">{`${errors.goverment_id.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Address</label>
                            <div className="col-span-3">

                                <input
                                    {...register('address')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.address && <p className="text-red-500">{`${errors.address.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <div className="col-span-3">

                                <input
                                    {...register('phone')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.phone && <p className="text-red-500">{`${errors.phone.message}`}</p>}
                            </div>
                        </div>

                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Department</label>
                            <div className="col-span-3">

                                <input
                                    {...register('department')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.department && <p className="text-red-500">{`${errors.department.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Driver License code</label>
                            <div className="col-span-3">

                                <input
                                    {...register('license_code')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.license_code && <p className="text-red-500">{`${errors.license_code.message}`}</p>}
                            </div>
                        </div>
                        <Button className="w-full mt-4">Save changes</Button>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default EditDriverPage