import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Spinner } from "@nextui-org/react";
import { Task } from "@/shared/types/types";

import { Link } from "react-router-dom";
import { useHttp } from "@/shared/hooks/http-hook";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import TaskDetails from "../components/TaskDetail";
const TasksPage = () => {
    const auth = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
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
                const responseData = await sendRequest('/api/tasks', 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // set data to response result
                setTasks(responseData)
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
                <h1 className="text-2xl font-bold mb-4">Driver Tasks & Jobs</h1>
                <Link to='/admin/tasks/add'>
                    <Button variant='default'>Add Task</Button>
                </Link>
            </div>
            <Separator />
            {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>}
            {!loading && <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Date time</TableHead>
                        <TableHead>Assigned Vehicle</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tasks.map((task) => {
                            return <TaskDetails key={task.id} task={task} />
                        })
                    }

                </TableBody>
            </Table>}
            {error ? <span>{error}</span> : null}
        </>
    );
};

export default TasksPage;
