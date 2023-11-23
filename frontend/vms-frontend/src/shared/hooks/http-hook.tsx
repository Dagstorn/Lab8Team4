import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "../shad-ui/ui/use-toast";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const activeHttpRequests = useRef<AbortController[]>([]);
    const { toast } = useToast();

    const sendRequest = useCallback(async (url: string, method: string = 'GET', headers: any = {}, postValues: any = null) => {
        const controller = new AbortController();
        activeHttpRequests.current.push(controller);
        setLoading(true);
        // const finalUrl = 'https://vmslab.online' + url;
        const finalUrl = url;

        try {

            const response = await axios({
                method: method.toLowerCase(),
                url: finalUrl,
                signal: controller.signal,
                headers: headers,
                data: postValues || {}
            });

            setLoading(false);
            setError('');
            return response.data;
        } catch (err: any) {
            setLoading(false);
            let errMes = "";
            if (err.code !== 'ERR_CANCELED') {
                if (err.response) {
                    // we got response but its status is not 200
                    if (err?.response?.status == 401) {
                        errMes = "Access denied! Check your credentials!";
                    } else if (err?.response?.status == 400) {
                        errMes = "Oops! Something's not quite right with your request. Please check that you've filled in all the necessary information(if any) and try again!";
                    } else if (err?.response?.status == 403) {
                        errMes = "Sorry, you don't have permission to view this page. If you believe this is an error, please contact our support team for assistance";
                    } else if (err?.response?.status == 405) {
                        errMes = "This action is not allowed here. Please make sure you're using the right method or check with the site administrator for help.";
                    } else {
                        errMes = "Something went wrong. Try again!";
                    }
                    setError(errMes)
                } else {
                    // we did not get response at all
                    errMes = err.message
                    setError(errMes)
                }
                toast({ title: errMes, variant: "destructive" })

            }

        }
    }, []);

    const clearError = () => {
        setError(null);
    }
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])
    return { loading, error, sendRequest, clearError };
}