import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Appointment, PaginatorObj } from "@/shared/types/types";
import useAuth from "@/shared/hooks/useAuth";
import { useEffect, useState } from "react";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Spinner } from "@nextui-org/react";
import AppointmentDetails from '../components/AppointmentDetails';
import FadeTransition from "../components/FadeTransition";
import Paginator from "../components/Paginator";

const DriversListPage = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);

    // function to retrieve data from api
    const getData = async (page: number) => {
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const responseData = await sendRequest(`/api/appointments/paginated/?page=${page}`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            setAppointments(responseData.results)
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


    return (
        <>
            <div className="flex gap-4">
                <h1 className="text-2xl font-bold mb-4">Appointments list</h1>
                {loading && <div className="">
                    <Spinner></Spinner>
                </div>}
            </div>
            <Separator />
            <FadeTransition show={appointments.length > 0}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Driver</TableHead>
                            <TableHead>Requested time frame</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            appointments.map((appointment) => {
                                return <AppointmentDetails key={appointment.id} appointment={appointment} />
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

export default DriversListPage;
