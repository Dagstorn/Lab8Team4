import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Driver } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Download, Eye, EyeOff, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DriverReports from "../../components/DriverReports";
import { usePDF } from 'react-to-pdf';
import generatePDF, { Margin } from 'react-to-pdf';
import { useStateWithCallbackLazy } from 'use-state-with-callback';

const DriverDetailPage = () => {
    // getting driver id parameter from url
    const driverID = useParams().driverID;
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // bind react ref to usePDF hook to generate PDF using part of the page referenced by targetRef
    const { targetRef } = usePDF({ filename: 'page.pdf' });
    // state for driver data
    const [driver, setDriver] = useState<Driver>();
    // state for boolean variable responsible for showing/hiding password value
    const [showPassword, setShowPassword] = useStateWithCallbackLazy(false);
    // custom HTTP hook to make  API calls
    const { loading, sendRequest } = useHttp();
    // toast library to show toast messages like notifications
    const { toast } = useToast();

    // function to retrieve driver data from backend api
    const getDriver = async () => {
        if (driverID) {
            // api call 
            const driverData = await sendRequest(`/api/drivers/${driverID}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (driverData) {
                console.log(driverData);
                // save data in components state
                setDriver(driverData);
            }
        }
    }
    // useEffect will call getDriver function everytime driverID is updated
    // this ensures that for every id change in url parameters we get accurate data
    useEffect(() => {
        getDriver();
    }, [driverID])

    // function to create proper file name for pdf
    const getFileName = (driver: Driver) => {
        // get current date
        const date = new Date();
        // get day, month and year from date we created
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        // concatenate date parts together
        const formattedDate = `${day}-${month}-${year}`;
        // return formatted file name
        return `Report_on_${driver.name}_${driver.surname}_${formattedDate}.pdf`;
    }

    // function to construct pdf file and send it to backend
    const constructPDF = async (driver: Driver) => {
        console.log("making pdf");
        // get blob from generatePDF function which will give access to pdf file created from targetRef
        const pdfBlob = await generatePDF(targetRef, { filename: getFileName(driver), page: { margin: Margin.MEDIUM } })
        // actual blob file
        const bl = pdfBlob.output("blob")
        // create form data and attach our pdf blob file
        const formData = new FormData();
        formData.append('pdfFile', bl, `${getFileName(driver)}.pdf`);
        // make api call and send file to backend 
        console.log("sending pdf");

        const response = await sendRequest(`/api/drivers/${driver.id}/report_data/savePDF/`, 'post', {
            Authorization: `Bearer ${auth.tokens.access}`,
            'Content-Type': 'multipart/form-data',
        }, formData);
        console.log("sent pdf");

        if (response) {
            toast({ title: `Report downloaded and saved ✓` })
        }

        return pdfBlob;
    }

    return (
        <>
            {driver && <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold mr-4">Driver details</h1>
                <Link className="mr-4" to={`/admin/drivers/${driverID}/edit/`}><Button variant="secondary"><Pencil className="w-4 mr-1" /> Edit driver data</Button></Link>
                <Button onClick={() => constructPDF(driver)}><Download className='w-4 mr-2' />Save as PDF</Button>
            </div>}
            <Separator />
            <div ref={targetRef}>
                <h1 className="text-2xl font-bold mr-4 mt-4 text-center">Driver report</h1>

                {loading && <div className="p-4 w-full flex justify-center"><Spinner /></div>}
                {driver && < div className="grid grid-cols-3 mt-4 mb-4">
                    <div className="xl:col-span-2 sm:col-span-3">
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">First name</label>
                            <span className="col-span-3">{driver.name}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Last name</label>
                            <span className="col-span-3">{driver.surname}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Middle name</label>
                            <span className="col-span-3">{driver.middle_name}</span>
                        </div>

                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Goverment ID</label>
                            <span className="col-span-3">{driver.goverment_id}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Address</label>
                            <span className="col-span-3">{driver.address}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Phone</label>
                            <span className="col-span-3">{driver.phone}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Department</label>
                            <span className="col-span-3">{driver.department}</span>
                        </div>
                        <div className="mb-1 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Driver License code</label>
                            <span className="col-span-3">{driver.license_code}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{driver.email}</span>
                        </div>
                        <div className="mb-2 grid grid-cols-4">
                            <label className="col-span-1" htmlFor="">Password</label>
                            <span className="col-span-3">{
                                showPassword ? (
                                    <div className="flex items-center">
                                        {driver.password}
                                        <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal, () => { return })}><EyeOff className="mr-1" /> Hide</Button>
                                    </div>
                                ) : <div className="flex items-center">
                                    •••••••••••
                                    <Button variant="link" onClick={() => setShowPassword((oldVal) => !oldVal, () => { return })}><Eye className="mr-1" /> Show</Button>
                                </div>
                            }</span>
                        </div>
                    </div>
                </div >}
                <Separator />
                {driver && <DriverReports driver={driver} />}
            </div>

        </>
    );
};

export default DriverDetailPage;
