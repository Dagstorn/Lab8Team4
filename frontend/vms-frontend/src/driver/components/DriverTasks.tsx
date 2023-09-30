import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Table, TableBody } from "@/shared/shad-ui/ui/table";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Task } from "@/shared/types/types";
import { useEffect, useState } from "react";
import DriverTaskDetail from "./DriverTaskDetail";
import { Spinner } from "@nextui-org/react";

const DriverTasks = () => {

    const auth = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);

    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();

    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // try and catch to catch errors if any
            try {
                // get data with custom Hook
                const responseData = await sendRequest('/api/driver_tasks/', 'get', {
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
            {loading && <div className="flex justify-center mt-4">
                <Spinner></Spinner>
            </div>}
            {!loading && <Table>

                <TableBody>
                    {
                        tasks.map((task) => {
                            return <DriverTaskDetail task={task} />
                        })
                    }

                </TableBody>
            </Table>}
            {error ? <span>{error}</span> : null}
        </>


    )
}

export default DriverTasks