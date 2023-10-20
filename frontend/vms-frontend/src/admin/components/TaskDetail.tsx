import { Task } from "@/shared/types/types";
import { formatTimeRange } from "@/shared/utils/utils";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { Link } from "react-router-dom";

interface Props {
    task: Task,
    deleteTask: (task: Task) => void
}

const TaskDetails = ({ task, deleteTask }: Props) => {
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // google maps api to translate location coordinates to actual location name


    const getStatus = () => {
        if (task.status === "Assigned") {
            return <Chip color="warning">{task.status}</Chip>
        } else if (task.status === "In progress") {
            return <Chip color="secondary">{task.status}</Chip>
        } else if (task.status === "Completed") {
            return <Chip color="success">{task.status}</Chip>
        }
        return <Chip color="danger">No status?</Chip>
    }
    const processDeleteTask = () => {
        deleteTask(task);

    }
    return (
        <TableRow key={task.id}>
            <TableCell className="font-medium">{task.driver.name} {task.driver.surname}</TableCell>
            <TableCell> {formatTimeRange(task.time_from, task.time_to)}</TableCell>
            <TableCell>{`${task.car.make} ${task.car.model} ${task.car.year}`}</TableCell>
            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen} >View details</Button>
            </TableCell>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <span>Task for {task.driver.name} {task.driver.surname} {getStatus()}</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col text-base">
                                    <span><b>Time: </b>{formatTimeRange(task.time_from, task.time_to)}</span>
                                    <span><b>Vehicle: </b>{`${task.car.make} ${task.car.model} ${task.car.year}`}</span>
                                    <span><b>Description: </b>{task.description}</span>
                                    <span ><b>Route: </b></span>
                                    {task.from_point}<br />
                                    {task.to_point}

                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="destructive" onClick={() => {
                                    onClose()
                                    processDeleteTask()
                                }}>
                                    Delete
                                </Button>
                                <Link to={`/admin/tasks/${task.id}/edit/`}>
                                    <Button color="primary" onClick={onClose}>
                                        Edit Task
                                    </Button>
                                </Link>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow >
    )
}

export default TaskDetails