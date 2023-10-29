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
import { FuelingPerson, MaintenancePerson } from "@/shared/types/types";
import { Fuel, Wrench } from 'lucide-react';
import { Link } from "react-router-dom";
import useAuth from "@/shared/hooks/useAuth";
import { useEffect, useState } from "react";
import { useHttp } from "@/shared/hooks/http-hook";
import FadeTransition from "../components/FadeTransition";
import { Spinner } from "@nextui-org/react";

const StaffListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [fuelingStaff, setFuelingStaff] = useState<FuelingPerson[]>([]);
    const [maintenanceStaff, setMaintenanceStaff] = useState<MaintenancePerson[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();


    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const [fuelingStaffData, maintenanceStaffData] = await Promise.all([
                sendRequest('/api/getstaff/fueling', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }),
                sendRequest('/api/getstaff/maintenance', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
            ]);
            if (fuelingStaffData && maintenanceStaffData) {
                // set data to response result
                setFuelingStaff(fuelingStaffData)
                setMaintenanceStaff(maintenanceStaffData)
            }
        }
        getData();
    }, []);


    return (
        <>
            <div className="flex justify-between">

                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Staff list</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>
                <div >
                    <Link className="mr-2" to="/admin/staff/add/fueling">
                        <Button variant='secondary'><Fuel className="mr-1" /> Add fueling person</Button>
                    </Link>
                    <Link to="/admin/staff/add/maintenance">
                        <Button variant='secondary'><Wrench className="mr-1" />Add maintenance person</Button>
                    </Link>

                </div>
            </div>
            <Separator />
            {error ? <div className="text-red-400 mt-4 ">Error: {error}</div> : null}

            <FadeTransition show={maintenanceStaff.length > 0}>

                {fuelingStaff.length > 0 ? <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fueling Person</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            fuelingStaff.map((employee) => {
                                return <TableRow key={employee.id}>
                                    <TableCell className="font-medium w-1/4">{employee.name} {employee.surname}</TableCell>
                                    <TableCell className="w-1/4">{employee.phone}</TableCell>
                                    <TableCell className="w-1/4">{employee.email}</TableCell>
                                    <TableCell className="text-right w-1/4">
                                        <Button variant="outline">View details</Button>
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table> : <span className="ml-4 py-4 font-bold">No fueling persons yet</span>}
                {maintenanceStaff.length > 0 ? <Table className="mt-12">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Maintenance Person</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            maintenanceStaff.map((employee) => {
                                return <TableRow key={employee.id}>
                                    <TableCell className="font-medium w-1/4">{employee.name} {employee.surname}</TableCell>
                                    <TableCell className="w-1/4">{employee.phone}</TableCell>
                                    <TableCell className="w-1/4">{employee.email}</TableCell>
                                    <TableCell className="text-right w-1/4">
                                        <Button variant="outline">View details</Button>
                                    </TableCell>
                                </TableRow>
                            })
                        }

                    </TableBody>
                </Table> : <span className="ml-4 py-4 font-bold">No maintenance persons yet</span>}
            </FadeTransition>
        </>
    );
};

export default StaffListPage;
