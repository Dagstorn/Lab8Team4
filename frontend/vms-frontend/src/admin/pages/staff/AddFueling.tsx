import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Button } from "@/shared/shad-ui/ui/button";
//@ts-ignore
import validator from 'validator';
import { Input } from "@/shared/shad-ui/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/shad-ui/ui/form";
import { toast } from "@/shared/shad-ui/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    firstname: z.string().nonempty({
        message: "Firstname is required",
    }),
    lastname: z.string().nonempty({
        message: "Lastname is required",
    }),
    middlename: z.string(),
    phone: z.string().refine((val) => validator.isMobilePhone(val, 'kk-KZ'), {
        message: "Enter correct phone number",
    }),
    email: z.string().refine((val) => validator.isEmail(val), {
        message: "Enter correct email",
    }),
    password: z.string()

})

const AddFueling = () => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();
    // custom HTTP hook to make  API calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // form initialization using react hook form and form schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            middlename: "",
            phone: "",
            email: "",
            password: "",

        },
    })
    // function to process form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        clearError();
        // send task data to backend
        const response = await sendRequest('/api/staff/fueling/', 'post', {
            Authorization: `Bearer ${auth.tokens.access}`
        }, values)
        if (response) {
            toast({
                title: "Staff memmber was added successfully!",
            })
            navigate("/admin/staff");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Add Fueling Person</h1>
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 flex flex-col items-center">
                    <div className="sm:w-full md:w-full xl:w-1/2">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middlename"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="87---------" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Eamil</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password (If not provided will be generated by the system)</FormLabel>
                                    <FormControl>
                                        <input type="password" className="custom-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    {loading ?
                        <Button disabled className="mt-4 sm:w-full md:w-full lg:w-1/2 ">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
                        </Button> :

                        <Button className="mt-4sm:w-full md:w-full lg:w-1/2" type="submit">
                            Submit
                        </Button>
                    }
                </form>
            </Form>
        </>
    );
};

export default AddFueling;
