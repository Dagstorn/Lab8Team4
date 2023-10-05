import { MaintenanceJob } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatSingleDateTime, getVehicleInfo } from "@/shared/utils/utils";
import { FieldValues, useForm } from "react-hook-form";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";

interface Props {
    job: MaintenanceJob
}


const JobDetails = ({ job }: Props) => {
    const auth = useAuth();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();



    // modal window for task details
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const onSubmit = async (values: FieldValues) => {
        clearError();
        if (!job) {
            return
        }
        console.log(values)
        // try {
        //     // send task data to backend
        //     await sendRequest('/api/maintenance/jobs/add/', 'post', {
        //         Authorization: `Bearer ${auth.tokens.access}`
        //     }, values)
        //     reset();
        //     toast({
        //         title: "Maintenance job was added successfully!",
        //     })
        //     onClose();
        // } catch (err: any) {
        //     // if any erors
        //     // show error toast message
        //     toast({
        //         title: err.message,
        //         variant: "destructive",
        //     })
        // }

    }

    return (
        <TableRow key={job.id}>
            <TableCell className="font-medium">
                {job.vehicle.make} {job.vehicle.model} {job.vehicle.year}
            </TableCell>
            <TableCell>{formatSingleDateTime(job.date)}</TableCell>
            <TableCell>{job.description}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen}> Details</Button>
            </TableCell>

            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 pb-0">
                                {job.vehicle.make} {job.vehicle.model} {job.vehicle.year}
                                <Separator />
                            </ModalHeader>
                            <ModalBody>
                                {getVehicleInfo(job.vehicle)}
                            </ModalBody>
                            <ModalFooter className="pt-0 mt-0">
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>

                                <Button className="" type="submit">
                                    Complete job
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default JobDetails;