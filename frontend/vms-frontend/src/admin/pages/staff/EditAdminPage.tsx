import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditAdminPage = () => {
    // Get the 'maintenancePersonId' from route parameters
    const admin_id = useParams().adminId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store fueling person data
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp();
    // toast library to show toast messages like notifications
    const { toast } = useToast();
    // form initialization using react hook form and form schema
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // Function to fetch maintenance person data
    const getStaff = async () => {
        if (admin_id) {
            const responseData = await sendRequest(`/api/staff/admin/${admin_id}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                // Set the form values to the received data
                setValue('first_name', responseData.user.first_name);
                setValue('last_name', responseData.user.last_name);
                setValue('username', responseData.user.username);
                setValue('phone', responseData.phone);
                setValue('email', responseData.user.email);
            }
        }
    }

    // useEffect will call getStaff function everytime maintenance_person_id is updated
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getStaff();
    }, [admin_id])

    // function to process form submission
    async function onSubmit(values: FieldValues) {
        console.log(values)
        if (admin_id) {
            clearError();
            // send task data to backend
            const response = await sendRequest(`/api/staff/admin/${admin_id}/`, 'patch', {
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
            <h1 className="text-2xl font-bold mb-4">Edit admin data </h1>
            <Separator />
            <div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <div className="col-span-3">
                                <input
                                    {...register('first_name', {
                                        required: "Enter first name"
                                    })}
                                    type='text' required
                                    className="custom-input"
                                />
                                {errors.first_name && <p className="text-red-500">{`${errors.first_name.message}`}</p>}
                            </div>

                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <div className="col-span-3">

                                <input
                                    {...register('last_name', {
                                        required: "Enter last name"
                                    })}
                                    type='text' required
                                    className="custom-input"
                                />
                                {errors.last_name && <p className="text-red-500">{`${errors.last_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Username</label>
                            <div className="col-span-3">

                                <input
                                    {...register('username', {
                                        required: "Enter username "
                                    })}
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.username && <p className="text-red-500">{`${errors.username.message}`}</p>}
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

export default EditAdminPage;