import { Separator } from "@/shared/shad-ui/ui/separator";
import DriverTasks from "../components/DriverTasks";
const TasksPage = () => {
    return (
        <div className="flex flex-col">
            <div>
                <h1 className="text-2xl font-bold mb-2">Currently assigned tasks </h1>
                <Separator />
                <DriverTasks />
            </div>
        </div>
    );
};

export default TasksPage;
