import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator';
import { useToast } from '@/shared/shad-ui/ui/use-toast';
import { Vehicle } from '@/shared/types/types';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@nextui-org/react';
import { Button } from '@/shared/shad-ui/ui/button';
import { Download } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/shad-ui/ui/select';
import { CardHeader, Card, CardContent } from '@/shared/shad-ui/ui/card';
import { getVehicleInfo } from '@/shared/utils/utils';
import { usePDF } from 'react-to-pdf';
import generatePDF, { Margin } from 'react-to-pdf';

const VehicleReport = () => {
    // get vehicle id from url using useParams hook from react
    const vehicleId = useParams().vid;
    // get auth context to access currently logged in user data
    const auth = useAuth();
    const { targetRef } = usePDF({ filename: 'page.pdf' });
    // states to store vehicle data 
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [vehicleReportData, setVehicleReportData] = useState<any>();
    const [fuelingYearFilter, setFuelingYearFilter] = useState<number>(new Date().getFullYear());
    const [maintenanceYearFilter, setMaintenanceYearFilter] = useState<number>(new Date().getFullYear());
    const [usageNumberYearFilter, setUsageNumberYearFilter] = useState<number>(new Date().getFullYear());
    const [usageDistanceYearFilter, setUsageDistanceYearFilter] = useState<number>(new Date().getFullYear());
    const [numberOfUsages, setNumberOfUsages] = useState<number>(0);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    // custom hook to make API calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // library to show toast messagess
    const { toast } = useToast();

    // retrieve data from api
    const getData = async () => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const [vehicleData, reportData] = await Promise.all([
                sendRequest(`/api/vehicles/${vehicleId}/`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                }),
                sendRequest(`/api/vehicles/${vehicleId}/report_data`, 'get', {
                    Authorization: `Bearer ${auth.tokens.access}`
                })
            ]);
            // set data to response result
            setVehicle(vehicleData);
            let totalDist = 0;
            let totalUsages = 0;
            Object.keys(reportData['usage']).forEach((year) => {
                const new_arr = reportData['usage'][year].map((obj: any) => ({
                    ...obj,
                    distance: obj.distance / 1000
                }))
                reportData['usage'][year] = new_arr;
                reportData['usage'][year].forEach((obj: any) => {
                    totalUsages += obj.count;
                    totalDist += obj.distance;
                })
            })
            setNumberOfUsages(totalUsages);
            setTotalDistance(totalDist);
            setVehicleReportData(reportData);
        } catch (err: any) {
            console.log(err)
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
    }




    // call getData when vehicleId from url changes to always have accurate data
    useEffect(() => {
        if (vehicleId) {
            getData();
        }
    }, [vehicleId]);


    const getYearSelectItems = (data: any) => {
        const sortedKeys = Object.keys(data).sort((a: string, b: string) => parseInt(b) - parseInt(a)); // Sort the keys in ascending order

        const yearSelectItems = sortedKeys.map(year => (
            <SelectItem value={`${year}`}>{year}</SelectItem>
        ));
        return yearSelectItems;
    }
    const CustomTooltip = (tooltipPayload: any) => {
        if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
            return (
                <div className="custom-tooltip border bg-white p-4">
                    <p className="label">
                        <span className='text-blue-500'>{`Cost in ${tooltipPayload.label}`}</span> : {tooltipPayload.payload[0].value} KZT</p>
                    <p className="label">Number of maintenances in {`${tooltipPayload.label} : ${tooltipPayload.payload[1].value}`}</p>
                </div>
            );
        }

        return null;
    };
    const getFileName = (vehicle: Vehicle) => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return `Report_on_${vehicle.make}_${vehicle.model}_${formattedDate}.pdf`;
    }
    const constructPDF = async (vehicle: Vehicle) => {
        const pdfBlob = await generatePDF(targetRef, { filename: getFileName(vehicle), page: { margin: Margin.LARGE } })
        const bl = pdfBlob.output("blob")
        const formData = new FormData();
        formData.append('pdfFile', bl, 'my-document.pdf');
        try {
            console.log("firing api call =-==-=-=-=-=-=-");

            const resp = await sendRequest(`/api/vehicles/${vehicleId}/report_data/savePDF`, 'post', {
                Authorization: `Bearer ${auth.tokens.access}`,
                'Content-Type': 'multipart/form-data',
            }, formData);

            console.log(resp);
        } catch (err: any) {
            console.log(err)
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
        return pdfBlob;
    }
    return (
        <div>
            {loading && <Spinner />}
            {!loading && vehicle && <div className='w-full h-full flex flex-col'>
                <div className='flex justify-between items-center mb-2'>
                    <h1 className="text-2xl font-bold mr-4">Vehicle Report</h1>
                    <Button onClick={() => constructPDF(vehicle)}><Download className='w-4 mr-2' />Save as PDF</Button>
                </div>

                <Separator />
                {error ? <div className="flex justify-center">
                    <span className="text-red-500 justify-self-center">{error}</span>
                </div> : null}

                <div ref={targetRef}>
                    {vehicle && vehicleReportData && <div className='mt-6 p-4'>
                        <Card>
                            <CardHeader className='mb-0 pb-2'>
                                <h1 className='mb-2 font-bold text-xl'>{`Report on ${vehicle.make} ${vehicle.model} ${vehicle.year}`}</h1>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                {getVehicleInfo(vehicle)}
                                <div className="flex">
                                    <span className="w-2/6 font-bold mr-2">Total number of usages:</span>
                                    <span>{numberOfUsages}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-2/6 font-bold mr-2">Total distance covered:</span>
                                    <span>{totalDistance} km</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>}

                    {vehicleReportData && Object.keys(vehicleReportData['fueling']).length > 0 && <div className='mt-5 w-100 h-[400px]'>
                        <div className='flex justify-center items-center mt-2'>
                            <h1 className=" text-xl font-bold mr-4 text-center">Fueling Report</h1>
                            <Select onValueChange={(year) => setFuelingYearFilter(parseInt(year))}>
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder={`${new Date().getFullYear()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>

                                        {getYearSelectItems(vehicleReportData['fueling'])}
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
                                data={vehicleReportData['fueling'][fuelingYearFilter]}
                            >
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Fuel amount in liters', angle: -90, position: 'insideLeft', dy: 30 }} />
                                <Tooltip content={(tooltipPayload) => {
                                    if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
                                        return (
                                            <div className="custom-tooltip border bg-white p-4">
                                                <p className="label">
                                                    <span className='text-blue-500'>{`Fuel amount in ${tooltipPayload.label}`}</span> : {tooltipPayload.payload[0].value} liters</p>

                                            </div>
                                        );
                                    }

                                    return null;
                                }} />
                                <Bar dataKey="amount" fill="#8884d8" width={1} />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>}

                    {vehicleReportData && Object.keys(vehicleReportData['maintenance']).length > 0 && <div className='w-100 h-[400px]'>
                        <div className='flex justify-center items-center mt-2'>
                            <h1 className=" text-xl font-bold mr-4 text-center">Maintenance Report</h1>
                            <Select onValueChange={(year) => setMaintenanceYearFilter(parseInt(year))}>
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder={`${new Date().getFullYear()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {getYearSelectItems(vehicleReportData['maintenance'])}
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
                                data={vehicleReportData['maintenance'][maintenanceYearFilter]}
                            >
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Cost in KZT', angle: -90, position: 'insideLeft', dx: -15, dy: 30 }} />

                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="cost" fill="#8884d8" width={1} />
                                <Bar dataKey="count" fill="none" width={1} />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>}

                    {vehicleReportData && Object.keys(vehicleReportData['maintenance']).length > 0 && <div className='w-100 h-[400px]'>
                        <div className='flex justify-center items-center mt-2'>
                            <h1 className=" text-xl font-bold mr-4 text-center">Number of usages per months</h1>
                            <Select onValueChange={(year) => setUsageNumberYearFilter(parseInt(year))}>
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder={`${new Date().getFullYear()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {getYearSelectItems(vehicleReportData['usage'])}
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
                                data={vehicleReportData['usage'][usageNumberYearFilter]}
                            >
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Number', angle: -90, position: 'insideLeft', dx: 0, dy: 30 }} />

                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" width={1} />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>}

                    {vehicleReportData && Object.keys(vehicleReportData['maintenance']).length > 0 && <div className='mt-6 w-100 h-[400px]'>
                        <div className='flex justify-center items-center mt-2'>
                            <h1 className=" text-xl font-bold mr-4 text-center">Distance covered per months</h1>
                            <Select onValueChange={(year) => setUsageDistanceYearFilter(parseInt(year))}>
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder={`${new Date().getFullYear()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {getYearSelectItems(vehicleReportData['usage'])}
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
                                data={vehicleReportData['usage'][usageDistanceYearFilter]}
                            >
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Distance in km', angle: -90, position: 'insideLeft', dx: 0, dy: 30 }} />

                                <Tooltip content={(tooltipPayload) => {
                                    if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
                                        return (
                                            <div className="custom-tooltip border bg-white p-4">
                                                <p className="label">
                                                    <span className='text-blue-500'>{`Distance covered in ${tooltipPayload.label}`}</span> : {tooltipPayload.payload[0].value} km</p>

                                            </div>
                                        );
                                    }

                                    return null;
                                }} />
                                <Bar dataKey="distance" fill="#8884d8" width={1} />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>}
                </div>



            </div>}
        </div>

    )
}

export default VehicleReport
