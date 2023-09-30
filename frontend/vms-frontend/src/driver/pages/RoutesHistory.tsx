import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator'
import { useToast } from '@/shared/shad-ui/ui/use-toast';
import { useEffect, useState } from 'react';

const RoutesHistory = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [drivers, setDrivers] = useState<any[]>([]);
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
                const responseData = await sendRequest('/api/drivers', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setDrivers(responseData)
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

    return (
        <div className='flex flex-col'>
            <h1 className="text-2xl font-bold mb-2">Routes history </h1>
            <Separator />
            <div className="grid grid-cols-4 gap-2">
                <div className='bg-gray-200 col-span-1'>
                    jj
                </div>
                <div className='bg-gray-200 col-span-3'>
                    jj
                </div>
            </div>
        </div>
    )
}

export default RoutesHistory