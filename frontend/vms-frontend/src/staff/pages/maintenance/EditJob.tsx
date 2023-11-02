import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { MaintenanceJob, RepairPart } from "@/shared/types/types";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

const AddJob = () => {
    // Get id from route parameters
    const jobId = useParams().jobId;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // state to store vehicle data
    const [job, setJob] = useState<MaintenanceJob>();
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
        clearError();
        if (job) {
            values.repair_parts = repairParts;
            const response = await sendRequest(`/api/maintenance/jobs/${job.id}/`, 'patch', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)
            if (response) {
                reset();
                toast({
                    title: "Maintenance job was added successfully!",
                })
                navigate('/maintenance/jobs/');
            }
        }
    }
    const handleItemChange = (event, index) => {
        const updatedItems = [...repairParts];
        updatedItems[index][event.target.name] = event.target.value;
        setRepairParts(updatedItems);
    };
    return (
        <div>

            <h1 className="text-2xl font-bold mb-4">Edit maintenance job </h1>
            <Separator />
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}
            {job && <div className="flex flex-col text-base">
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-2">
                        <label className="font-bold">Maintenance Job description</label>
                        <textarea {...register("description", {
                            required: "Description is required"
                        })}
                            className="w-full rounded-md border py-2 px-4"
                            rows={4} // Specify the number of visible rows
                            // Specify the number of visible columns
                            placeholder="Describe maintenance job..."
                        ></textarea>

                        {errors.amount && <p className="text-red-500">{`${errors.amount.message}`}</p>}
                    </div>

                    <div className="mb-4">
                        <h1 className="font-bold">Add repairing parts</h1>
                        {repairParts.map((item, index) => (
                            <div className="flex gap-2 items-end" key={index}>
                                <div className="">
                                    <label htmlFor="">Part name</label>
                                    <input
                                        value={item.part_name}
                                        type="text" required
                                        name="part_name"
                                        className="custom-input"
                                        onChange={e => handleItemChange(e, index)}
                                    />

                                </div>
                                <div className="">
                                    <label htmlFor="">Condition</label>
                                    <input
                                        value={item.condition}
                                        type="text" required
                                        name="condition"

                                        className="custom-input"
                                        onChange={e => handleItemChange(e, index)}
                                    />

                                </div>
                                {index !== 0 && <Button type="button" variant="secondary" onClick={() => {
                                    const newArray = [...repairParts.slice(0, index), ...repairParts.slice(index + 1)];
                                    setRepairParts(newArray);
                                }}><X className="mr-1 w-4" />Remove</Button>}
                                {index === repairParts.length - 1 && <Button type="button"
                                    variant="secondary" onClick={() => {
                                        setRepairParts((oldParts) => ([...oldParts, {
                                            id: 0, part_name: '', condition: ''
                                        }]))
                                    }}><Plus className="mr-1 w-4" />Add more</Button>}
                            </div>
                        ))}
                    </div>

                    <Button>Submit</Button>
                </form>
            </div >}


        </div >

    )
}

export default AddJob