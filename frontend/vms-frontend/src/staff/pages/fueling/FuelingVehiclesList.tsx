import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Vehicle } from "@/shared/types/types";

import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import VehicleDetails from "@/staff/components/fueling/VehicleDetails";

const FuelingVehiclesList = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {

            // get data with custom Hook
            const responseData = await sendRequest('/api/vehicles/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                // set data to response result
                setVehicles(responseData)
            }

        }
        getData();
    }, []);



    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>

            </div>

            <Separator />
            {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Body type</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>License plate number</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        vehicles.map((vehicle) => {
                            return <VehicleDetails vehicle={vehicle} />
                        })
                    }

                </TableBody>
            </Table>
            {error ? <span>{error}</span> : null}
        </>
    );
};

export default FuelingVehiclesList;
