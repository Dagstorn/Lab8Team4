import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Button } from "@/shared/shad-ui/ui/button";
import { Input } from "@/shared/shad-ui/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/shad-ui/ui/form";
import useAuth from "@/shared/hooks/useAuth";
import { useHttp } from "@/shared/hooks/http-hook";
import { DateTimeInput } from "@/shared/components/DateTimeInput"
import { toast } from "@/shared/shad-ui/ui/use-toast";
import { Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
const formSchema = z.object({
    currentPosition: z.string().nonempty({
        message: "This is required information",
    }),
    destination: z.string().nonempty({
        message: "This is required information",
    }),
    description: z.string().nonempty({
        message: "This is required information",
    }),
    carPereferences: z.string(),
    numberOfPeople: z.number().gte(0).lte(10),
    additionalInfo: z.string(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
})


const MakeAppointmentPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { loading, error, sendRequest, clearError } = useHttp();

    // let decoded_data: any = jwt_decode(auth.tokens.access);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPosition: '',
            destination: '',
            description: '',
            carPereferences: '',
            numberOfPeople: 1,
            additionalInfo: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        clearError();
        try {
            await sendRequest('/api/appointments/add/', 'post', {
                Authorization: `Bearer ${auth.tokens.access}`
            }, values)
            toast({
                title: "Appointment is submitted successfully!",
            })
            navigate('/driver/personal_page/')
        } catch (err: any) {
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
        console.log(values)
    }
    return (
        <div className="aa h-full flex flex-col justify-center">
            <div className="">
                <h1 className="text-2xl text-center font-bold">Make an appointment request</h1>
                {loading && <div className="flex justify-center mt-4">
                    <Spinner></Spinner>
                </div>}
                {error ? <div className="flex justify-center">
                    <span className="text-red-500 justify-self-center">{error}</span>
                </div> : null}
                <div className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 flex flex-col items-center">
                            <div className="sm:w-full md:w-full lg:w-1/2">
                                <FormField
                                    control={form.control}
                                    name="currentPosition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your current position</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Destination</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job description</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="carPereferences"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Car pereferences</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="numberOfPeople"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numebr of people in car</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="additionalInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Any additional information if needed</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                />

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Any additional information if needed</FormLabel>
                                            <FormControl>
                                                <DateTimeInput {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Any additional information if needed</FormLabel>
                                            <FormControl>
                                                <DateTimeInput {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                />
                            </div>
                            <Button className="sm:w-full md:w-full lg:w-1/2 " type="submit">Submit</Button>
                        </form>
                    </Form>

                </div>
            </div >
        </div >

    );
};

export default MakeAppointmentPage;
