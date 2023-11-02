import { Button } from '@/shared/shad-ui/ui/button'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { Admin } from '@/shared/types/types'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const AdminDetailRow = ({ admin }: { admin: Admin }) => {
    // navigation component to redirect user
    const navigate = useNavigate();

    return (
        <TableRow  >
            <TableCell className="font-medium">
                {admin.user.first_name} {admin.user.last_name}
            </TableCell>
            <TableCell>{admin.phone}</TableCell>
            <TableCell>{admin.user.email}</TableCell>
            <TableCell>{admin.user.username}</TableCell>
            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="details" onClick={() => navigate(`/admin/staff/admin/${admin.id}/detail`)}>
                            View details
                        </DropdownItem>
                        <DropdownItem key="edit" onClick={() => navigate(`/admin/staff/admin/${admin.id}/edit`)}>
                            Edit
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </TableCell>
        </TableRow>
    )
}

export default AdminDetailRow;