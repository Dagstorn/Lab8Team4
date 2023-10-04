import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/shad-ui/ui/button";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/shad-ui/ui/form";
import { Input } from "@/shared/shad-ui/ui/input";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import jwt_decode from "jwt-decode";
import { useHttp } from "./hooks/http-hook";

const formSchema = z.object({
    username: z.string().nonempty("Username is required ").min(2).max(50),
    password: z.string().nonempty("Password is required "),
});

const LoginPage = () => {
    // global auth state which stores current logged in user state
    const auth = useAuth();
    const navigate = useNavigate();



    // will be launched when LoginPage components is initialized
    useEffect(() => {
        // if user is logged in we redirect user back where he/she came from or to home page
        if (auth.isLoggedIn) {
            navigate(location.state?.from?.pathname || "/");
        }
    }, []);

    // browser navigation and location helpers
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    // use custom Hook to send request to reduce code repetetiveness
    const { loading, error, sendRequest, clearError } = useHttp();

    // display toast messages library
    const { toast } = useToast();

    // form schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // function which will handle submission of form
    async function onSubmit(values: z.infer<typeof formSchema>) {
        clearError();
        // try and catch blocks to catch any errors from requests to api
        try {
            // make a authentication request to obtain JWT access token using custom Hook
            const responseData = await sendRequest("/api/users/token/", "post", {}, values);

            // loading is done as we received data
            // decode jwt token
            let decoded_data: any = jwt_decode(responseData.access);
            // save access token in user global state as we need it in future
            auth.assignToken(responseData);
            // save user data and login user
            console.log(decoded_data);
            auth.defineRole(decoded_data.role);
            auth.setUserId(decoded_data.user_id);
            auth.assignUsername(decoded_data.username);
            localStorage.setItem('authTokens', JSON.stringify(responseData));
            auth.login();
            // role based redirect
            // if user was redirected to login page from somewhere else, we redirect him back where he was
            // otherwise we redirect user based on user role
            if (from == "/") {
                if (decoded_data.role == 'admin') {
                    navigate('/admin');
                } else if (decoded_data.role == 'driver') {
                    navigate('/driver/personal_page');
                } else if (decoded_data.role == 'fueling') {
                    navigate('/fueling');
                } else if (decoded_data.role == 'maintenance') {
                    navigate('/maintenance');
                } else {
                    navigate('/');
                }
            } else {
                navigate(from);
            }

        } catch (err: any) {
            // process received errors
            toast({
                title: err.message,
                variant: "destructive",
            })
        };
    }

    // display user login form
    return (
        <div className="flex justify-center items-center flex-grow">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl mb-3 font-semibold tracking-tight  text-center">
                    Login to VMS
                </h1>
                <Separator />
                <p className="text-red-500">{error}</p>

                {loading && (
                    <div className="flex justify-center">
                        <span style={{ margin: 0 }} className="absolute inset-0 bg-black z-10 bg-opacity-50">
                        </span>
                        <Spinner
                            className="z-20"
                            size="lg"
                            color="default"
                        />
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-80"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-center w-full font-bold">
                            Login
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or create staff account
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="self-center w-full">
                            Create staff account
                        </Button>
                    </form>
                </Form>
            </div>
        </div >
    );
};

export default LoginPage;
