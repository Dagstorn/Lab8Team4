import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { MaintenancePerson } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MaintenancePersonalPage = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // state for maintenance person data
    const [personalData, setPersonalData] = useState<MaintenancePerson>();
    // state for boolean variable responsible for showing/hiding password value
    const [showPassword, setShowPassword] = useState(false);
    // custom HTTP hook to make  API calls
    const { loading, sendRequest } = useHttp();

    // function to retrieve data from backend api
    const getData = async () => {
        // api call 
        const responseData = await sendRequest('/api/maintenance/personal_data/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        console.log(responseData)
        if (responseData) {
            // save data in components state
            setPersonalData(responseData);
        }
    }
    // useEffect will call getData function when page laods
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            {personalData && <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-4">Personal data</h1>
                <Link className="mr-4" to={`/maintenance/edit/`}><Button variant="secondary"><Pencil className="w-4 mr-1" /> Edit perosnal data</Button></Link>
            </div>}
            <Separator />
            <div>

                {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
                {personalData && < div className="grid grid-cols-3 mt-4 mb-4">
                    <div className="xl:col-span-2 sm:col-span-3">
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <span className="col-span-3">{personalData.name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <span className="col-span-3">{personalData.surname}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Middle name</label>
                            <span className="col-span-3">{personalData.middle_name}</span>
                        </div>


                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <span className="col-span-3">{personalData.phone}</span>
                        </div>

                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{personalData.email}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Password</label>
                            <span className="col-span-3">{
                                showPassword ? (
                                    <div className="flex items-center">
                                        {personalData.password}
                                        <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal)}><EyeOff className="mr-1" /> Hide</Button>
                                    </div>
                                ) : <div className="flex items-center">
                                    •••••••••••
                                    <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal)}><Eye className="mr-1" /> Show</Button>
                                </div>
                            }</span>
                        </div>
                    </div>
                </div >}
            </div>

        </>
    )
}

export default MaintenancePersonalPage