import { MaintenanceJob } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatSingleDateTime, getVehicleInfo } from "@/shared/utils/utils";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";

interface Props {
    job: MaintenanceJob
}

const MaintenanceTaskDetailRow = ({ job }: Props) => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    // react hook form initialization 
    const {
        register, handleSubmit, formState: { errors },
    } = useForm();
    // custom HTTP hook to make  API calls
    const { sendRequest, clearError } = useHttp()
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const getJobType = (type: string) => {
        if (type === "monthly") {
            return <Chip size="sm" variant="flat" color="success"
            >{type}</Chip>
        } else if (type === "yearly") {
            return <Chip size="sm" variant="flat" color="warning"
            >{type}</Chip>
        } else if (type === "accidental") {
            return <Chip size="sm" variant="flat" color="danger"
            >{type}</Chip>
        } else {
            return <Chip size="sm" color="default"
            >{type}</Chip>
        }
    }


    const onSubmit = async (values: FieldValues) => {
        clearError();
        // send task data to backend
        if (job) {
            const response = await sendRequest(`/api/staff/tasks/maintenance/${job.id}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)

            if (response) {
                setIsEditing(false);
                job.description = response.description;
            }
        }

    }
    return (
        <TableRow key={job.id}>
            <TableCell className="font-medium">
                {job.vehicle.make} {job.vehicle.model} {job.vehicle.year}
            </TableCell>
            <TableCell>{formatSingleDateTime(job.created_on)}</TableCell>
            <TableCell>{job.description}</TableCell>
            <TableCell>{getJobType(job.type)}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen}> Details</Button>
            </TableCell>

            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 pb-0">
                                <div className="flex items-center">{job.vehicle.make} {job.vehicle.model} {job.vehicle.year}
                                    <Chip size="sm" variant="flat" color="success" className="ml-3 mr-2"
                                    >{job.type} job</Chip>
                                </div>
                                <Separator />
                            </ModalHeader>
                            <ModalBody className="gap-0">
                                {getVehicleInfo(job.vehicle)}
                                <Separator className="mb-2 mt-2" />
                                <p>
                                    <span className="font-bold">Job Type: </span>
                                    {job.type}
                                </p>
                                <div>
                                    <span className="font-bold">Job Description: </span>
                                    {isEditing ? <form onSubmit={handleSubmit(onSubmit)}>
                                        <textarea {...register("description", {
                                            required: "Description is required"
                                        })}
                                            className="w-full rounded-md border py-2 px-4"
                                            rows={4} // Specify the number of visible rows
                                            // Specify the number of visible columns
                                            placeholder="Describe maintenance job..."
                                        ></textarea>

                                        {errors.description && <p className="text-red-500">{`${errors.description.message}`}</p>}

                                    </form> : <span>{job.description}</span>}

                                </div>


                            </ModalBody>
                            <ModalFooter className="pt-0 mt-0">
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                {isEditing ? <Button onClick={handleSubmit(onSubmit)} type="submit">Save</Button> : <Button variant="ghost" onClick={() => {
                                    setIsEditing(oldVal => !oldVal);
                                }}>
                                    <Pencil className="w-4 mr-1" />Edit maintenance job data
                                </Button>}


                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default MaintenanceTaskDetailRow;