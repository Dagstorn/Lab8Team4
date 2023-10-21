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
import { Vehicle, PaginatorObj } from "@/shared/types/types";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { formatDistance } from "@/shared/utils/utils";
import { Spinner } from "@nextui-org/react";
import Paginator from "../components/Paginator";
import FadeTransition from "../components/FadeTransition";


const VehiclesListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    const { loading, error, sendRequest, clearError } = useHttp();

    // retrieve data from api
    const getData = async (page: number) => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // get data with custom Hook
        const responseData = await sendRequest(`/api/vehicles/paginated/?page=${page}`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            // set data to response result
            if (paginationObj) {
                const updatedObj = {
                    ...paginationObj,
                    count: responseData.count,
                    next: responseData.next,
                    previous: responseData.previous
                }
                setPaginationObj(updatedObj);
            } else {
                setPaginationObj({
                    count: responseData.count,
                    page_size: Math.ceil(responseData.count / responseData.results.length),
                    next: responseData.next,
                    previous: responseData.previous
                })
            }
            setVehicles(responseData.results)
        }

    }

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        getData(1);
    }, []);

    return (
        <>
            <div className="flex justify-between">
                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>

                <Link to="/admin/vehicles/add"><Button variant='default'>Add vehicle</Button></Link>
            </div>

            <Separator />
            {error ? <div className="text-red-400 mt-4 ">Error: {error}</div> : null}

            <FadeTransition show={vehicles.length > 0}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Make & Model</TableHead>
                            <TableHead className="w-1/5">Body type</TableHead>
                            <TableHead className="">Year</TableHead>
                            <TableHead className="">Mileage</TableHead>
                            <TableHead className="">License plate number</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            vehicles.map((vehicle) => {
                                return <TableRow key={vehicle.id + vehicle.year + vehicle.mileage}>
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
                {paginationObj && <Paginator getData={getData} paginatorData={paginationObj} />}
            </FadeTransition>



            {error ? <span>{error}</span> : null}
        </>
    );
};

export default VehiclesListPage;
