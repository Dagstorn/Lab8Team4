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
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // custom HTTP hook to make  API calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // states to store lists of vehicles and drivers
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    // states to store not available drivers and vehicles
    const [busyDrivers, setBusyDrivers] = useState<Set<number>>(new Set());
    const [busyCars, setBusyCars] = useState<Set<number>>(new Set());

    // references to inputs for start and end points of task
    const startPointCoords = useRef<HTMLInputElement>(null);
    const endPointCoords = useRef<HTMLInputElement>(null);
    // state to show custom error
    const [customMapError, setCustomMapError] = useState("");
    // initialization of react hook form
    const {
        register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, getValues
    } = useForm();

    // fumction to retrieve data and store to state
    const getData = async (startDateTime: string, endDateTime: string) => {
        // get drivers and vehicles with custom Hook
        const [driversData, vehiclesData, notAvailable] = await Promise.all([
            sendRequest('/api/drivers/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            }),
            sendRequest('/api/vehicles/', 'get', {
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
            const initialSet = new Set<number>(notAvailable.map((obj: { driver: number, car: number }) => obj.car));

            setDrivers(driversData);
            setVehicles(vehiclesData);
            // if vehicle status is not active - meaning that it is on maintenance we make it not available for selection 
            const busyCarsSet = new Set<number>([...initialSet]);
            vehiclesData.forEach((vehicle: Vehicle) => {
                if (vehicle.status !== 'active') {
                    busyCarsSet.add(vehicle.id);
                }
            });
            setBusyCars(busyCarsSet);

        }
    }
    // function to process selection of first date
    // if both dates are selected we will retrieve data 
    const startDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError('startDate', { type: 'custom', message: '' });
        if (getValues('endDate')) {
            getData(e.target.value, getValues('endDate'));
        }
    }
    // function to process selection of second date
    const endDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!getValues('startDate')) {
            setError('startDate', { type: 'custom', message: 'Select start date and time!' });
        }
        if (getValues('startDate')) {
            getData(getValues('startDate'), e.target.value);
        }
    }
    // function to process form submission
    async function onSubmit(values: FieldValues) {
        clearError();
        if (startPointCoords.current!.value === '' || endPointCoords.current!.value === '') {
            setCustomMapError("Select start and end points");
            return;
        }
        // add coordinates values to form data
        values.from_point = startPointCoords.current!.value;
        values.to_point = endPointCoords.current!.value;

        // send task data to backend
        const response = await sendRequest('/api/tasks/add/', 'post', {
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
                                            {...register('driver', {
                                                required: "Select driver"
                                            })}
                                            size="sm"
                                            items={drivers}
                                            isRequired
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
                                            {...register('car', {
                                                required: "Select vehicle"
                                            })}
                                            size="sm"
                                            items={vehicles}
                                            isRequired
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

                            <Map startFormInp={startPointCoords} endFormInp={endPointCoords} />

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
