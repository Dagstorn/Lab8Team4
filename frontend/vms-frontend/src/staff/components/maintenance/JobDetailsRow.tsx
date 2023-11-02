import { MaintenanceJob, RepairPart } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatSingleDateTime, getVehicleInfo } from "@/shared/utils/utils";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

interface Props {
    job: MaintenanceJob
}

const JobDetails = ({ job }: Props) => {
    const auth = useAuth();
    const [repairParts, setRepairParts] = useState<RepairPart[]>([]);
    const { sendRequest } = useHttp();

    useEffect(() => {
        const getData = async () => {
            const repairPartsData = await sendRequest(`/api/maintenance/jobs/${job.id}/parts/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (repairPartsData) {
                setRepairParts(repairPartsData);

            }
        }
        if (job) {
            getData();
        }
    }, [])

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
                                    <Link to={`/maintenance/vehicles/${job.vehicle.id}/edit`}><Button variant="ghost">
                                        <Pencil className="w-4 mr-1" />Edit Vehicle data</Button>
                                    </Link>
                                </div>
                                <Separator />
                            </ModalHeader>
                            <ModalBody>
                                {getVehicleInfo(job.vehicle)}
                                <Separator />
                                <p><span className="font-bold">Job Description: </span>{job.description}</p>
                                {repairParts && repairParts.length > 0 && <div>
                                    <h1 className="font-bold">Repair parts list</h1>

                                    {repairParts?.map((part, index) => (
                                        <div className="flex " key={part.part_name + index}>
                                            <div className="w-1/3">{index + 1}. {part.part_name} </div>
                                            <div>{part.condition} </div>
                                        </div>
                                    ))}
                                </div>}


                            </ModalBody>
                            <ModalFooter className="pt-0 mt-0">
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                <Link to={`/maintenance/jobs/${job.id}/edit`}><Button variant="ghost">
                                    <Pencil className="w-4 mr-1" />Edit maintenance job data</Button>
                                </Link>
                                <Link to={`/maintenance/jobs/${job.id}/complete`}>
                                    <Button className="" type="submit">
                                        Complete job
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

export default JobDetails;