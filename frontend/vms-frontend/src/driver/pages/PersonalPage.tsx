import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Separator } from "@/shared/shad-ui/ui/separator"
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useEffect, useState } from "react";

const PersonalPage = () => {

    const auth = useAuth();
    const [fullname, setFullname] = useState("");

    const { sendRequest, clearError } = useHttp();
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
                const driverData = await sendRequest('/api/driver/', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setFullname(`${driverData.name} ${driverData.surname}`)
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
        <>
            <h1 className="text-2xl font-bold mb-4">Hello, {fullname}</h1>
            <Separator />
            <div>PersonalPage</div>
        </>
    )
}

export default PersonalPage