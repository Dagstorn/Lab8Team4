import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Vehicle } from "@/shared/types/types";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AddMaintenanceTask = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store vehicle data
    const [vehicles, setVehicles] = useState<Vehicle[]>();
    // custom HTTP hook to make  API calls
    const { error, sendRequest, clearError } = useHttp()
    // react hook form initialization 
    const {
        register, handleSubmit, reset, formState: { errors },
    } = useForm();
    // toast library to show toast messages like notifications
    const { toast } = useToast();



    // fumction to fetch vehicles list from api
    const getVehicles = async () => {
        const responseData = await sendRequest(`/api/vehicles/`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            // save to state
            setVehicles(responseData);
        }
    }
    // useEffect will run getVehicle if vehicleId changes to ensure we have actual data
    useEffect(() => {
        getVehicles();
    }, [])



    const onSubmit = async (values: FieldValues) => {
        clearError();
        // send task data to backend
        const response = await sendRequest('/api/staff/tasks/maintenance/', 'post', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            reset();
            toast({
                title: "Maintenance job was added successfully!",
            })
            navigate('/admin/maintenance/tasks');
        }
    }



    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Schedule maintenance job </h1>
            <Separator />
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}
            {vehicles && <div className="mt-4 flex flex-col text-base">

                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center">
                        <label className="font-bold mr-4 w-1/6">Select vehicle</label>
                        <Select
                            {...register("vehicle", {
                                required: "Select vehicle"
                            })}
                            placeholder="Select vehicle"
                            items={vehicles}
                            className="max-w-xs"
                            size="sm" variant="underlined"
                        >
                            {(vehicle) => <SelectItem key={vehicle.id} value={vehicle.id}>
                                {`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.type}`}
                            </SelectItem>}
                        </Select>
                        {errors.vehicle && <p className="text-red-500">{`${errors.vehicle.message}`}</p>}
                    </div>
                    <div className="mt-4 flex items-center">
                        <label className="font-bold mr-4 w-1/6">Maintenance Job type</label>
                        <Select
                            {...register("type", {
                                required: "Type is required"
                            })}
                            placeholder="Select job type"
                            className="max-w-xs"
                            size="sm" variant="underlined"
                        >
                            {['monthly', 'yearly', 'accidental'].map((jobtype) => (
                                <SelectItem key={jobtype} value={jobtype}>
                                    {jobtype}
                                </SelectItem>
                            ))}
                        </Select>
                        {errors.type && <p className="text-red-500">{`${errors.type.message}`}</p>}
                    </div>
                    <div className="mt-4 mb-4">
                        <label className="font-bold">Maintenance Job description</label>
                        <textarea {...register("description", {
                            required: "Description is required"
                        })}
                            className="w-full rounded-md border py-2 px-4"
                            rows={4} // Specify the number of visible rows
                            // Specify the number of visible columns
                            placeholder="Describe maintenance job..."
                        ></textarea>

                        {errors.description && <p className="text-red-500">{`${errors.description.message}`}</p>}
                    </div>


                    <Button type="submit">Submit</Button>
                </form>
            </div >}


        </div >

    )
}

export default AddMaintenanceTask