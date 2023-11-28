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
import VehicleDetails from "@/staff/components/fueling/VehicleDetails";
import FadeTransition from "@/admin/components/FadeTransition";
import Paginator from "@/shared/components/Paginator";

const FuelingVehiclesList = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);

    const getData = async (page: number) => {
        const responseData = await sendRequest(`/api/vehicles/paginated/?page=${page}`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            console.log(auth.tokens.access);
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
                {paginationObj && <Paginator getData={getData} paginatorData={paginationObj} />}
            </FadeTransition>
            {error ? <span>{error}</span> : null}

        </>
    );
};

export default FuelingVehiclesList;
