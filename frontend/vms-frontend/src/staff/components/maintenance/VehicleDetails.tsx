import { Vehicle } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, DropdownTrigger, DropdownMenu, DropdownItem, Dropdown, Chip } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useNavigate } from "react-router";
import { getVehicleInfo } from "@/shared/utils/utils";
interface Props {
    vehicle: Vehicle,
    changeStatus: (vehicleId: number, status: string) => void
}


const VehicleDetails = ({ vehicle, changeStatus }: Props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();
    const { toast } = useToast();



    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();



    const changeVehicleStatus = async (status: string) => {
        const response = await sendRequest(`/api/maintenance/vehicles/${vehicle.id}/`, 'patch', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, {
            status: status
        })
        if (response) {
            toast({ title: "Status changed!" })
            changeStatus(vehicle.id, status);
        }
    }

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
            <TableCell>
                {vehicle.status == 'active' ? (
                    <Chip size="sm" variant="flat" color="success"
                        className="cursor-pointer"
                        onClick={() => changeVehicleStatus("notactive")}
                    >{vehicle.status}</Chip>
                ) : (
                    <Chip size="sm" variant="flat" color="danger"
                        className="cursor-pointer"
                        onClick={() => changeVehicleStatus("active")}
                    >Not active</Chip>
                )}

            </TableCell>

            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="schedule" onClick={() => navigate(`/maintenance/vehicles/${vehicle.id}/schedule`)} >
                            Schedule a job
                        </DropdownItem>
                        <DropdownItem key="details" onClick={onOpen}>
                            View details
                        </DropdownItem>
                        <DropdownItem key="edit" onClick={() => navigate(`/maintenance/vehicles/${vehicle.id}/edit`)}>
                            Edit
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </TableCell>

            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 pb-0">
                                {vehicle.make} {vehicle.model} {vehicle.year}
                                <Separator />
                            </ModalHeader>
                            <ModalBody>
                                {getVehicleInfo(vehicle)}
                            </ModalBody>
                            <ModalFooter className="pt-0 mt-0">
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>


        </TableRow >
    )
}

export default VehicleDetails