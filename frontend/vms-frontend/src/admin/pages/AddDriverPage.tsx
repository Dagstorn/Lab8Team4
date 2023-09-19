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

const formSchema = z.object({
    firstname: z.string().nonempty({
        message: "Firstname is required",
    }),
    lastname: z.string().nonempty({
        message: "Lastname is required",
    }),
    middlename: z.string(),
    govermentId: z.string().refine((val) => (val.length <= 12 && val.length >= 12), {
        message: "Goverment ID should contain 12 digits",
    }),
    address: z.string().nonempty({
        message: "Address is required",
    }),
    phone: z.string().refine((val) => validator.isMobilePhone(val, 'kk-KZ'), {
        message: "Enter correct phone number",
    }),
    email: z.string().refine((val) => validator.isEmail(val), {
        message: "Enter correct email",
    }),
    department: z.string().nonempty({
        message: "Department is required",
    }),
    license: z.string().refine((val) => (val.length <= 6 && val.length >= 6), {
        message: "License code should contain 6 digits",
    }),
})
// interface Driver {
//     id: number;
//     name: string;
//     email: string;
// }

import { Separator } from "@/shared/shad-ui/ui/separator";

const DriverDetailPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            middlename: "",
            govermentId: "",
            address: "",
            phone: "",
            email: "",
            department: "",
            license: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add driver</h1>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 flex flex-col items-start">
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
                            name="govermentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Goverment ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
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
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="license"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Driver License code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className="sm:w-full md:w-full lg:w-1/2 " type="submit">Add</Button>
                </form>
            </Form>
        </>
    );
};

export default DriverDetailPage;
