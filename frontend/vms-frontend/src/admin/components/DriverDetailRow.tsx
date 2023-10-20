import { useHttp } from '@/shared/hooks/http-hook'
import useAuth from '@/shared/hooks/useAuth'
import { Button } from '@/shared/shad-ui/ui/button'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { useToast } from '@/shared/shad-ui/ui/use-toast'
import { Driver } from '@/shared/types/types'
import { Link } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const DriverDetailRow = ({ driver, removeDriverFromList }: { driver: Driver, removeDriverFromList: (driverId: number) => void }) => {
    const auth = useAuth(); // currently logged in user daat
    const { sendRequest, clearError } = useHttp(); // custom HTTP hook to call APIs
    const { toast } = useToast(); // toast messages library
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const deleteDriver = async () => {
        if (driver) {
            // clear previous errors if any
            clearError();
            // close dialog window
            try {
                // delete the user through api endpoitn
                await sendRequest(`/api/drivers/${driver.id}/`, 'delete', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                // delete the user from current state, because even if it is deleted from database, it can still be on the page, if page is not refreshed, therefore we manually remove it from page
                removeDriverFromList(driver.id);
                toast({ title: "Driver deleted successfully" })
            } catch (err: any) {
                // show error toast message if any
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <TableRow  >
            <TableCell className="font-medium">
                {driver.name} {driver.middle_name} {driver.surname}
            </TableCell>
            <TableCell>{driver.phone}</TableCell>
            <TableCell>{driver.email}</TableCell>
            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="details">
                            <Link className="p-2 rounded-sm w-full" to={`/admin/drivers/${driver.id}/detail`}>View details</Link>
                        </DropdownItem>
                        <DropdownItem key="edit">
                            <Link className="p-2 rounded-sm w-full" to={`/admin/drivers/${driver.id}/edit`}>Edit</Link>
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
                                        This action cannot be undone. This will permanently delete {`${driver.name}'s`} account
                                        and remove all data associated with this account.<br />
                                        Specifically,
                                        <span><br />
                                            <span>- Personal information</span><br />
                                            <span>- Currently assigned tasks</span><br />
                                            <span>- Routes history</span><br />
                                            <span>- Completed tasks</span><br />
                                            <span>- Appointments</span><br />
                                        </span>
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                                    <Button onClick={() => {
                                        onClose()
                                        deleteDriver()
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

export default DriverDetailRow