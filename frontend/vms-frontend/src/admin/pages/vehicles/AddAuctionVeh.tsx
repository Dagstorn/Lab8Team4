import { Separator } from "@/shared/shad-ui/ui/separator";
import { useNavigate } from "react-router-dom";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "@/shared/shad-ui/ui/button";

const BODY_TYPES = [
    { "value": "Sedan" },
    { "value": "SUV" },
    { "value": "Hatchback" },
    { "value": "Coupe" },
    { "value": "Wagon" },
    { "value": "Van" },
    { "value": "Minivan" },
    { "value": "Pickup Truck" },
    { "value": "Crossover" },
    { "value": "Sports Car" }
]

const AddAuctionVeh = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // custom HTTP hook to make  API calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // react hook form initialization 
    const {
        register, handleSubmit, reset, formState: { errors },
    } = useForm();
    // toast library to show toast messages like notifications
    const { toast } = useToast();
    // function to process form submission
    async function onSubmit(values: FieldValues) {
        clearError();
        // get actual file from files array from form data
        values.image = values.image[0]

        // send task data to backend
        const response = await sendRequest('/api/auction/', 'post', {
            Authorization: `Bearer ${auth.tokens.access}`,
            "Content-Type": "multipart/form-data"
        }, values)
        if (response) {
            reset();
            toast({ title: "Auction Vehicle was added successfully!" })
            navigate('/admin/auction/');
        }
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add Auction Vehicle</h1>
            <Separator />
            <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-2">
                    {loading && <div className="flex justify-center mt-4">
                        <Spinner></Spinner>
                    </div>}
                    {error ? <div className="flex justify-center">
                        <span className="text-red-500 justify-self-center">{error}</span>
                    </div> : null}

                    <div className="mt-2 grid grid-cols-3 grid-rows-1 gap-10">
                        <div className="col-span-3 md:col-span-2">
                            <div className="grid gap-3 grid-cols-2">
                                <div className="mb-4">
                                    <label htmlFor="">Make</label>
                                    <input {...register("make", {
                                        required: "Required"
                                    })}
                                        type="text" required
                                        className="custom-input"
                                    />
                                    {errors.make && <p className="text-red-500">{`${errors.make.message}`}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="">Model</label>
                                    <input {...register("model", {
                                        required: "Required"
                                    })}
                                        type="text" required
                                        className="custom-input"
                                    />
                                    {errors.model && <p className="text-red-500">{`${errors.model.message}`}</p>}
                                </div>
                            </div>

                            <div className="mb-4 flex flex-col">
                                <label htmlFor="">Body type</label>
                                <Select
                                    placeholder="Select a vehicle body type"
                                    {...register("type", {
                                        required: "Required"
                                    })}
                                    variant="bordered"
                                >
                                    {BODY_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.value}
                                        </SelectItem>
                                    ))}
                                </Select>

                                {errors.type && <p className="text-red-500">{`${errors.type.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Year</label>
                                <input {...register("year", {
                                    required: "Required"
                                })}
                                    type="number" required
                                    className="custom-input"
                                />
                                {errors.year && <p className="text-red-500">{`${errors.year.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Sitting capacity</label>
                                <input {...register("capacity", {
                                    required: "Required"
                                })}
                                    type="number" required
                                    className="custom-input"
                                />
                                {errors.capacity && <p className="text-red-500">{`${errors.capacity.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Plate number</label>
                                <input {...register("license_plate", {
                                    required: "Required"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />
                                {errors.license_plate && <p className="text-red-500">{`${errors.license_plate.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Mileage</label>
                                <input {...register("mileage", {
                                    required: "Required"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />
                                {errors.mileage && <p className="text-red-500">{`${errors.mileage.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Upload a photo</label>
                                <input {...register("image", {
                                    required: "Add file"
                                })}
                                    type="file" required
                                    className="custom-input"
                                />

                                {errors.image && <p className="text-red-500">{`${errors.image.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Condition</label>
                                <input {...register("condition", {
                                    required: "Required"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />
                                {errors.condition && <p className="text-red-500">{`${errors.condition.message}`}</p>}
                            </div>


                            <div className="mb-4">
                                <label htmlFor="">Additional information</label>
                                <input {...register("additional_information", {
                                    required: "Required"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />
                                {errors.additional_information && <p className="text-red-500">{`${errors.additional_information.message}`}</p>}
                            </div>


                            <div className="w-full">
                                <Button className="mt-4 w-full" >
                                    Submit
                                </Button>
                            </div>
                        </div>

                    </div>

                </div>
            </form >
        </>
    );
};

export default AddAuctionVeh;
