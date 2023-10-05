import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Vehicle } from "@/shared/types/types";

import { Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { formatDistance } from "@/shared/utils/utils";

const VehiclesListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
                const responseData = await sendRequest('/api/vehicles', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setVehicles(responseData)
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
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>
                <Link to="/admin/vehicles/add"><Button variant='default'>Add vehicle</Button></Link>
            </div>

            <Separator />
            {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Make & Model</TableHead>
                        <TableHead>Body type</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Mileage</TableHead>
                        <TableHead>License plate number</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        vehicles.map((vehicle) => {
                            return <TableRow key={vehicle.id}>
                                <TableCell className="font-medium">
                                    {vehicle.make} {vehicle.model}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <img className="w-10 h-auto mr-2"
                                            src={`/vehicleIcons/${vehicle.type.toLowerCase()}.png`} alt="" />
                                        {vehicle.type}
                                    </div>

                                </TableCell>
                                <TableCell>{vehicle.year}</TableCell>
                                <TableCell>{formatDistance(vehicle.mileage.toString())}</TableCell>
                                <TableCell>{vehicle.license_plat}</TableCell>

                                <TableCell className="text-right">
                                    <Link to={`/admin/vehicles/${vehicle.id}/report`}><Button variant="outline">View details</Button></Link>
                                </TableCell>
                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
            {error ? <span>{error}</span> : null}
        </>
    );
};

export default VehiclesListPage;
