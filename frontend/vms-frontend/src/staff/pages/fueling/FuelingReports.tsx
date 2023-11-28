import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { FuelingReport, Vehicle } from "@/shared/types/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import FuelingProofDetail from "@/staff/components/fueling/FuelingProofDetail";
const FuelingReports = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [allReports, setAllReports] = useState<FuelingReport[]>([]);
    const [reports, setReports] = useState<FuelingReport[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const { loading, error, sendRequest, clearError } = useHttp();


    const onSelectionChange = (id: any) => {
        if (id) {
            setReports(allReports.filter(report => report.vehicle.id === Number(id)));
        } else {
            showAll();
            return;
        }

    };
    useEffect(() => {

    }, [reports])



    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const responseData = await sendRequest('/api/fueling/records/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            console.log(responseData);
            if (responseData) {
                // set data to response result
                setReports(responseData);
                setAllReports(responseData);
                let distinctVehicleIds: Set<number> = new Set();
                let distinctVehicles: Vehicle[] = [];

                responseData.forEach(report => {
                    if (!distinctVehicleIds.has(report.vehicle.id)) {
                        distinctVehicleIds.add(report.vehicle.id);
                        distinctVehicles.push(report.vehicle);
                    }
                });

                setVehicles(distinctVehicles);

            }

        }
        getData();
    }, []);

    const showAll = () => {
        setReports(allReports);
        console.log("cleared.....")
    }

    return (
        <>
            <div className="flex gap-6 items-center mb-2">
                <h1 className="text-2xl font-bold">Fueling records information</h1>
                {loading && <div className="">
                    <Spinner></Spinner>
                </div>}
                <Autocomplete
                    placeholder="Select vehicle"
                    variant="underlined"
                    size="sm"
                    defaultItems={vehicles}
                    className="max-w-xs"
                    allowsCustomValue={true}
                    onSelectionChange={onSelectionChange}
                    onClear={showAll}
                    onReset={showAll}
                >
                    {(vehicle) => <AutocompleteItem key={vehicle.id}>{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</AutocompleteItem>}
                </Autocomplete>
            </div>

            <Separator />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/6">Date and Time</TableHead>
                        <TableHead className="w-1/6">Vehicle</TableHead>
                        <TableHead className="w-1/6">Fuel type</TableHead>
                        <TableHead className="w-1/6">Fuel amount</TableHead>
                        <TableHead className="w-1/6">Fuel cost</TableHead>
                        <TableHead className="w-1/6 text-right">Action</TableHead>
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
