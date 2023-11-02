import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { PaginatorObj, Vehicle } from "@/shared/types/types";

import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import VehicleDetails from "@/staff/components/maintenance/VehicleDetails";
import Paginator from "../../../shared/components/Paginator";
import FadeTransition from "@/admin/components/FadeTransition";

const MaintenanceVehiclesList = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);

    // retrieve data from api
    const getData = async (page: number) => {
        // get data with custom Hook
        const responseData = await sendRequest(`/api/maintenance/vehicles_paginated/?page=${page}`, 'get', {
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
            // set data to response result
            setVehicles(responseData.results)
        }
    }


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        getData(1);
    }, []);

    const changeStatus = (vehicleId: number, status: string) => {
        const updatedList = vehicles.map(vehicle => (vehicle.id === vehicleId ? { ...vehicle, status: status } : vehicle))
        // update state
        setVehicles(updatedList);
    }

    return (
        <>
            <div className="flex justify-between">
                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>

            </div>

            <Separator />
            <FadeTransition show={vehicles.length > 0}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Driver</TableHead>
                            <TableHead>Body type</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>License plate number</TableHead>
                            <TableHead>Status (click to change)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            vehicles.map((vehicle) => {
                                return <VehicleDetails key={vehicle.id} vehicle={vehicle} changeStatus={changeStatus} />
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

export default MaintenanceVehiclesList;
