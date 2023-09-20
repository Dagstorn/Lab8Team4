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

interface Task {
    id: number;
    name: string;
    date: string;
}
import { Link } from "react-router-dom";
const TasksPage = () => {
    let tasks: Task[] = [
        { id: 1, name: "Alex Colson", date: "19.09.2023, 14:00 - 16:00" },
        { id: 2, name: "John Doe", date: "19.09.2023, 17:00 - 19:00" },
        { id: 3, name: "Tim Smith", date: "20.09.2023, 12:00 - 13:00" },
        { id: 4, name: "Garry Olsen", date: "20.09.2023, 15:00 - 15:30" },
    ];

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Driver Tasks & Jobs</h1>
                <Link to='admin/tasks/add'>
                    <Button variant='default'>Add Task</Button>
                </Link>
            </div>
            <Separator />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Date time</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tasks.map((task) => {
                            return <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.name}</TableCell>
                                <TableCell>{task.date}</TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/admin/tasks/${task.id}`}><Button variant="outline">View details</Button></Link>
                                </TableCell>
                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
        </>
    );
};

export default TasksPage;
