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
import { PaginatorObj, Task } from "@/shared/types/types";

import { Link } from "react-router-dom";
import { useHttp } from "@/shared/hooks/http-hook";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import TaskDetails from "../components/TaskDetail";
import FadeTransition from "../components/FadeTransition";
import Paginator from "../components/Paginator";

const TasksPage = () => {
    const auth = useAuth();
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    // function to retrieve data from api
    const getData = async (page: number) => {
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const responseData = await sendRequest(`/api/tasks/paginated/?page=${page}`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            // set data to response result
            setTasks(responseData.results)
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

    const deleteTask = async (task: Task) => {
        if (tasks) {
            const updatedList = tasks.filter((item: Task) => item.id !== task.id);

            try {
                // get data with custom Hook
                await sendRequest(`/api/tasks/${task.id}`, 'delete', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                toast({ title: "Tasks deleted successfully!" })
                setTasks(updatedList);
            } catch (err: any) {
                // show error toast message
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <>
            <div className="flex justify-between">

                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Driver Tasks & Jobs</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>
                <Link to='/admin/tasks/add'>
                    <Button variant='default'>Add Task</Button>
                </Link>
            </div>
            <Separator />

            <FadeTransition show={tasks.length > 0}>

                <Table>
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
                                return <TaskDetails key={task.id} task={task} deleteTask={deleteTask} />
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

export default TasksPage;
