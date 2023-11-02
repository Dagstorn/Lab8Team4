import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { MaintenancePerson } from "@/shared/types/types";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditMaintenance = () => {
    // Get the 'maintenancePersonId' from route parameters
    const maintenance_person_id = useParams().maintenancePersonId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store fueling person data
    const [maintenancePerson, setMaintenancePerson] = useState<MaintenancePerson>();
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp();
    // toast library to show toast messages like notifications
    const { toast } = useToast();
    // form initialization using react hook form and form schema
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // Function to fetch maintenance person data
    const getStaff = async () => {
        if (maintenance_person_id) {
            const responseData = await sendRequest(`/api/staff/maintenance/${maintenance_person_id}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                // Set the form values to the received data
                setMaintenancePerson(responseData);
                setValue('name', responseData.name);
                setValue('surname', responseData.surname);
                setValue('middle_name', responseData.middle_name);
                setValue('phone', responseData.phone);
                setValue('email', responseData.email);
                setValue('password', responseData.password);
            }
        }
    }

    // useEffect will call getStaff function everytime maintenance_person_id is updated
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getStaff();
    }, [maintenance_person_id])

    // function to process form submission
    async function onSubmit(values: FieldValues) {
        console.log(values)
        if (maintenance_person_id) {
            clearError();
            // send task data to backend
            const response = await sendRequest(`/api/staff/maintenance/${maintenance_person_id}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)
            if (response) {
                toast({ title: "Changes saved!" })
                navigate(`/admin/staff`);
            }
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit driver data:  {maintenancePerson?.name} {maintenancePerson?.surname} </h1>
            <Separator />
            <div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <div className="col-span-3">
                                <input
                                    {...register('name', {
                                        required: "Enter first name"
                                    })}
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
                                    {...register('surname', {
                                        required: "Enter last name"
                                    })}
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
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <div className="col-span-3">

                                <input
                                    {...register('phone', {
                                        required: "Enter phone number"
                                    })}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.phone && <p className="text-red-500">{`${errors.phone.message}`}</p>}
                            </div>
                        </div>


                        <div className="mb-1 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Password</label>
                            <div className="col-span-3">

                                <input
                                    {...register('password')}
                                    type='password'
                                    className="custom-input"
                                />
                                {errors.password && <p className="text-red-500">{`${errors.password.message}`}</p>}
                            </div>
                        </div>
                        <Button className="w-full mt-4">Save changes</Button>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default EditMaintenance;