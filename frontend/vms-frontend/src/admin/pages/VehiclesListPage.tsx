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
interface Vehicle {
    id: number;
    name: string;
    licensePlate: string;
    bodyType: string;
    status: string;
}
import { Checkbox } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { Link } from "react-router-dom";
const VehiclesListPage = () => {
    let vehicles: Vehicle[] = [
        { id: 1, name: "Transit 2023 | 385APM01 | Van", licensePlate: "385APM01", bodyType: "Van", status: "Available" },
        { id: 2, name: "Suburban 2023 | 302EZA01 | SUV", licensePlate: "302EZA01", bodyType: "SUV", status: "Available" },
        { id: 3, name: "A4 2019 | 17ABE244 | Sedan", licensePlate: "17ABE244", bodyType: "Sedan", status: "Assigned to driver" },
        { id: 4, name: "Sonata 2022 | 540OJD01 | Sedan", licensePlate: "540OJD01", bodyType: "Sedan", status: "Available" },
        { id: 5, name: "Camry 2022 | 464OPO01 | Sedan", licensePlate: "464OPO01", bodyType: "Sedan", status: "Available" },
        { id: 6, name: "F-150 2023 | 595ABE01 | Pickup Truck", licensePlate: "595ABE01", bodyType: "Pickup Truck", status: "Available" },
        { id: 7, name: "Pacifica 2022 | 980RKA01 | Minivan", licensePlate: "980RKA01", bodyType: "Minivan", status: "Available" },
        { id: 8, name: "X5 2010 | 439SOH01 | Crossover", licensePlate: "439SOH01", bodyType: "Crossover", status: "Available" },
    ];


    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Vehicles list</h1>
                <Link to="/admin/vehicles/add"><Button variant='default'>Add vehicle</Button></Link>
            </div>

            <Separator />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>license plate</TableHead>
                        <TableHead>Body type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        vehicles.map((vehicle) => {
                            return <TableRow key={vehicle.id}>
                                <TableCell className="font-medium">{vehicle.name}</TableCell>
                                <TableCell>{vehicle.licensePlate}</TableCell>
                                <TableCell>{vehicle.bodyType}</TableCell>
                                <TableCell>
                                    <Chip color={vehicle.status != "Available" ? "warning" : "secondary"}>{vehicle.status}</Chip>

                                </TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/admin/vehicle/${vehicle.id}/detail`}><Button variant="outline">View details</Button></Link>
                                </TableCell>
                            </TableRow>
                        })
                    }

                </TableBody>
            </Table>
        </>
    );
};

export default VehiclesListPage;
