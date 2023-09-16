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

interface Appointment {
    id: number;
    name: string;
    date: string;
}
import { Link } from "react-router-dom";
const DriversListPage = () => {
    let appointments: Appointment[] = [
        { id: 1, name: "Alex Colson", date: "19.09.2023, 14:00 - 16:00" },
        { id: 2, name: "John Doe", date: "19.09.2023, 17:00 - 19:00" },
        { id: 3, name: "Tim Smith", date: "20.09.2023, 12:00 - 13:00" },
        { id: 4, name: "Garry Olsen", date: "20.09.2023, 15:00 - 15:30" },
    ];

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Appointments list</h1>
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
                        appointments.map((appointment) => {
                            return <TableRow key={appointment.id}>
                                <TableCell className="font-medium">{appointment.name}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/admin/appointments/${appointment.id}`}><Button variant="outline">View details</Button></Link>
                                </TableCell>
                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
        </>
    );
};

export default DriversListPage;
