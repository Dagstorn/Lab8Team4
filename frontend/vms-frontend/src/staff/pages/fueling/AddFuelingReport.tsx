import { Separator } from "@/shared/shad-ui/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle } from "@/shared/types/types";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Spinner } from "@nextui-org/react";
import { FieldValues, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/shad-ui/ui/card";
import { Button } from "@/shared/shad-ui/ui/button";
const DriverDetailPage = () => {
    const vehicleId = useParams().vid;
    const auth = useAuth();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<Vehicle>();
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    const {
        register, handleSubmit, formState: { errors }, reset
    } = useForm();


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // try and catch to catch errors if any
            try {
                // get data with custom Hook
                const vehicleData = await sendRequest(`/api/vehicles/${vehicleId}/`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setVehicle(vehicleData)
            } catch (err: any) {
                console.log(err)
                // show error toast message
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
        getData();
    }, []);


    async function onSubmit(values: FieldValues) {
        clearError();
        if (vehicle) {
            values.car = vehicle.id;
        } else {
            toast({ title: "Please try again!" })
            return;
        }

        values.image_before = values.photoBefore[0]
        values.image_after = values.photoAfter[0]
        console.log(values)
        try {
            // send task data to backend
            await sendRequest('/api/fueling/reports/add/', 'post', {
                Authorization: `Bearer ${auth.tokens.access}`,
                "Content-Type": "multipart/form-data"
            }, values)
            reset();
            navigate("/fueling/reports/");
            toast({
                title: "Fueling record was added successfully!",
            })
        } catch (err: any) {
            // if any erors
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }

    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add Fueling Report</h1>
            <Separator />
            <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-2">
                    {loading && <div className="flex justify-center mt-4">
                        <Spinner></Spinner>
                    </div>}
                    {error ? <div className="flex justify-center">
                        <span className="text-red-500 justify-self-center">{error}</span>
                    </div> : null}

                    <div className="grid grid-cols-7 gap-10">
                        <div className="sm:col-span-3 lg:col-span-3 xl:col-span-4">
                            <div className="mb-4">
                                <label htmlFor="">Date and time</label>
                                <input
                                    {...register('datetime', {
                                        required: "Date-time is required"
                                    })}
                                    type='datetime-local' required
                                    className="custom-input"
                                />
                                {errors.datetime && <p className="text-red-500">{`${errors.datetime.message}`}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="">Upload a photo before</label>
                                <input {...register("photoBefore", {
                                    required: "Add file"
                                })}
                                    type="file" required
                                    className="custom-input"
                                />

                                {errors.photoBefore && <p className="text-red-500">{`${errors.photoBefore.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Upload a photo after</label>
                                <input {...register("photoAfter", {
                                    required: "Add file"
                                })}
                                    type="file" required
                                    className="custom-input"
                                />

                                {errors.photoAfter && <p className="text-red-500">{`${errors.photoAfter.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Fuel type</label>
                                <input {...register("fuelType", {
                                    required: "Write fuel type"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />

                                {errors.fuelType && <p className="text-red-500">{`${errors.fuelType.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Fuel amount</label>
                                <input {...register("amount", {
                                    required: "Write fuel amount"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />

                                {errors.amount && <p className="text-red-500">{`${errors.amount.message}`}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Total cost</label>
                                <input {...register("cost", {
                                    required: "Write fuel cost"
                                })}
                                    type="text" required
                                    className="custom-input"
                                />

                                {errors.cost && <p className="text-red-500">{`${errors.cost.message}`}</p>}
                            </div>
                            <div className="w-full">
                                <Button className="w-full">Sumbit</Button>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <Card className="">
                                <CardHeader>
                                    <CardTitle>Vehicle information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full">
                                        {vehicle ? <div className="flex flex-col text-base">
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">Make & model:</span>
                                                <span>{vehicle.make} {vehicle.model}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">Year:</span>
                                                <span>{vehicle.year}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">Body type:</span>
                                                <span>{vehicle.type}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">Sitting Capacity:</span>
                                                <span>{vehicle.capacity}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">Mileage:</span>
                                                <span>{vehicle.mileage}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-2/5 font-bold mr-2">License plate:</span>
                                                <span>{vehicle.license_plat}</span>
                                            </div>

                                        </div> : <div className="flex justify-center">
                                            <Spinner /></div>}
                                    </div>
                                </CardContent>

                            </Card>
                        </div>
                    </div>

                </div>
            </form >
        </>
    );
};

export default DriverDetailPage;
