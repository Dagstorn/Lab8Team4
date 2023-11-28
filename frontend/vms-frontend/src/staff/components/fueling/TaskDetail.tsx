import { FuelingTask } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/shared/shad-ui/ui/button";


interface Props {
    task: FuelingTask
}


const VehicleDetails = ({ task }: Props) => {
    function convertISOToNormalDate(isoDateString) {
        const isoDate = new Date(isoDateString);

        const year = isoDate.getFullYear();
        const month = isoDate.getMonth() + 1;
        const day = isoDate.getDate();
        const hours = isoDate.getHours();
        const minutes = isoDate.getMinutes();
        const seconds = isoDate.getSeconds();

        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }
    return (
        <TableRow key={task.id}>

            <TableCell className="font-medium">
                {task.vehicle.make} {task.vehicle.model}
            </TableCell>
            <TableCell>
                {task.task}
            </TableCell>
            <TableCell>{convertISOToNormalDate(task.created_on)}</TableCell>
            <TableCell>
                <Link to={`https://vmslab.online/fueling/vehicles/${task.vehicle.id}/add_fueling_report`}>
                    <Button>
                        Complete
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    )
}

export default VehicleDetails