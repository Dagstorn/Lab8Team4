import { Vehicle } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Link } from "react-router-dom";
import { getVehicleInfo } from "@/shared/utils/utils";

interface Props {
    vehicle: Vehicle
}


const VehicleDetails = ({ vehicle }: Props) => {
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <TableRow key={vehicle.id}>
            <TableCell className="font-medium">
                {vehicle.make} {vehicle.model}
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <img className="w-10 h-auto mr-2"
                        src={`/vehicleIcons/${vehicle.type.toLowerCase()}.png`} alt="" />
                    {vehicle.type}
                </div>

            </TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{vehicle.license_plate}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen} >View details</Button>
            </TableCell>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {vehicle.make} {vehicle.model} {vehicle.year}
                                <Separator />
                            </ModalHeader>
                            <ModalBody>
                                {getVehicleInfo(vehicle)}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="secondary" onClick={onClose}>
                                    Close
                                </Button>

                                <Link to={`/fueling/vehicles/${vehicle.id}/add_fueling_report`}>
                                    <Button color="primary" onClick={onClose}>
                                        Add Fueling Report
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

export default VehicleDetails