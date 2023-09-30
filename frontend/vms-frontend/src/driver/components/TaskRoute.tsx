import { Task } from "@/shared/types/types";
import { Timeline, Flowbite, CustomFlowbiteTheme } from 'flowbite-react';
import { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Spinner } from "@nextui-org/react";
import { Skeleton } from "@/shared/shad-ui/ui/skeleton";
const customTheme: CustomFlowbiteTheme = {
    timeline: {
        item: {
            point: {
                marker: {
                    base: {
                        vertical: "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-gray bg-blue-400"
                    },
                }
            },
            content: {
                title: "text-xl-3 font-bold text-blue-500"
            },
        },

    }
};

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
        return <Flowbite theme={{ theme: customTheme }}>
            <Timeline className="mb-0 mt-1 ml-1 text-base">
                <Timeline.Item className="mb-0">
                    <Timeline.Point />
                    <Timeline.Content>
                        <Timeline.Title className="text-base">
                            {addressFrom}
                        </Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item className="mb-0">
                    <Timeline.Point />
                    <Timeline.Content>
                        <Timeline.Title className="text-base">
                            {addressTo}
                        </Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
            </Timeline>
        </Flowbite>
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