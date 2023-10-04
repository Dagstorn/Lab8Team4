import { Task } from "@/shared/types/types";

import { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import { Skeleton } from "@/shared/shad-ui/ui/skeleton";


interface Props {
    task: Task
}
const TaskRoute = ({ task }: Props) => {
    const [addressFrom, setAddressFrom] = useState("");
    const [addressTo, setAddressTo] = useState("");
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places', 'routes']
    })
    useEffect(() => {
        const getRoute = async () => {
            const geocoder = new google.maps.Geocoder;
            const point1 = JSON.parse(task.from_point);
            const point2 = JSON.parse(task.to_point);

            geocoder.geocode({ location: point1 })
                .then(async (response: any) => {
                    setAddressFrom(response.results[0].formatted_address)
                    setLoading1(false);
                })
            geocoder.geocode({ location: point2 })
                .then(async (response: any) => {
                    setAddressTo(response.results[0].formatted_address)
                    setLoading2(false);

                })

        }
        if (isLoaded) {
            getRoute();
        }
    })
    if (!loading1 && !loading2) {
        return <>
            {addressFrom}<br />
            {addressTo}</>
    } else {
        return <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-2 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    }

}

export default TaskRoute