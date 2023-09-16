// interface Driver {
//     id: number;
//     name: string;
//     email: string;
// }

import { Separator } from "@/shared/shad-ui/ui/separator";
import { useParams } from "react-router-dom";

const AppointmentDetailPage = () => {
    const appointmentId = useParams().appointmentId;
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Appointment #{appointmentId}</h1>
            <Separator />
        </>
    );
};

export default AppointmentDetailPage;
