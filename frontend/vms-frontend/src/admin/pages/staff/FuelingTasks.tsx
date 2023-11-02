import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { FuelingTask } from "@/shared/types/types";

import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { Button } from "@/shared/shad-ui/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import FuelingTaskDetailRow from "@/admin/components/FuelingTaskDetailRow";

const FuelingTasks = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [tasks, setTasks] = useState<FuelingTask[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();

    // retrieve data from api
    const getData = async () => {
        // get data with custom Hook
        const responseData = await sendRequest('/api/staff/tasks/fueling/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            // set data to response result
            setTasks(responseData)
        }
    }
    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();

        getData();
    }, []);



    return (
        <>
            <div className="flex gap-4 justify-between">
                <div className="flex gap-2">
                    <h1 className="text-2xl font-bold mb-4">Fueling tasks list</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>
                <Link to="/admin/fueling/tasks/add"><Button><PlusCircle className="w-4 mr-1" />Add Task</Button></Link>

            </div>

            <Separator />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Created on</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tasks.map((task) => {
                            return <FuelingTaskDetailRow key={task.vehicle.id} task={task} getData={getData} />
                        })
                    }

                </TableBody>
            </Table>
            {error ? <span>{error}</span> : null}
        </>
    );
};

export default FuelingTasks;
