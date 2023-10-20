import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/shad-ui/ui/button";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { Driver } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { Check, Download, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DriverReports from "../components/DriverReports";
import { usePDF } from 'react-to-pdf';
import generatePDF, { Margin } from 'react-to-pdf';

const DriverDetailPage = () => {
    const driverID = useParams().driverID;
    const auth = useAuth();
    const { targetRef } = usePDF({ filename: 'page.pdf' });

    const [driver, setDriver] = useState<Driver>();
    const { loading, sendRequest } = useHttp();
    const { toast } = useToast();

    const getDriver = async () => {
        if (driverID) {
            try {
                const driverData = await sendRequest(`/api/drivers/${driverID}/`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
                setDriver(driverData);
            } catch (err: any) {
                // show error toast message if any
                toast({
                    title: err.message,
                    variant: "destructive",
                })
            }
        }
    }
    useEffect(() => {
        getDriver();
    }, [driverID])

    const getFileName = (driver: Driver) => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return `Report_on_${driver.name}_${driver.surname}_${formattedDate}.pdf`;
    }

    const constructPDF = async (driver: Driver) => {
        const pdfBlob = await generatePDF(targetRef, { filename: getFileName(driver), page: { margin: Margin.MEDIUM } })
        const bl = pdfBlob.output("blob")
        const formData = new FormData();
        formData.append('pdfFile', bl, `${getFileName(driver)}.pdf`);

        try {
            await sendRequest(`/api/drivers/${driver.id}/report_data/savePDF`, 'post', {
                Authorization: `Bearer ${auth.tokens.access}`,
                'Content-Type': 'multipart/form-data',
            }, formData);
            toast({ title: `Report downloaded and saved ✓` })
        } catch (err: any) {
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
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
                            <label className="col-span-1" htmlFor="">Email</label>
                            <span className="col-span-3">{driver.email}</span>
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


                    </div>

                </div >}
                <Separator />
                {driver && <DriverReports driver={driver} />}
            </div>

        </>
    );
};

export default DriverDetailPage;
