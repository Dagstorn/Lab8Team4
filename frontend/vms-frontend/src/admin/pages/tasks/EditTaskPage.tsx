import { FieldValues, useForm } from "react-hook-form";
import { Button } from "@/shared/shad-ui/ui/button";
import { Loader2 } from "lucide-react"
import { Select, SelectItem } from "@nextui-org/react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { toast } from "@/shared/shad-ui/ui/use-toast";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Driver, Task, Vehicle } from "@/shared/types/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Map from "@/shared/components/Map";
import { useNavigate, useParams } from "react-router-dom";
import FadeTransition from "../../components/FadeTransition";
import { formatDateTime } from "@/shared/utils/utils";

const EditTaskPage = () => {
    // Get id from route parameters
    const taskId = useParams().taskId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // custom HTTP hook to make  API calls
    const { error, sendRequest, clearError } = useHttp();

    // states to store data
    const [task, setTask] = useState<Task>();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [busyDrivers, setBusyDrivers] = useState<Set<number>>(new Set());
    const [busyCars, setBusyCars] = useState<Set<number>>(new Set());

    const startPointCoords = useRef<HTMLInputElement>(null);
    const endPointCoords = useRef<HTMLInputElement>(null);
    const [customMapError, setCustomMapError] = useState("");

    // initialization of react hook form
    const {
        register, handleSubmit, formState: { errors, isSubmitting }, setValue, clearErrors, setError, getValues
    } = useForm();

    // useEffect will run everytime taskId changes and will retrieve initial data
    useEffect(() => {
        const getInitialData = async () => {
            const taskData = await sendRequest(`/api/tasks/${taskId}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (taskData) {
                setTask(taskData);
                setValue('time_from', formatDateTime(taskData.time_from));
                setValue('time_to', formatDateTime(taskData.time_to));
                setValue('description', taskData.description);
                getData(formatDateTime(taskData.time_from), formatDateTime(taskData.time_to), { driver: taskData.driver.id, vehicle: taskData.car.id })
            }
        }
        if (taskId) {
            getInitialData();
        }
    }, [taskId])


    // function to retrive data based on changed dates
    const getData = async (startDateTime: string, endDateTime: string, currentData: { driver: number, vehicle: number } | null) => {
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
        ])

        if (driversData && vehiclesData && notAvailable) {
            // get list of drivers and vehicles that are not available at the selected time
            if (currentData) {
                setBusyDrivers(new Set(notAvailable.map((obj: { driver: number, car: number }) => {
                    if (obj.driver !== currentData.driver) {
                        return obj.driver
                    } else {
                        return null
                    }
                }).filter(item => item !== null)))
                setBusyCars(new Set(notAvailable.map((obj: { driver: number, car: number }) => {
                    if (obj.car !== currentData.vehicle) {
                        return obj.car
                    } else {
                        return null
                    }
                }).filter(item => item !== null)))
            } else {
                setBusyDrivers(new Set(notAvailable.map((obj: { driver: number, car: number }) => obj.driver)))
                setBusyCars(new Set(notAvailable.map((obj: { driver: number, car: number }) => obj.car)))
            }
            setDrivers(driversData);
            setVehicles(vehiclesData);

            // if vehicle status is not active - meaning that it is on maintenance we make it not available for selection 
            const newActiveItemsSet = new Set(busyCars);

            vehiclesData.forEach((vehicle: Vehicle) => {
                if (vehicle.status !== 'active') {
                    newActiveItemsSet.add(vehicle.id);

                }
                setBusyCars(newActiveItemsSet);
            });

        }
    }

    const startDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        // setError('startDate', { type: 'custom', message: '' });
        clearErrors();
        if (getValues('time_to')) {
            getData(e.target.value, getValues('time_to'), null);
        }
    }
    const endDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!getValues('time_from')) {
            setError('time_from', { type: 'custom', message: 'Select start date and time!' });
        }

        if (getValues('time_from')) {
            getData(getValues('time_from'), e.target.value, null);
        }
    }
    // function to process form submission

    async function onSubmit(values: FieldValues) {
        clearError();
        if (startPointCoords.current!.value === '' || endPointCoords.current!.value === '') {
            setCustomMapError("Select start and end points");
            return;
        }
        if (!task) {
            return
        }
        // add values to form data
        values.from_point = startPointCoords.current!.value;
        values.to_point = endPointCoords.current!.value;
        if (values.driver === '') {
            values.driver = task.driver.id;
        }
        if (values.car === '') {
            values.car = task.car.id;
        }

        // send task data to backend
        const response = await sendRequest(`/api/tasks/${task.id}/`, 'patch', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            toast({
                title: "Changes are saved successfully!",
            })
            navigate("/admin/tasks");
        }
    }

    return (
        <div className="aa h-full flex flex-col">
            <div className="">
                <h1 className="text-2xl font-bold mb-2">Edit task</h1>
                <Separator />

                <FadeTransition show={vehicles.length > 0}>
                    {task && <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className=" mt-2 grid grid-cols-3 grid-rows-1 gap-10">
                            <div className="col-span-1">

                                {error ? <div className="flex justify-center">
                                    <span className="text-red-500 justify-self-center">{error}</span>
                                </div> : null}
                                <div className="mb-4">
                                    <label htmlFor="">Select start time</label>
                                    <input

                                        {...register('time_from', {
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
                                        {...register('time_to', {
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
                                        isRequired
                                        size="sm"
                                        items={drivers}
                                        variant="bordered"
                                        defaultSelectedKeys={[task.driver.id.toString()]}
                                        placeholder="Select a driver"
                                        className="h-10 p-0"
                                        disabledKeys={Array.from(busyDrivers).map(d => `${d}`)}
                                    >
                                        {(driver) => <SelectItem key={driver.id} value={driver.id}>{`${driver.name} ${driver.surname}`}</SelectItem>}
                                    </Select>

                                    {errors.driver && <p className="text-red-500">{`${errors.driver.message}`}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="">Select car</label>
                                    <Select
                                        {...register('car')}
                                        isRequired
                                        size="sm"
                                        items={vehicles}
                                        variant="bordered"
                                        placeholder="Select a vehicle"
                                        className="h-10 p-0"
                                        defaultSelectedKeys={[task.car.id.toString()]}
                                        disabledKeys={Array.from(busyCars).map(d => `${d}`)}
                                    >
                                        {(vehicle) => <SelectItem key={vehicle.id} value={vehicle.id}>
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

                                <Map
                                    startFormInp={startPointCoords}
                                    endFormInp={endPointCoords}
                                    initialStart={task.from_point}
                                    initialDestination={task.to_point}
                                />

                                {isSubmitting ?
                                    <Button disabled className="mt-4 w-full">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
                                    </Button> :

                                    <div className="grid grid-cols-3 gap-3">
                                        <Button className="col-span-1 mt-4 w-full" variant="secondary"
                                            onClick={() => navigate('/admin/tasks/')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button className="col-span-2 mt-4 w-full" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </form>}
                </FadeTransition>

            </div >
        </div >

    );
};

export default EditTaskPage;
