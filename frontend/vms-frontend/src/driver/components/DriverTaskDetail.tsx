import { Button } from "@/shared/shad-ui/ui/button";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table"
import { Task } from "@/shared/types/types";
import { formatTimeRange } from "@/shared/utils/utils";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import TaskRoute from "./TaskRoute";
import { Link } from "react-router-dom";

interface Props {
    task: Task
}

const DriverTaskDetail = ({ task }: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <TableRow key={task.id}>

            <TableCell onClick={onOpen} className="cursor-pointer"> Tasks on {formatTimeRange(task.time_from, task.time_to)}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen}>View details</Button>
            </TableCell>
            <Modal size="xl" className="h-1/2" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <span>Task for {task.driver.name} {task.driver.surname}</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col text-base">
                                    <span><b>Time: </b>{formatTimeRange(task.time_from, task.time_to)}</span>
                                    <span><b>Vehicle: </b>{`${task.car.make} ${task.car.model} ${task.car.year}`}</span>
                                    <span><b>Description: </b>{task.description}</span>
                                    <span ><b>Route: </b></span>
                                    <TaskRoute task={task} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                <Link to={`/driver/task/${task.id}/`}>
                                    <Button color="primary" onClick={onClose}>
                                        Open
                                    </Button>
                                </Link>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default DriverTaskDetail