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
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Skeleton } from "@/shared/shad-ui/ui/skeleton";

const StaffListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [fuelingStaff, setFuelingStaff] = useState<FuelingPerson[]>([]);
    const [maintenanceStaff, setMaintenanceStaff] = useState<MaintenancePerson[]>([]);
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
                const fuelingStaffData = await sendRequest('/api/getstaff/fueling', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                const maintenanceStaffData = await sendRequest('/api/getstaff/maintenance', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setFuelingStaff(fuelingStaffData)
                console.log(maintenanceStaffData.length)
                setMaintenanceStaff(maintenanceStaffData)
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
                <h1 className="text-2xl font-bold mb-4">Staff list</h1>
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
            {error ? <span>{error}</span> : null}
            {loading && <div className="flex items-center w-full p-2">
                <div className="w-full">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                </div>
            </div>}
            {!loading && <>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fueling Person</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    {fuelingStaff.length > 0 ? <TableBody>
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

                    </TableBody> : <p className="ml-4 py-4 font-bold">No fueling persons yet</p>}
                </Table>
                <Table className="mt-12">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Maintenance Person</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    {maintenanceStaff.length > 0 ? <TableBody>
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

                    </TableBody> : <p className="ml-4 py-4 font-bold">No maintenance persons yet</p>}
                </Table>
            </>}
        </>
    );
};

export default StaffListPage;
