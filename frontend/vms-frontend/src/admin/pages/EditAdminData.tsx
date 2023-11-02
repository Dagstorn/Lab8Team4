import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const EditPersonalData = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store maintenance person data
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp();
    // toast library to show toast messages like notifications
    const { toast } = useToast();
    // react hook form initialization 
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    // function to get driver data
    const getData = async () => {
        // make api call
        const responseData = await sendRequest('/api/admin/personal_data/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            console.log(responseData)
            // save data in components state
            setValue('first_name', responseData.user.first_name);
            setValue('last_name', responseData.user.last_name);
            setValue('username', responseData.user.username);
            setValue('email', responseData.user.email);
            setValue('phone', responseData.phone);
        }

    }

    // useEffect will call getDriver function everytime driverID is updated
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getData();
    }, [])

    // function to process form submission
    async function onSubmit(values: FieldValues) {
        clearError();
        if (values.username) {
            auth.assignUsername(values.username);
        }
        // send task data to backend
        const response = await sendRequest('/api/admin/personal_data/', 'patch', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            toast({ title: "Changes saved!" })
            navigate(`/admin/personal_data`);
        }
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit personal data</h1>
            <Separator />
            <div className="grid grid-cols-3 mt-4">
                <div className="xl:col-span-2 sm:col-span-3">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <div className="col-span-3">
                                <input
                                    {...register('first_name', {
                                        required: "Enter name"
                                    })}
                                    type='text'
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
                                    type='text'
                                    className="custom-input"
                                />
                                {errors.last_name && <p className="text-red-500">{`${errors.last_name.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <div className="col-span-3">

                                <input
                                    {...register('email', {
                                        required: "Enter email"
                                    })}
                                    type='email'
                                    className="custom-input"
                                />
                                {errors.email && <p className="text-red-500">{`${errors.email.message}`}</p>}
                            </div>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Username</label>
                            <div className="col-span-3">

                                <input
                                    {...register('username', {
                                        required: "Enter email"
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
                                        required: "Enter phone number",
                                        pattern: {
                                            value: /^(\+?\d{11})$/,
                                            message: 'Invalid phone number format, it should be +7xxxxxxxxxx or 8xxxxxxxxxx',
                                        },
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

export default EditPersonalData;