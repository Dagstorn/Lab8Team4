import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator'
import { useToast } from '@/shared/shad-ui/ui/use-toast';
import { CompletedRoute } from '@/shared/types/types';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import RouteMap from '../components/RouteMap';
import { Button } from '@/shared/shad-ui/ui/button';
import { formatTimeRange } from '@/shared/utils/utils';

const RoutesHistory = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [routes, setRoutes] = useState<CompletedRoute[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // try and catch to catch errors if any
            try {
                // get data with custom Hook
                const responseData = await sendRequest('/api/routes_history', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setRoutes(responseData)
            } catch (err: any) {
                // show error toast message
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
        getData();
    }, []);
    function formatDistance(distance: string) {
        const meters = parseInt(distance);
        if (meters >= 1000) {
            return `${meters / 1000} km`;
        } else {
            return `${meters} m`;
        }
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
                <div className='bg-gray-200 col-span-1'>
                    {routes.map((route) => (
                        <Button variant="ghost" className='w-full rounded-none'>
                            {formatTimeRange(route.time_from, route.time_to)}<br />
                            {formatDistance(route.distance_covered)}
                        </Button>
                    ))}
                </div>
                <div className='bg-gray-200 col-span-3'>
                    <RouteMap />
                </div>
            </div>}

        </div>
    )
}

export default RoutesHistory