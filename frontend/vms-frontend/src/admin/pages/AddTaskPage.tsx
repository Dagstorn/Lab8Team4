import { FieldValues, useForm } from "react-hook-form";
import { Button } from "@/shared/shad-ui/ui/button";
import { Loader2 } from "lucide-react"
import { Spinner } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { toast } from "@/shared/shad-ui/ui/use-toast";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Driver, Vehicle } from "@/shared/types/types";
import { ChangeEvent, useRef, useState } from "react";
import Map from "@/shared/components/Map";
import { useNavigate } from "react-router-dom";
const AddTaskPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const { loading, error, sendRequest, clearError } = useHttp();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [busyDrivers, setBusyDrivers] = useState<Set<number>>(new Set());
    const [busyCars, setBusyCars] = useState<Set<number>>(new Set());

    const startPointCoords = useRef<HTMLInputElement>(null);
    const endPointCoords = useRef<HTMLInputElement>(null);
    const [customMapError, setCustomMapError] = useState("");

    const {
        register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, getValues
    } = useForm();


    const getData = async (startDateTime: string, endDateTime: string) => {
        // get drivers and vehicles with custom Hook
        const [driversData, vehiclesData, notAvailable] = await Promise.all([
            sendRequest('/api/drivers', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            }),
            sendRequest('/api/vehicles', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            }),
            sendRequest('/api/tasks/checktime/', 'post', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, {
                startTime: startDateTime,
                endTime: endDateTime
            })
        ]);

        if (driversData && vehiclesData && notAvailable) {
            // get list of drivers and vehicles that are not available at the selected time
            setBusyDrivers(new Set(notAvailable.map((obj: { driver: number, car: number }) => obj.driver)))
            setBusyCars(new Set(notAvailable.map((obj: { driver: number, car: number }) => obj.car)))
            setDrivers(driversData);
            setVehicles(vehiclesData);
        }

    }
    const startDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError('startDate', { type: 'custom', message: '' });
        console.log(e.target.value)
        if (getValues('endDate')) {
            getData(e.target.value, getValues('endDate'));
        }
    }
    const endDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!getValues('startDate')) {
            setError('startDate', { type: 'custom', message: 'Select start date and time!' });
        }

        if (getValues('startDate')) {
            getData(getValues('startDate'), e.target.value);
        }
    }

    async function onSubmit(values: FieldValues) {

        clearError();
        if (startPointCoords.current!.value === '' || endPointCoords.current!.value === '') {
            setCustomMapError("Select start and end points");
            return;
        }

        values.from_point = startPointCoords.current!.value;
        values.to_point = endPointCoords.current!.value;

        // send task data to backend
        await sendRequest('/api/tasks/add/', 'post', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            reset();
            toast({
                title: "Task added successfully!",
            })
            navigate("/admin/tasks");
        }


    }

    return (
        <div className="aa h-full flex flex-col">
            <div className="">
                <h1 className="text-2xl font-bold mb-2">Create task for driver</h1>
                <Separator />

                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className=" mt-2 grid grid-cols-3 grid-rows-1 gap-10">
                        <div className="col-span-1">
                            {loading && <div className="flex justify-center mt-4">
                                <Spinner></Spinner>
                            </div>}
                            {error ? <div className="flex justify-center">
                                <span className="text-red-500 justify-self-center">{error}</span>
                            </div> : null}
                            <div className="">

                                <div className="">
                                    <div className="mb-4">
                                        <label htmlFor="">Select start time</label>
                                        <input

                                            {...register('startDate', {
                                                required: "Start date-time is required"
                                            })}
                                            onChange={startDateHandler}
                                            type='datetime-local' required
                                            className="custom-input"
                                        />
                                        {errors.startDate && <p className="text-red-500">{`${errors.startDate.message}`}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="">Select end time</label>
                                        <input
                                            {...register('endDate', {
                                                required: "End date-time is required"
                                            })}
                                            onChange={endDateHandler}
                                            type='datetime-local' required
                                            className="custom-input"
                                        />
                                        {errors.endDate && <p className="text-red-500">{`${errors.endDate.message}`}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="">Select driver</label>

                                        <Select
                                            {...register('driver')}
                                            size="sm"
                                            items={drivers}
                                            variant="bordered"
                                            placeholder="Select a driver"
                                            className="h-10 p-0"
                                            disabledKeys={Array.from(busyDrivers).map(d => `${d}`)}
                                        >
                                            {(driver) => <SelectItem key={driver.id}>{`${driver.name} ${driver.surname}`}</SelectItem>}
                                        </Select>

                                        {errors.driver && <p className="text-red-500">{`${errors.driver.message}`}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="">Select car</label>
                                        <Select
                                            {...register('car')}
                                            size="sm"
                                            items={vehicles}
                                            variant="bordered"
                                            placeholder="Select a vehicle"
                                            className="h-10 p-0"
                                            disabledKeys={Array.from(busyCars).map(d => `${d}`)}
                                        >
                                            {(vehicle) => <SelectItem key={vehicle.id}>
                                                {`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.type}`}
                                            </SelectItem>}
                                        </Select>

                                        {errors.car && <p className="text-red-500">{`${errors.car.message}`}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="">Job description</label>

                                        <input {...register("description", {
                                            required: "Provide job description"
                                        })}
                                            type="text" required
                                            className="custom-input"
                                        />
                                        {errors.description && <p className="text-red-500">{`${errors.description.message}`}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                                <div className="">
                                    <input type="hidden" ref={startPointCoords}
                                        className="custom-input"
                                    />
                                </div>
                                <div className="">
                                    <input type="hidden" ref={endPointCoords}
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            {customMapError && <div className="text-red-500">
                                {`${customMapError}`}
                            </div>}

                            <Map startPointCoordsRef={startPointCoords} endPointCoordsRef={endPointCoords} />

                            {isSubmitting ?
                                <Button disabled className="mt-4 w-full">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
                                </Button> :

                                <Button className="mt-4 w-full" type="submit">
                                    Submit
                                </Button>
                            }
                        </div>
                    </div>
                </form>
            </div >
        </div >

    );
};

export default AddTaskPage;
