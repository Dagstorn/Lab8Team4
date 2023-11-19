import { useHttp } from '@/shared/hooks/http-hook'
import useAuth from '@/shared/hooks/useAuth'
import { Button } from '@/shared/shad-ui/ui/button'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { useToast } from '@/shared/shad-ui/ui/use-toast'
import { Vehicle } from '@/shared/types/types'
import {  useNavigate } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { formatDistance } from '@/shared/utils/utils'

const VehicleDetailRow = ({ vehicle, removeFromList }: { vehicle: Vehicle, removeFromList: (vehicleId: number) => void }) => {
    const auth = useAuth(); // currently logged in user daat
    const navigate = useNavigate();

    const { sendRequest, clearError } = useHttp(); // custom HTTP hook to call APIs
    const { toast } = useToast(); // toast messages library
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const deleteVehicle = async () => {
        if (vehicle) {
            // clear previous errors if any
            clearError();

            // delete the user through api endpoitn
            const response = await sendRequest(`/api/vehicles/${vehicle.id}/`, 'delete', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                // delete the user from current state, because even if it is deleted from database, it can still be on the page, if page is not refreshed, therefore we manually remove it from page
                removeFromList(vehicle.id);
                toast({ title: "Driver deleted successfully" })
            }
        }
    }

    return (
        <TableRow  >
            <TableCell className="font-medium">
                {vehicle.make} {vehicle.model}
            </TableCell>
            <TableCell>
                {vehicle.status == 'active' ? (
                    <Chip size="sm" variant="flat" color="success"
                    >{vehicle.status}</Chip>
                ) : (
                    <Chip size="sm" variant="flat" color="danger"
                    >Not active</Chip>
                )}
            </TableCell>

            <TableCell>
                <div className="flex items-center">
                    <img className="w-10 h-auto mr-2"
                        src={`/vehicleIcons/${vehicle.type.toLowerCase()}.png`} alt="" />
                    {vehicle.type}
                </div>
            </TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{formatDistance(vehicle.mileage.toString())}</TableCell>
            <TableCell>{vehicle.license_plate}</TableCell>

            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="details" onClick={() => navigate(`/admin/vehicles/${vehicle.id}/detail`)}>
                            View details
                        </DropdownItem>
                        <DropdownItem key="edit" onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)}>
                            Edit
                        </DropdownItem>
                        <DropdownItem onClick={onOpen} key="delete" className="text-danger pl-4" color="danger">
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Are you absolutely sure?</ModalHeader>
                                <ModalBody>
                                    <p>
                                        This action cannot be undone. This will permanently delete {`${vehicle.make} ${vehicle.model}`}
                                        and remove all data associated with it.<br />
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                                    <Button onClick={() => {
                                        onClose()
                                        deleteVehicle()
                                    }} variant="destructive">Delete</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>


            </TableCell>
        </TableRow>
    )
}

export default VehicleDetailRow