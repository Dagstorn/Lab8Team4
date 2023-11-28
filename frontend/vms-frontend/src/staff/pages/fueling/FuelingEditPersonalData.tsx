import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const FuelingEditPersonalData = () => {
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
        const responseData = await sendRequest('/api/fueling/personal_data/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        console.log(responseData)
        if (responseData) {
            // save data in components state
            setValue('name', responseData.name);
            setValue('surname', responseData.surname);
            setValue('middle_name', responseData.middle_name);
            setValue('phone', responseData.phone);
            setValue('email', responseData.email);
            setValue('password', responseData.password);
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
        // send task data to backend
        const response = await sendRequest('/api/fueling/personal_data/', 'patch', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            toast({ title: "Changes saved!" })
            navigate(`/fueling/`);
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
                                    {...register('name', {
                                        required: "Enter name"
                                    })}
                                    type='text'
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
                                        required: "Enter surname"
                                    })}
                                    type='text'
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

export default FuelingEditPersonalData;