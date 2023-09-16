// interface Driver {
//     id: number;
//     name: string;
//     email: string;
// }

import { Separator } from "@/shared/shad-ui/ui/separator";
import { useParams } from "react-router-dom";

const TaskDetailPage = () => {
    const taskId = useParams().taskId;
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Task #{taskId}</h1>
            <Separator />
        </>
    );
};

export default TaskDetailPage;
