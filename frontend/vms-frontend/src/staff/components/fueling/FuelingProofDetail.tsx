import { FuelingReport, Vehicle } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { formatSingleDateTime } from "@/shared/utils/utils";

interface Props {
    fuelingReport: FuelingReport
}


const FuelingProofDetail = ({ fuelingReport }: Props) => {
    const auth = useAuth();
    const [vehicle, setVehicle] = useState<Vehicle>();
    const { sendRequest, clearError } = useHttp();

    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // retrieve data from api
        const getData = async () => {
            // get data with custom Hook
            const vehicleData = await sendRequest(`/api/vehicles/${fuelingReport.vehicle.id}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (vehicleData) {
                // set data to response result
                setVehicle(vehicleData)
            }

        }
        getData();
    }, []);
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            {vehicle ? <TableRow key={fuelingReport.id}>
                <TableCell className="font-medium">
                    {formatSingleDateTime(fuelingReport.date)}
                </TableCell>

                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
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
                                            <span>{vehicle.make} {vehicle.model} {vehicle.year}</span>
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
                                                <img className="w-full h-auto rounded-md object-cover"
                                                    src={`http://127.0.0.1:8000/${fuelingReport.image_before}`} alt="Image" />
                                            </div>
                                        </div>
                                        <div className="flex mt-2">
                                            <span className="w-2/6 font-bold mr-2">Photo after:</span>
                                            <div className="w-4/6">
                                                <img className="w-full h-auto rounded-md object-cover"
                                                    src={`http://127.0.0.1:8000/${fuelingReport.image_after}`} alt="Image" />
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
            </TableRow> : <Spinner />}

        </>
    )
}

export default FuelingProofDetail