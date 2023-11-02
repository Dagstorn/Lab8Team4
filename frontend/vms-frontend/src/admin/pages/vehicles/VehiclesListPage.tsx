import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
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
import { Spinner } from "@nextui-org/react";
import Paginator from "../../../shared/components/Paginator";
import FadeTransition from "../../components/FadeTransition";
import VehicleDetailRow from "@/admin/components/VehicleDetailRow";


const VehiclesListPage = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    // custom HTTP hook to make  API calls
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
    const removeFromList = (vehicleId: number) => {
        // fitler out driver
        const updatedList = vehicles.filter(vehicle => vehicle.id !== vehicleId);
        // update state
        setVehicles(updatedList);
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
                            <TableHead className="">Make & Model</TableHead>
                            <TableHead className="">Status</TableHead>
                            <TableHead className="">Body type</TableHead>
                            <TableHead className="">Year</TableHead>
                            <TableHead className="">Mileage</TableHead>
                            <TableHead className="">License plate number</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            vehicles.map((vehicle) => {
                                return <VehicleDetailRow key={vehicle.id + vehicle.year + vehicle.mileage} vehicle={vehicle} removeFromList={removeFromList} />

                            })
                        }

                    </TableBody>
                </Table>
                {paginationObj && <Paginator getData={getData} paginatorData={paginationObj} />}
            </FadeTransition >



            {error ? <span>{error}</span> : null
            }
        </>
    );
};

export default VehiclesListPage;
