import FadeTransition from '@/admin/components/FadeTransition';
import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/shad-ui/ui/table';
import { FuelingTask } from '@/shared/types/types';
import TaskDetail from '@/staff/components/fueling/TaskDetail';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react'

const PFuelingTasks = () => {
    const auth = useAuth();

    // state which stores drivers list
    const [tasks, setTasks] = useState<FuelingTask[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();

    const getData = async () => {
        const responseData = await sendRequest(`/api/fueling/tasks/`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (responseData) {
            console.log("got tasks")
            console.log(responseData)
            setTasks(responseData);
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
            <div className="flex justify-between">
                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Fueling tasks</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>
            </div>
            <Separator />
            <FadeTransition show={tasks.length > 0}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            tasks.map((task) => {
                                return <TaskDetail task={task} />
                            })
                        }

                    </TableBody>
                </Table>
            </FadeTransition>
            {error ? <span>{error}</span> : null}

        </>
    )
}

export default PFuelingTasks;