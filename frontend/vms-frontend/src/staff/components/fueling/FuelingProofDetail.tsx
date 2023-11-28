import { FuelingReport } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatSingleDateTime } from "@/shared/utils/utils";

interface Props {
    fuelingReport: FuelingReport
}


const FuelingProofDetail = ({ fuelingReport }: Props) => {
    // when conponent mounts - meaning when it is created we get data

    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>

            <TableRow key={fuelingReport.id}>
                <TableCell className="font-medium">
                    {formatSingleDateTime(fuelingReport.date)}
                </TableCell>

                <TableCell>{`${fuelingReport.vehicle.make} ${fuelingReport.vehicle.model}`}</TableCell>
                <TableCell>{fuelingReport.type}</TableCell>
                <TableCell>{fuelingReport.amount} liters</TableCell>
                <TableCell>{fuelingReport.cost} KZT</TableCell>

                <TableCell className="text-right">
                    <Button variant="outline" onClick={onOpen} >View details</Button>
                </TableCell>
                <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    {formatSingleDateTime(fuelingReport.date)}
                                    <Separator />
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col text-base">
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Vehicle:</span>
                                            <span>{`${fuelingReport.vehicle.make} ${fuelingReport.vehicle.model} ${fuelingReport.vehicle.year}`}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Fuel  type:</span>
                                            <span>{fuelingReport.type}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Fuel amount:</span>
                                            <span>{fuelingReport.amount} liters</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Total Cost:</span>
                                            <span>{fuelingReport.cost} KZT</span>
                                        </div>

                                        <div className="flex mt-2">
                                            <span className="w-2/6 font-bold mr-2">Photo before:</span>
                                            <div className="w-4/6">
                                                {fuelingReport.image_before ? <img className="w-full h-auto rounded-md object-cover"
                                                    src={`https://vmslab.online${fuelingReport.image_before}`} alt="Image" /> : "No image provided"}
                                            </div>
                                        </div>
                                        <div className="flex mt-2">
                                            <span className="w-2/6 font-bold mr-2">Photo after:</span>
                                            <div className="w-4/6">
                                                {fuelingReport.image_after ? <img className="w-full h-auto rounded-md object-cover"
                                                    src={`https://vmslab.online${fuelingReport.image_after}`} alt="Image" /> : "No image provided"}
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="secondary" onClick={onClose}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </TableRow>
        </>
    )
}

export default FuelingProofDetail