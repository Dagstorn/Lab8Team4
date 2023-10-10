import { useHttp } from '@/shared/hooks/http-hook'
import useAuth from '@/shared/hooks/useAuth'
import { Button } from '@/shared/shad-ui/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/shad-ui/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shad-ui/ui/dropdown-menu'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { useToast } from '@/shared/shad-ui/ui/use-toast'
import { Driver } from '@/shared/types/types'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const DriverDetailRow = ({ driver, removeDriverFromList }: { driver: Driver, removeDriverFromList: (driverId: number) => void }) => {
    const auth = useAuth(); // currently logged in user daat
    const [open, setIsOpen] = useState(false); // state for dialog window control
    const { sendRequest, clearError } = useHttp(); // custom HTTP hook to call APIs
    const { toast } = useToast(); // toast messages library

    const deleteDriver = async () => {
        if (driver) {
            // clear previous errors if any
            clearError();
            // close dialog window
            setIsOpen(false);
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
        <TableRow key={driver.id}>
            <TableCell className="font-medium">
                {driver.name} {driver.middle_name} {driver.surname}
            </TableCell>
            <TableCell>{driver.phone}</TableCell>
            <TableCell>{driver.email}</TableCell>
            <TableCell className="text-right">
                <Dialog open={open} onOpenChange={setIsOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="border rounded-sm px-2 py-1">Actions</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="p-0 text-center">
                                <Link className="p-2 rounded-sm w-full" to={`/admin/drivers/${driver.id}/detail`}>View details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0 text-center">
                                <Link className="p-2 rounded-sm w-full" to={`/admin/drivers/${driver.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                                <DialogTrigger className="p-2 rounded-sm w-full text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-100">Delete</DialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete {`${driver.name}'s`} account
                                and remove all data associated with this account.<br />
                                Specifically,
                                <ul>
                                    <li>- Personal information</li>
                                    <li>- Currently assigned tasks</li>
                                    <li>- Routes history</li>
                                    <li>- Completed tasks</li>
                                    <li>- Appointments</li>
                                </ul>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setIsOpen(false)} type='submit' variant="secondary">Cancel</Button>
                            <Button onClick={deleteDriver} variant="destructive">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </TableCell>
        </TableRow>
    )
}

export default DriverDetailRow