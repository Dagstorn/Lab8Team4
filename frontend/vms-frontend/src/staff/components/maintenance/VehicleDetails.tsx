import { Vehicle } from "@/shared/types/types";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { formatDistance } from "@/shared/utils/utils";
import { FieldValues, useForm } from "react-hook-form";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
    vehicle: Vehicle
}


const VehicleDetails = ({ vehicle }: Props) => {
    const auth = useAuth();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();



    // modal window for task details
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const onSubmit = async (values: FieldValues) => {
        clearError();
        if (!vehicle) {
            return
        }
        values.vehicle = vehicle.id;

        // send task data to backend
        const response = await sendRequest('/api/maintenance/jobs/add/', 'post', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            reset();
            toast({
                title: "Maintenance job was added successfully!",
            })
        }
        onClose();


    }

    return (
        <TableRow key={vehicle.id}>
            <TableCell className="font-medium">
                {vehicle.make} {vehicle.model}
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

            <TableCell>{vehicle.license_plat}</TableCell>

            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen}> Schedule a job</Button>
            </TableCell>

            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                <ModalHeader className="flex flex-col gap-1 pb-0">
                                    Schedule maintenance for - {vehicle.make} {vehicle.model} {vehicle.year}
                                    <Separator />
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col text-base">
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Year:</span>
                                            <span>{vehicle.year}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Body type:</span>
                                            <span>{vehicle.type}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Sitting Capacity:</span>
                                            <span>{vehicle.capacity}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-2/6 font-bold mr-2">Mileage:</span>
                                            <span>{formatDistance(vehicle.mileage.toString())}</span>
                                        </div>
                                        <div className="flex mb-2">
                                            <span className="w-2/6 font-bold mr-2">License plate:</span>
                                            <span>{vehicle.license_plat}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex mt-2 mb-2">
                                            <div className="w-full">
                                                <label className="font-bold" htmlFor="">Date and time</label>
                                                <input
                                                    {...register('datetime', {
                                                        required: "Date-time is required"
                                                    })}
                                                    type='datetime-local' required
                                                    className="custom-input"
                                                />
                                                {errors.datetime && <p className="text-red-500">{`${errors.datetime.message}`}</p>}
                                            </div>
                                            {error ? <div className="flex justify-center">
                                                <span className="text-red-500 justify-self-center">{error}</span>
                                            </div> : null}
                                        </div>
                                        <div className="mb-4">
                                            <label className="font-bold">Maintenance Job description</label>
                                            <textarea {...register("description", {
                                                required: "Description is required"
                                            })}
                                                className="w-full rounded-md border"
                                                rows={4} // Specify the number of visible rows
                                                // Specify the number of visible columns
                                                placeholder="Describe maintenance job..."
                                            ></textarea>

                                            {errors.amount && <p className="text-red-500">{`${errors.amount.message}`}</p>}
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="pt-0 mt-0">
                                    <Button color="danger" variant="ghost" onClick={onClose}>
                                        Close
                                    </Button>
                                    {loading ?
                                        <Button disabled className="">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
                                        </Button> :

                                        <Button className="" type="submit">
                                            Schedule a job
                                        </Button>
                                    }
                                </ModalFooter>
                            </form>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default VehicleDetails