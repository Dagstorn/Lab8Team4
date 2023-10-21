import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator'
import { useToast } from '@/shared/shad-ui/ui/use-toast';
import { CompletedRoute, RoutePoints, point } from '@/shared/types/types';
import { useEffect, useState } from 'react';
import RouteMap from '../components/RouteMap';

import { formatDistance, formatTimeRange } from '@/shared/utils/utils';
import { ScrollShadow, Spinner } from "@nextui-org/react";
const RoutesHistory = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [routes, setRoutes] = useState<CompletedRoute[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();

    const [points, setPoints] = useState<RoutePoints>();

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const responseData = await sendRequest('/api/routes_history', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                // set data to response result
                setRoutes(responseData)
            }

        }
        getData();
    }, []);

    const renderRoute = (point1: point, point2: point) => {
        console.log("selected")
        console.log(point2.lat)

        setPoints({
            start: point1,
            end: point2,
        })
    }

    return (
        <div className='h-full grid grid-rows-[auto,1fr]'>
            <div>
                <h1 className="text-2xl font-bold mb-2">Routes history </h1>
                <Separator />
                {loading && <div className="flex justify-center mt-4">
                    <Spinner></Spinner>
                </div>}
                {error ? <span>{error}</span> : null}
            </div>

            {!loading && <div className="mt-2 grid grid-cols-4 gap-2">
                <div className="col-span-1">
                    <ScrollShadow className="w-full h-[78vh] grid gap-2">
                        {routes.map((route) => (
                            <div
                                onClick={() => renderRoute(JSON.parse(route.from_point), JSON.parse(route.to_point))}
                                className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-2 w-full rounded-none text-left justify-start">
                                {formatTimeRange(route.time_from, route.time_to)}<br />
                                {formatDistance(route.distance_covered)}
                            </div>
                        ))}
                    </ScrollShadow>
                </div>
                <div className='bg-gray-200 col-span-3 h-[78vh]'>
                    <RouteMap routePoints={points} />
                </div>
            </div>}

        </div >
    )
}

export default RoutesHistory