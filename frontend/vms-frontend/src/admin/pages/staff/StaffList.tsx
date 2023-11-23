import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Admin, FuelingPerson, MaintenancePerson } from "@/shared/types/types";
import { Fuel, Wrench } from 'lucide-react';
import { Link } from "react-router-dom";
import useAuth from "@/shared/hooks/useAuth";
import { useEffect, useState } from "react";
import { useHttp } from "@/shared/hooks/http-hook";
import FadeTransition from "../../components/FadeTransition";
import { Spinner } from "@nextui-org/react";
import FuelingDetailRow from "../../components/FuelingDetailRow";
import MaintenanceDetailRow from "@/admin/components/MaintenanceDetailRow";
import AdminDetailRow from "@/admin/components/AdminDetailRow";

const StaffListPage = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();

    // states which store list of fueling persons and list of maintenance persons
    const [fuelingStaff, setFuelingStaff] = useState<FuelingPerson[]>([]);
    const [maintenanceStaff, setMaintenanceStaff] = useState<MaintenancePerson[]>([]);
    const [adminStaff, setAdminStaff] = useState<Admin[]>([]);
    // custom HTTP hook to make  API calls
    const { loading, error, sendRequest, clearError } = useHttp();

    // retrieve data from api
    const getData = async () => {
        // get data with custom Hook
        const [fuelingStaffData, maintenanceStaffData, adminData] = await Promise.all([
            sendRequest('/api/staff/fueling/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            }),
            sendRequest('/api/staff/maintenance/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            }),
            sendRequest('/api/staff/admin/', 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
        ]);
        if (fuelingStaffData && maintenanceStaffData && adminData) {
            // set data to response result
            setFuelingStaff(fuelingStaffData)
            setMaintenanceStaff(maintenanceStaffData)
            setAdminStaff(adminData)
        }
    }
    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        getData();
    }, []);
    const updateLists = () => {
        getData();
    }

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

            <FadeTransition show={maintenanceStaff.length > 0 || fuelingStaff.length > 0 || adminStaff.length > 0}>
                {adminStaff.length > 0 ? <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            adminStaff.map((employee) => {
                                return <AdminDetailRow key={`maintenance${employee.id}`} admin={employee} />
                            })
                        }

                    </TableBody>
                </Table> : <span className="ml-4 py-4 font-bold">No maintenance persons yet</span>}
                {fuelingStaff.length > 0 ? <Table className="mt-12">
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
                                return <FuelingDetailRow key={`fueling${employee.id}`} fueling_person={employee} updateLists={updateLists} />
                            })
                        }
                    </TableBody>
                </Table> : <div className="w-full flex justify-center items-center text-center">
                    <div className="mt-2 text-gray-500">
                        <h3 className="mt-4 text-lg font-semibold">No Fueling staff to display</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You have not added any Fueling person.
                        </p>
                    </div>
                </div>}
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
                                return <MaintenanceDetailRow key={`maintenance${employee.id}`} maintenance_person={employee} updateLists={updateLists} />
                            })
                        }

                    </TableBody>
                </Table> : <div className="w-full flex justify-center items-center text-center">
                    <div className="mt-2 text-gray-500">
                        <h3 className="mt-4 text-lg font-semibold">No Maintenance staff to display</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You have not added any Maintenance person.
                        </p>
                    </div>
                </div>}


            </FadeTransition>
        </>
    );
};

export default StaffListPage;
