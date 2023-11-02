import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/shad-ui/ui/select";
import { Separator } from "@/shared/shad-ui/ui/separator"
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePDF } from 'react-to-pdf';
import generatePDF, { Margin } from 'react-to-pdf';
import { Button } from "@/shared/shad-ui/ui/button";
import { Download } from "lucide-react";

const Reports = () => {
    // get auth context to access currently logged in user data
    const auth = useAuth();
    // state to store report object we get from backend
    const [reportData, setReportData] = useState<any>();
    // initialize reference using usePDF to generate pdf file on specific component 
    const { targetRef } = usePDF({ filename: 'page.pdf' });
    // states to store filters
    const [fuelingYearFilter, setFuelingYearFilter] = useState<number>(new Date().getFullYear());
    const [maintenanceYearFilter, setMaintenanceYearFilter] = useState<number>(new Date().getFullYear());
    // custom hook to make API calls
    const { error, sendRequest, clearError } = useHttp();
    // library to show toast messagess
    const { toast } = useToast();

    // retrieve data from api
    const getData = async () => {
        // clear error at start to get rid of any not actual previous errors
        clearError();

        // get data with custom Hook
        const response = await sendRequest('/api/reports/', 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        });
        if (response) {
            // set data to response result
            setReportData(response);
        }

    }

    // call getData when component is loaded
    useEffect(() => {
        getData();
    }, []);

    // function to generate items for select component
    const getYearSelectItems = (data: any) => {
        const sortedKeys = Object.keys(data).sort((a: string, b: string) => parseInt(b) - parseInt(a)); // Sort the keys in ascending order

        const yearSelectItems = sortedKeys.map(year => (
            <SelectItem key={year} value={`${year}`}>{year}</SelectItem>
        ));
        return yearSelectItems;
    }
    // function to create PDF filename based on current date
    const getFileName = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return `Report_on_${formattedDate}.pdf`;
    }
    // function to generate pdf
    const constructPDF = async () => {
        const pdfBlob = await generatePDF(targetRef, { filename: getFileName(), page: { margin: Margin.LARGE } })

        if (error) {
            toast({ title: "Report was not saved! Try again" })
        }
        return pdfBlob;
    }
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Reports</h1>
                <Button onClick={() => constructPDF()}><Download className='w-4 mr-2' />Save as PDF</Button>
            </div>


            <Separator />
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}

            <div ref={targetRef}>
                {reportData && Object.keys(reportData['fueling']).length > 0 && <div className='mt-5 w-100 h-[400px]'
                >
                    <div className='flex justify-center items-center mt-2'>
                        <h1 className=" text-xl font-bold mr-4 text-center">Fueling in</h1>
                        <Select onValueChange={(year) => setFuelingYearFilter(parseInt(year))}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder={`${new Date().getFullYear()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {getYearSelectItems(reportData['fueling'])}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                            width={500}
                            height={300}
                            barSize={20}
                            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                            data={reportData['fueling'][fuelingYearFilter]}
                        >
                            <XAxis dataKey="month" />
                            <YAxis label={{ value: 'Fuel cost in KZT', angle: -90, position: 'insideLeft', dx: -15, dy: 30 }} />
                            <Tooltip content={(tooltipPayload) => {
                                if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
                                    return (

                                        <div className="custom-tooltip border bg-white p-4">
                                            <p className="label">
                                                <span className='text-blue-500'>{`Cost in ${tooltipPayload.label}`}</span> : {tooltipPayload.payload[0].value} KZT</p>
                                            <p className="label">Fuel amount in {`${tooltipPayload.label} : ${tooltipPayload.payload[1].value} liters`}</p>
                                        </div>
                                    );
                                }

                                return null;
                            }} />
                            <Bar dataKey="cost" fill="#8884d8" width={1} />
                            <Bar dataKey="amount" fill="none" width={2} />

                        </BarChart>
                    </ResponsiveContainer>


                </div>}
                {reportData && Object.keys(reportData['maintenance']).length > 0 && <div className='mt-5 w-100 h-[400px]'
                >
                    <div className='flex justify-center items-center mt-2'>
                        <h1 className=" text-xl font-bold mr-4 text-center">Maintenace in</h1>
                        <Select onValueChange={(year) => setMaintenanceYearFilter(parseInt(year))}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder={`${new Date().getFullYear()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {getYearSelectItems(reportData['maintenance'])}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                            width={500}
                            height={300}
                            barSize={20}
                            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                            data={reportData['maintenance'][maintenanceYearFilter]}
                        >
                            <XAxis dataKey="month" />
                            <YAxis label={{ value: 'Maintenance cost in KZT', angle: -90, position: 'insideLeft', dx: -15, dy: 60 }} />
                            <Tooltip content={(tooltipPayload) => {
                                if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
                                    return (

                                        <div className="custom-tooltip border bg-white p-4">
                                            <p className="label">
                                                <span className='text-blue-500'>{`Cost in ${tooltipPayload.label}`}</span> : {tooltipPayload.payload[0].value} KZT</p>
                                            <p className="label"> {`Number of maintenances in ${tooltipPayload.label} : ${tooltipPayload.payload[1].value}`}</p>
                                        </div>
                                    );
                                }

                                return null;
                            }} />
                            <Bar dataKey="cost" fill="#8884d8" width={1} />
                            <Bar dataKey="count" fill="none" width={2} />

                        </BarChart>
                    </ResponsiveContainer>


                </div>}
            </div>

        </>
    )
}

export default Reports