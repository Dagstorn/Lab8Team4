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

const formSchema = z.object({
    routeDescription: z.string().nonempty({
        message: "This is required information",
    }),
    jobDescription: z.string(),
    carPereferences: z.string(),
    numberOfPeople: z.number().gte(0).lte(10),
    additionalInfo: z.string(),
    startDateTime: z.string().nonempty({
        message: "Please select a date and time",
    }),
    endDateTime: z.string().nonempty({
        message: "Please select a date and time",
    }),

})
const MakeAppointmentPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            routeDescription: "",
            jobDescription: "",
            numberOfPeople: 1,
            additionalInfo: "",
            startDateTime: "",
            endDateTime: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <div className="aa h-full flex flex-col justify-center">
            <div className="">
                <h1 className="text-2xl text-center font-bold">Make an appointment request</h1>
                <div className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 flex flex-col items-center">
                            <div className="sm:w-full md:w-full lg:w-1/2">
                                <FormField
                                    control={form.control}
                                    name="routeDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tell where you are and wher you want to go</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jobDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Describe a job - Optional</FormLabel>
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
                                    name="startDateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start of booking time</FormLabel>
                                            <FormControl>
                                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    type="datetime-local"
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End of booking time</FormLabel>
                                            <FormControl>
                                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    type="datetime-local"
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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
