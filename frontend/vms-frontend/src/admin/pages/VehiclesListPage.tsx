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

import { Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { formatDistance } from "@/shared/utils/utils";
import { Pagination, PaginationItem, PaginationCursor } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const VehiclesListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    const [page, setPage] = useState(1);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();

    // retrieve data from api
    const getData = async (page: number) => {
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const responseData = await sendRequest(`/api/vehicles/?page=${page}`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
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
        } catch (err: any) {
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
    }

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        getData(1);
    }, []);


    const prevPage = () => {
        if (page > 1) {
            getData(page - 1);
            setPage((prevPage) => prevPage - 1);
        }
    }

    const nextPage = (paginationObj: PaginatorObj) => {
        if (page < paginationObj.page_size) {
            getData(page + 1);
            setPage((prevPage) => prevPage + 1);
        }
    }

    const paginationBtn = (pageNum: number, paginationObj: PaginatorObj) => {
        if (pageNum > 0 && pageNum <= paginationObj.page_size) {
            getData(pageNum);
            setPage(pageNum);
        }
    }
    const pageLinks = (paginationObj: PaginatorObj) => {
        const elementsArray = Array.from({ length: paginationObj.page_size }, (_, index) => (
            <Button
                onClick={() => paginationBtn(index + 1, paginationObj)}
                key={index}
                variant={page === index + 1 ? "default" : "secondary"}
            >
                {index + 1}
            </Button >
        ));

        return (
            <div className="flex justify-center items-center gap-2">
                {elementsArray}
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>
                <Link to="/admin/vehicles/add"><Button variant='default'>Add vehicle</Button></Link>
            </div>

            <Separator />
            {/* {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>} */}
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

            {paginationObj && <div className="mt-4 flex justify-center items-center gap-2">
                <Button className="py-1 px-3" onClick={prevPage}
                    disabled={paginationObj.previous === null}>
                    <ChevronLeft className="w-4" />
                </Button>
                {pageLinks(paginationObj)}
                <Button className="py-1 px-3" onClick={() => nextPage(paginationObj)}
                    disabled={paginationObj.next === null} >
                    <ChevronRight className="w-4" />
                </Button>
            </div>}

            {error ? <span>{error}</span> : null}
        </>
    );
};

export default VehiclesListPage;
