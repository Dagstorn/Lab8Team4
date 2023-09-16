// interface Driver {
//     id: number;
//     name: string;
//     email: string;
// }

import { Separator } from "@/shared/shad-ui/ui/separator";
import { useParams } from "react-router-dom";

const DriverDetailPage = () => {
    const driverID = useParams().driverID;
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Driver {driverID}</h1>
            <Separator />
        </>
    );
};

export default DriverDetailPage;
