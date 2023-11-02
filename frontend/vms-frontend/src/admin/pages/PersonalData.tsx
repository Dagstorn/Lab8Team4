import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Admin } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PersonalData = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // state for admin person data
    const [personalData, setPersonalData] = useState<Admin>();
    // state for boolean variable responsible for showing/hiding password value
    // custom HTTP hook to make  API calls
    const { loading, sendRequest } = useHttp();

    // function to retrieve data from backend api
    const getData = async () => {
        // api call 
        const responseData = await sendRequest('/api/admin/personal_data/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            console.log(responseData)
            // save data in components state
            setPersonalData(responseData);
        }
    }
    // useEffect will call getData function when page loads
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            {personalData && <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-4">Personal data</h1>
                <Link className="mr-4" to={`/admin/edit/`}><Button variant="secondary"><Pencil className="w-4 mr-1" /> Edit perosnal data</Button></Link>
            </div>}
            <Separator />
            <div>

                {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
                {personalData && < div className="grid grid-cols-3 mt-4 mb-4">
                    <div className="xl:col-span-2 sm:col-span-3">
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <span className="col-span-3">{personalData.user.first_name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <span className="col-span-3">{personalData.user.last_name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{personalData.user.email}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Username</label>
                            <span className="col-span-3">{personalData.user.username}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <span className="col-span-3">{personalData.phone}</span>
                        </div>
                    </div>
                </div >}
            </div>

        </>
    )
}

export default PersonalData;