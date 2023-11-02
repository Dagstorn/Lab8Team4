import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/shad-ui/ui/table";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { MaintenanceJob, RepairPart } from "@/shared/types/types";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";



const CompleteJob = () => {
    // Get id from route parameters
    const jobId = useParams().jobId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store vehicle data
    const [job, setJob] = useState<MaintenanceJob>();
    // state to store repairParts data
    const [repairParts, setRepairParts] = useState<RepairPart[]>([]);
    // custom HTTP hook to make  API calls
    const { error, sendRequest, clearError } = useHttp()
    // react hook form initialization 
    const {
        register, handleSubmit, setValue, reset, formState: { errors },
    } = useForm();
    // toast library to show toast messages like notifications
    const { toast } = useToast();


    // fumction to fetch vehicles list from api
    const getData = async () => {
        if (jobId) {
            const responseData = await sendRequest(`/api/maintenance/jobs/${jobId}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            const repairPartsData = await sendRequest(`/api/maintenance/jobs/${jobId}/parts`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (responseData && repairPartsData) {
                // save to state
                setJob(responseData);
                setRepairParts(repairPartsData)
                // set corresponding form input values
                setValue('description', responseData.description);

            }
        }
    }
    // useEffect will run getVehicle if vehicleId changes to ensure we have actual data
    useEffect(() => {
        getData();
    }, [jobId])

    const onSubmit = async (values: FieldValues) => {
        // get actual files 
        values.part_photo.forEach((_, index) => {
            values.part_photo[index] = values.part_photo[index][0];
        })
        // add repair parts to form data
        values.repair_parts = repairParts

        clearError();
        if (job) {
            values.repair_parts = repairParts;
            const response = await sendRequest(`/api/maintenance/jobs/${job.id}/complete/`, 'post', {
                Authorization: `Bearer ${auth.tokens.access}`,
                "Content-Type": "multipart/form-data"
            }, values)
            if (response) {
                reset();
                toast({
                    title: "Maintenance record was added successfully!",
                })
                navigate('/maintenance/jobs/');
            }
        }
    }

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4">Complete maintenance job </h1>
            <Separator />
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}
            {job && <div className="flex flex-col text-base">
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-2 mb-2">
                        <span className="font-bold text-xl">Maintenance Job description</span>
                        <p>{job.description}</p>
                        <h1 className="font-bold text-xl mt-4">Repair parts list</h1>


                    </div>
                    <div className="mb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Replaced parts</TableHead>
                                    <TableHead>Part number</TableHead>
                                    <TableHead>Upload a photo of repaired/replaced part</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {repairParts?.map((part, index) => (
                                    <TableRow key={part.part_name + index}>
                                        <TableCell>
                                            {`${index + 1}. ${part.part_name} (${part.condition})`}
                                        </TableCell>
                                        <TableCell>

                                            <input {...register(`part_number[${index}]`, {
                                                required: "Write part number"
                                            })}
                                                type="text" required
                                                className="custom-input"
                                            />
                                            {errors.part_number && <p className="text-red-500">{`${errors.part_number.message}`}</p>}
                                        </TableCell>
                                        <TableCell>
                                            <input {...register(`part_photo[${index}]`, {
                                                required: "Add file"
                                            })}
                                                type="file" required
                                                className="custom-input"
                                            />
                                            {errors.part_photo && <p className="text-red-500">{`${errors.part_photo.message}`}</p>}
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-2 flex items-center gap-5 mb-4">
                        <div className="font-bold">Calculate and provide total cost in KZT</div>
                        <div><input {...register("cost", {
                            required: "Provide total cost"
                        })}
                            type="number" required
                            className="custom-input"
                        /></div>
                    </div>
                    <Separator />

                    <Button className="mt-4">Submit</Button>
                </form>
            </div >}


        </div >
    )
}

export default CompleteJob