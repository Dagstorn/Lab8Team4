import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Vehicle } from "@/shared/types/types";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const VehicleEditPage = () => {
    // Get id from route parameters
    const vehicleId = useParams().vehicleId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store vehicle data
    const [vehicle, setVehicle] = useState<Vehicle>();
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp();
    // toast library to show toast messages like notifications
    const { toast } = useToast();
    // react hook form initialization 
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    // fumction to fetch vehicles list from api
    const getVehicle = async () => {
        if (vehicleId) {
            const responseData = await sendRequest(`/api/vehicles/${vehicleId}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                // save to state
                setVehicle(responseData);
                // set corresponding form input values
                setValue('make', responseData.make);
                setValue('model', responseData.model);
                setValue('year', responseData.year);
                setValue('type', responseData.type);
                setValue('capacity', responseData.capacity);
                setValue('license_plate', responseData.license_plate);
            }
        }
    }
    // useEffect will run getVehicle if vehicleId changes to ensure we have actual data
    useEffect(() => {
        getVehicle();
    }, [vehicleId])

    // function to process form submission
    async function onSubmit(values: FieldValues) {
        console.log(values)
        if (vehicleId) {
            clearError();
            // send task data to backend
            const response = await sendRequest(`/api/vehicles/${vehicleId}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)
            if (response) {
                toast({ title: "Changes saved!" })
                navigate(`/admin/vehicles`);
            }

        }
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit data: {vehicle?.make} {vehicle?.model} </h1>
            <Separator />
            <div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <div className="col-span-3">
                                <input
                                    {...register('make')}
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
                                    {...register('model')}
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
                                    {...register('year')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.middle_name && <p className="text-red-500">{`${errors.middle_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Body type</label>
                            <div className="col-span-3">

                                <input
                                    {...register('type')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.middle_name && <p className="text-red-500">{`${errors.middle_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Sitting capacity</label>
                            <div className="col-span-3">

                                <input
                                    {...register('capacity')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.middle_name && <p className="text-red-500">{`${errors.middle_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">License plate</label>
                            <div className="col-span-3">

                                <input
                                    {...register('license_plate')}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.middle_name && <p className="text-red-500">{`${errors.middle_name.message}`}</p>}
                            </div>
                        </div>

                        <Button className="w-full mt-4">Save changes</Button>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default VehicleEditPage