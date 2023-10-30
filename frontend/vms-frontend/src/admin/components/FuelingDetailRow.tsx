import { useHttp } from '@/shared/hooks/http-hook'
import useAuth from '@/shared/hooks/useAuth'
import { Button } from '@/shared/shad-ui/ui/button'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { useToast } from '@/shared/shad-ui/ui/use-toast'
import { FuelingPerson } from '@/shared/types/types'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const FuelingDetailRow = ({ fueling_person, updateLists }: { fueling_person: FuelingPerson, updateLists: () => void }) => {
    const auth = useAuth(); // currently logged in user daat
    const navigate = useNavigate();

    const { sendRequest, clearError } = useHttp(); // custom HTTP hook to call APIs
    const { toast } = useToast(); // toast messages library
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const deleteStaff = async () => {
        if (fueling_person) {
            // clear previous errors if any
            clearError();

            // delete the user through api endpoitn
            const response = await sendRequest(`/api/staff/fueling/${fueling_person.id}/`, 'delete', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                updateLists();
                toast({ title: "Driver deleted successfully" })
            }

        }
    }

    return (
        <TableRow  >
            <TableCell className="font-medium">
                {fueling_person.name} {fueling_person.middle_name} {fueling_person.surname}
            </TableCell>
            <TableCell>{fueling_person.phone}</TableCell>
            <TableCell>{fueling_person.email}</TableCell>
            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="details" onClick={() => navigate(`/admin/staff/fueling/${fueling_person.id}/detail`)}>
                            View details
                        </DropdownItem>
                        <DropdownItem key="edit" onClick={() => navigate(`/admin/staff/fueling/${fueling_person.id}/edit`)}>
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
                                        This action cannot be undone. This will permanently delete {`${fueling_person.name}'s`} account
                                        and remove all data associated with this account.<br />

                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                                    <Button onClick={() => {
                                        onClose()
                                        deleteStaff()
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

export default FuelingDetailRow