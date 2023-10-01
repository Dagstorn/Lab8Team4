import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { CompletedRoute, Task } from "@/shared/types/types";
import { formatDistance, formatTimeRange, getHoursAndMinutes } from "@/shared/utils/utils";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/shared/shad-ui/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { Progress } from "@nextui-org/react";
import { useJsApiLoader } from "@react-google-maps/api";

const ViewTaskPage = () => {
    const taskId = useParams().taskId;
    const [started, setStarted] = useState(false);

    const auth = useAuth();
    const [task, setTask] = useState<Task>();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places', 'routes']
    })

    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();

    const [progressValue, setProgressValue] = useState(0);
    const [progressIntervalId, setProgressIntervalId] = useState<any | null>(null);

    const [completedRoute, setCompletedRoute] = useState<CompletedRoute>();


    const checkProgressInterval = (responseData: any) => {
        const now = new Date();
        const startTime = new Date(Date.parse(responseData.time_from));
        const endTime = new Date(Date.parse(responseData.time_to));

        const minuteDifference: number = Math.abs(Math.floor((endTime.getTime() - startTime.getTime()) / 60000));
        const minuteDifferenceFromStart = Math.abs(Math.floor((now.getTime() - startTime.getTime()) / 60000));
        const percentage = (minuteDifferenceFromStart / minuteDifference) * 100;
        if (percentage >= 100) {
            clearInterval(progressIntervalId);
        }
        setProgressValue(Math.min(100, Math.max(0, percentage)));
    }

    const getData = async () => {
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const responseData = await sendRequest(`/api/task/${taskId}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            // set data to response result
            setTask(responseData)
            if (progressIntervalId) {
                clearInterval(progressIntervalId);
            }
            const newIntervalId = setInterval(() => checkProgressInterval(responseData), 500);
            setProgressIntervalId(newIntervalId);
        } catch (err: any) {
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
    }
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        getData();
    }, []);

    useEffect(() => {

        return () => {
            if (progressIntervalId !== null) {
                clearInterval(progressIntervalId);
            }
        };
    }, [progressIntervalId]);

    const checkStartTime = (taskStartTime: string) => {
        const now = new Date();
        const startTime = new Date(Date.parse(taskStartTime));
        return now > startTime;
    }
    const checkEndTime = (taskEndTime: string) => {
        const now = new Date();
        const endTime = new Date(Date.parse(taskEndTime));
        return now < endTime;
    }
    function toIsoString(date: Date) {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num: number) {
                return (num < 10 ? '0' : '') + num;
            };

        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }

    const processStart = async () => {
        if (task && checkStartTime(task.time_from)) {
            try {
                const now = new Date();
                const timeStarted = toIsoString(now);
                console.log(now)
                console.log(timeStarted)
                // get data with custom Hook
                await sendRequest(`/api/task/${taskId}/update_status/`, 'post', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }, { status: "In progress", timeStarted: timeStarted })
                // set data to response result

                getData();
                setStarted(true);
            } catch (err: any) {
                // show error toast message
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
    }
    type latlng = {
        lat: number;
        lng: number;
    };

    const calculateDistance = async (point1: latlng, point2: latlng) => {
        if (isLoaded) {
            const directionService = new google.maps.DirectionsService();

            const results = await directionService.route({
                origin: point1,
                destination: point2,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            return results.routes[0].legs[0].distance?.value
        }
    }

    const processComplete = async () => {
        if (task && checkStartTime(task.time_from)) {
            try {
                const now = new Date();
                const startTime = new Date(Date.parse(task.time_from));
                const time_spent: number = Math.abs(Math.floor((now.getTime() - startTime.getTime()) / 60000));
                const timeEnded = now.toISOString();
                const distance_covered = await calculateDistance(JSON.parse(task.from_point), JSON.parse(task.to_point))

                // get data with custom Hook
                const completedRouteData = await sendRequest(`/api/complete_task/${task.id}/`, 'post', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }, { time_spent: time_spent, distance_covered: distance_covered, timeEnded: timeEnded })

                // set data to response result
                setCompletedRoute(completedRouteData);
                // set data to response result
                getData();
                setStarted(true);

            } catch (err: any) {
                // show error toast message
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
        // setCompleted(true);
    }

    const getControls = () => {
        if (task) {
            if (checkStartTime(task.time_from) && checkEndTime(task.time_to)) {
                if (task.status !== "Completed") {
                    return <>
                        <div className="grid grid-rows-2">
                            <Progress aria-label="Loading..." value={progressValue} className="mt-4" />
                            <div className="flex justify-between">
                                <span>{getHoursAndMinutes(task?.time_from || "")}</span>
                                <span>{getHoursAndMinutes(task?.time_to || "")}</span>
                            </div>
                        </div>
                        <div className="mt-2">

                            {started ? <Button disabled className="mr-2" >
                                Start task
                            </Button> : <Button className="mr-2" onClick={processStart}>
                                Start task
                            </Button>
                            }

                            {(started) ? <Button onClick={processComplete} >
                                Complete task
                            </Button> : <Button disabled>
                                Complete task
                            </Button>
                            }
                        </div></>
                }
            } else {
                if (!checkStartTime(task.time_from)) {
                    return (
                        <Alert className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                You will be able to start the task when specified time comes!
                            </AlertDescription>
                        </Alert>
                    )
                } else {
                    return (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Time to perform the task is up!</AlertTitle>
                            <AlertDescription>
                                Your time window to perform this task is ended. Create new appointment or request administration to reschedule the task.
                            </AlertDescription>
                        </Alert>
                    )
                }

            }
        }

        return null;
    }
    if (completedRoute) {
        return <div className="flex flex-col">
            {!loading && task && <h1 className="text-xl font-bold mb-2">Task on {formatTimeRange(task.time_from, task.time_to)} </h1>}
            <Separator />
            <div>
                <p>You have completed the task successfully!</p>
                <p>Total distance covered: {formatDistance(completedRoute.distance_covered)}</p>

            </div>
        </div>
    }
    return (
        <div className="flex flex-col">
            {!loading && task && <h1 className="text-xl font-bold mb-2">Task on {formatTimeRange(task.time_from, task.time_to)} </h1>}
            <Separator />


            {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>}
            {error ? <span>{error}</span> : null}
            {getControls()}

        </div>
    )
}

export default ViewTaskPage