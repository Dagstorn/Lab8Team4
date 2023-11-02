import { FuelingTask } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatSingleDateTime, getVehicleInfo } from "@/shared/utils/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";

interface Props {
    task: FuelingTask,
    getData: () => void
}

const FuelingTaskDetailRow = ({ task, getData }: Props) => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    // react hook form initialization 
    const {
        register, handleSubmit, formState: { errors },
    } = useForm();
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp()
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const processDelete = async () => {
        if (task) {
            setIsEditing(false);
            const response = await sendRequest(`/api/staff/tasks/fueling/${task.id}/`, 'delete', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                getData()
            }
        }
    }
    const onSubmit = async (values: FieldValues) => {
        clearError();
        // send task data to backend
        if (task) {
            const response = await sendRequest(`/api/staff/tasks/fueling/${task.id}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)

            if (response) {
                setIsEditing(false);
                task.task = response.task;
            }
        }

    }
    return (
        <TableRow>
            <TableCell className="font-medium">
                {task.vehicle.make} {task.vehicle.model} {task.vehicle.year}
            </TableCell>
            <TableCell>{formatSingleDateTime(task.created_on)}</TableCell>
            <TableCell>{task.task}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen}> Details</Button>
            </TableCell>

            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 pb-0">
                                <div className="flex items-center">{task.vehicle.make} {task.vehicle.model} {task.vehicle.year}
                                </div>
                                <Separator />
                            </ModalHeader>
                            <ModalBody className="gap-0">
                                {getVehicleInfo(task.vehicle)}
                                <Separator className="mb-2 mt-2" />

                                <div>
                                    <span className="font-bold">Task: </span>
                                    {isEditing ? <form onSubmit={handleSubmit(onSubmit)}>
                                        <textarea {...register("task", {
                                            required: "Task is required"
                                        })}
                                            className="w-full rounded-md border py-2 px-4"
                                            rows={4} // Specify the number of visible rows
                                            // Specify the number of visible columns
                                            placeholder="Describe maintenance job..."
                                        ></textarea>

                                        {errors.task && <p className="text-red-500">{`${errors.task.message}`}</p>}

                                    </form> : <span>{task.task}</span>}

                                </div>


                            </ModalBody>
                            <ModalFooter className="pt-0 mt-0">
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                <Button variant="destructive" onClick={() => {
                                    onClose();
                                    processDelete();
                                }}>
                                    <Trash2 className="w-4 mr-1" />Delete
                                </Button>
                                {isEditing ? <Button onClick={handleSubmit(onSubmit)} type="submit">Save</Button> : <Button onClick={() => {
                                    setIsEditing(oldVal => !oldVal);
                                }}>
                                    <Pencil className="w-4 mr-1" />Edit maintenance job data
                                </Button>}


                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default FuelingTaskDetailRow;