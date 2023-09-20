import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>();
    const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(async (url: string, method: string = 'GET', headers: any = {}, postValues: any = null) => {
        const controller = new AbortController();
        activeHttpRequests.current.push(controller);
        setLoading(true);

        try {
            const response = await axios({
                method: method.toLowerCase(),
                url: url,
                signal: controller.signal,
                headers: headers,
                data: postValues || {}
            });

            setLoading(false);
            setError('');

            return response.data;
        } catch (err: any) {
            setLoading(false);
            if (err.response) {
                // we got response but its status is not 200
                let errMes = "";
                if (err?.response?.status == 401) {
                    errMes = "Wrong credentials. Try again!";
                } else if (err?.response?.status == 400) {
                    console.log(err)
                    errMes = "Unauthorized access!";

                } else {
                    errMes = "Something went wrong. Try again!";
                }
                setError(errMes)
                throw new Error(errMes);
            } else {
                // we did not get response at all
                setError(err.message)
                throw new Error(err);
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