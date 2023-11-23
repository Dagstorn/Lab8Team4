import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Appointment, Vehicle } from "@/shared/types/types";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, CarFront, Info, ListOrdered, Loader2, LocateFixed, MapPin, User2, Users2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/shad-ui/ui/card"
import { Avatar, AvatarFallback } from "@/shared/shad-ui/ui/avatar"
import { formatTimeRange, formatDateTime } from '@/shared/utils/utils';
import { FieldValues, useForm } from "react-hook-form";
import Map from "@/shared/components/Map";
import { Button } from "@/shared/shad-ui/ui/button";


const AppointmentDetailPage = () => {
    // Get id from route parameters
    const appointmentId = useParams().appointmentId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();

    // state which stores appointent, vehicles and not available vehicles
    const [appointment, setAppointment] = useState<Appointment>();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [notAvailableCars, setNotAvailableCars] = useState<Set<number>>(new Set());

    // http hook to make api calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // toast notifications
    const { toast } = useToast();

    // references to inputs for start and end points of task
    const startPointCoords = useRef<HTMLInputElement>(null);
    const endPointCoords = useRef<HTMLInputElement>(null);
    const [customMapError, setCustomMapError] = useState("");

    // initialization of react hook form
    const {
        register, handleSubmit, formState: { errors, isSubmitting }, reset
    } = useForm();

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const [appointmentData, vehiclesData] = await Promise.all([
                sendRequest(`/api/appointments/${appointmentId}/`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }),
                sendRequest('/api/vehicles/', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
            ]);

            if (appointmentData && vehiclesData) {
                const notAvailable = await sendRequest('/api/tasks/checktime/', 'post', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }, {
                    startTime: formatDateTime(appointmentData.time_from),
                    endTime: formatDateTime(appointmentData.time_to)
                })
                if (notAvailable) {
                    // set data to response result
                    setAppointment(appointmentData)
                    setNotAvailableCars(new Set(notAvailable.map((obj: { driver: number, car: number }) => obj.car)))
                    setVehicles(vehiclesData);
                }
                // if vehicle status is not active - meaning that it is on maintenance we make it not available for selection 
                const newActiveItemsSet = new Set(notAvailableCars);
                vehiclesData.forEach((vehicle: Vehicle) => {
                    if (vehicle.status !== 'active') {
                        newActiveItemsSet.add(vehicle.id);
                    }
                    setNotAvailableCars(newActiveItemsSet);
                });
            }
        }
        getData();
    }, []);

    // function to process form submission
    async function onSubmit(values: FieldValues) {
        clearError();
        if (startPointCoords.current!.value === '' || endPointCoords.current!.value === '') {
            setCustomMapError("Select start and end points");
            return;
        }
        // clear custom error
        setCustomMapError('');
        if (!appointment) {
            return
        }

        // add values to form data
        values.from_point = startPointCoords.current!.value;
        values.to_point = endPointCoords.current!.value;
        values.driver = appointment.driver.id;
        values.startDate = formatDateTime(appointment.time_from);
        values.endDate = formatDateTime(appointment.time_to);
        values.description = appointment.description;

        // send task data to backend
        const [taskAddedResponse, appointmentDeletedResponse] = await Promise.all([
            sendRequest('/api/tasks/add/', 'post', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values),
            sendRequest(`/api/tasks/${appointment.id}/deleteappointment/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
        ])
        if (taskAddedResponse && appointmentDeletedResponse) {
            reset();
            toast({
                title: "Task added successfully!",
            })
            navigate("/admin/appointments");
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="">
                <h1 className="text-2xl font-bold mb-2">Create task based on appointment</h1>
                <Separator />

                <div className="mt-3 grid md:grid-cols-3 lg:grid-cols-5  gap-10">
                    <div className="col-span-2">
                        {loading && <div className="flex justify-center mt-4">
                            <Spinner></Spinner>
                        </div>}
                        {error ? <div className="flex justify-center">
                            <span className="text-red-500 justify-self-center">{error}</span>
                        </div> : null}

                        <div className="">
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Appointment details</CardTitle>
                                    <Separator />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center w-full">
                                            <Avatar className="md:hidden lg:block mr-3">
                                                <AvatarFallback> <User2 /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col w-full flex-wrap break-words">
                                                <p className="text-sm font-medium w-full max-w-full">
                                                    {`${appointment?.driver.name}`}
                                                </p>
                                                <p className="text-sm text-muted-foreground lg:w-4/5 w-full">
                                                    {`${appointment?.driver.email}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                        <div className="text-sm">
                                            <div className="flex items-center"><CalendarClock className="w-4 mr-1" />Appointment time</div>
                                            <p className="ml-5">
                                                {appointment ? formatTimeRange(appointment.time_from, appointment.time_to) : ""}
                                            </p>
                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center"><ListOrdered className="w-4 mr-1" />Job description</div>
                                            <p className="ml-5">
                                                {appointment?.description}
                                            </p>
                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center"><LocateFixed className="w-4 mr-1" />Current Position</div>
                                            <p className="ml-5">
                                                {appointment?.currentPosition}
                                            </p>
                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center"><MapPin className="w-4 mr-1" />Destination</div>
                                            <p className="ml-5">
                                                {appointment?.destination}
                                            </p>
                                        </div>
                                        {appointment?.additionalInfo && <div className="mt-1">
                                            <div className="flex items-center"><Info className="w-4 mr-1" />Additional Information</div>
                                            <p className="ml-5">
                                                {appointment?.additionalInfo}
                                            </p>
                                        </div>}
                                        <div className="mt-1">
                                            <div className="flex items-center"><Users2 className="w-4 mr-1" />Number of people: {appointment?.number_of_people}</div>
                                            <div className="flex items-center"><CarFront className="w-4 mr-1" />Preferred car type: {appointment?.car_type}</div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="col-span-3 ">
                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

                            <div className="mb-2">
                                <Select
                                    {...register('car', {
                                        required: "Select a vehicle to assign!"
                                    })}
                                    size="sm"
                                    items={vehicles}
                                    variant="bordered"
                                    placeholder="Select a vehicle"
                                    disabledKeys={Array.from(notAvailableCars).map(d => `${d}`)}
                                >
                                    {(vehicle) => <SelectItem key={vehicle.id} textValue={`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.type}`}>
                                        <div className="flex justify-between">
                                            <span>{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</span>
                                            <span>{`${vehicle.type}`}</span>
                                        </div>
                                    </SelectItem>}
                                </Select>
                                {errors.car && <p className="text-red-500">{`${errors.car.message}`}</p>}

                            </div>

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

                        </form>
                    </div>
                </div>
            </div >
        </div >
    )

};

export default AppointmentDetailPage;
