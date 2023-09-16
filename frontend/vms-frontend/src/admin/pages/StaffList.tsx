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
interface Driver {
    id: number;
    name: string;
    phone: string;
    email: string;
}
import { Link } from "react-router-dom";
const StaffListPage = () => {
    let drivers: Driver[] = [
        { id: 1, name: "Alex Colson", phone: "+7(727)273-75-48", email: "alex@gmail.com" },
        { id: 2, name: "John Doe", phone: "+7(7172)21-21-47", email: "johndoe@gmail.com" },
        { id: 3, name: "Tim Smith", phone: "+7(7182)73-46-37", email: "timsmith@gmail.com" },
        { id: 4, name: "Garry Olsen", phone: "+7(7242)23-44-60", email: "garryolsen@gmail.com" },
    ];


    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Staff list</h1>
                <Link to="/admin/drivers/add"><Button variant='default'>Add driver</Button></Link>
            </div>

            <Separator />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        drivers.map((driver) => {
                            return <TableRow key={driver.id}>
                                <TableCell className="font-medium">{driver.name}</TableCell>
                                <TableCell>{driver.phone}</TableCell>
                                <TableCell>{driver.email}</TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/admin/drivers/${driver.id}/detail`}><Button variant="outline">View details</Button></Link>
                                </TableCell>
                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
        </>
    );
};

export default StaffListPage;
