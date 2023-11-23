import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { FuelingReport } from "@/shared/types/types";

import { Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import FuelingProofDetail from "@/staff/components/fueling/FuelingProofDetail";

const FuelingReports = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [reports, setReports] = useState<FuelingReport[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const responseData = await sendRequest('/api/fueling/reports/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData) {
                // set data to response result
                setReports(responseData)
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
                        <TableHead>Date and Time</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Fuel type</TableHead>
                        <TableHead>Fuel amount</TableHead>
                        <TableHead>Fuel cost</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        reports.map((report) => {
                            return <FuelingProofDetail fuelingReport={report} />
                        })
                    }

                </TableBody>
            </Table>
            {error ? <span>{error}</span> : null}
        </>
    );
};

export default FuelingReports;
