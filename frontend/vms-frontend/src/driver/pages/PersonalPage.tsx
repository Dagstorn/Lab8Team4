import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Separator } from "@/shared/shad-ui/ui/separator"
import { useEffect, useState } from "react";

const PersonalPage = () => {

    const auth = useAuth();
    const [fullname, setFullname] = useState("");

    const { error, sendRequest, clearError } = useHttp();


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const driverData = await sendRequest('/api/driver/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (driverData) {
                // set data to response result
                setFullname(`${driverData.name} ${driverData.surname}`)
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