import { Appointment } from "@/shared/types/types";
import { formatTimeRange } from "@/shared/utils/utils";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";


interface Props {
    appointment: Appointment
}
const AppointmentDetails = ({ appointment }: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <TableRow key={appointment.id}>
            <TableCell className="font-medium">
                {appointment.driver.name} {appointment.driver.surname}
            </TableCell>
            <TableCell>
                {formatTimeRange(appointment.time_from, appointment.time_to)}
            </TableCell>
            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen} >View details</Button>
            </TableCell>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {appointment.driver.name} {appointment.driver.surname}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col">
                                    <span><b>Route</b>: {appointment.currentPosition} to {appointment.destination}</span>
                                    <span><b>Description</b>: {appointment.description}</span>

                                    <span><b>Preffered car type</b>: {appointment.car_type}</span>
                                    <span><b>Number of people</b>: {`${appointment.number_of_people}`}</span>
                                    <span><b>Number of people</b>: {appointment.additionalInfo ? appointment.additionalInfo : "Not specified"}</span>
                                    <span><b>Booking time window</b>:{formatTimeRange(appointment.time_from, appointment.time_to)}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onClick={onClose}>
                                    Create Task
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default AppointmentDetails