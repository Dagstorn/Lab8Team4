import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/shad-ui/ui/select';
import { Driver } from '@/shared/types/types'
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyData {
    month: string;
    count: number;
    distance: number; // in meters
    time_spent: number; // in milliseconds
}

interface YearlyData {
    [year: string]: MonthlyData[];
}




const DriverReports = ({ driver }: { driver: Driver }) => {
    // get auth context to access currently logged in user data
    const auth = useAuth();
    // states to store vehicle data 
    const [driverReportData, setDriverReportData] = useState<any>();
    const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());


    // custom hook to make API calls
    const { sendRequest, clearError } = useHttp();

    // function convertMillisecondsToHoursAndMinutes(milliseconds: number): { hours: number, minutes: number } {
    //     // Convert milliseconds to minutes
    //     const totalMinutes = Math.floor(milliseconds / (1000 * 60));

    //     // Calculate hours and remaining minutes
    //     const hours = Math.floor(totalMinutes / 60);
    //     const minutes = totalMinutes % 60;

    //     return { hours, minutes };
    // }


    function convertDistanceAndTime(data: YearlyData): YearlyData {
        const convertedData: YearlyData = {};
        console.log("converting");

        for (const year in data) {
            console.log(year);
            if (data.hasOwnProperty(year) && Array.isArray(data[year])) {
                convertedData[year] = data[year].map((entry: MonthlyData) => {
                    // Convert distance from meters to kilometers
                    const distanceInKm = entry.distance / 1000;

                    // Convert time spent from milliseconds to minutes
                    // const timeSpentInMinutes = Math.floor(entry.time_spent / (1000 * 60));
                    // const timeSpentInHours = +(entry.time_spent / (1000 * 60 * 60)).toFixed(2);
                    const timeSpentInHours = Math.round(entry.time_spent / (1000 * 60 * 60));
                    return {
                        ...entry,
                        distance: distanceInKm,
                        time_spent: timeSpentInHours
                    };
                });
            }
        }

        return convertedData;
    }
    // retrieve data from api
    const getData = async () => {
        // clear error at start to get rid of any not actual previous errors
        clearError();

        // const timeObject = convertMillisecondsToHoursAndMinutes(milliseconds);


        // get data with custom Hook
        const driverReportData = await sendRequest(`/api/drivers/${driver.id}/report_data/`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        });
        if (driverReportData) {
            console.log("default")

            console.log(driverReportData);

            const convertedData = convertDistanceAndTime(driverReportData["completed_tasks"]);
            console.log("converted")
            console.log(JSON.stringify(convertedData, null, 2));

            // set data to response result
            setDriverReportData({
                "completed_tasks": convertedData
            });
        }

    }

    // call getData when driver passed from parent component changes, to always have accurate data
    useEffect(() => {
        if (driver) {
            getData();
        }
    }, [driver]);

    // function to generate items for select component
    const getYearSelectItems = (data: any) => {
        const sortedKeys = Object.keys(data).sort((a: string, b: string) => parseInt(b) - parseInt(a)); // Sort the keys in ascending order

        const yearSelectItems = sortedKeys.map(year => (
            <SelectItem key={year} value={`${year}`}>{year}</SelectItem>
        ));
        return yearSelectItems;
    }

    return (
        <div className='p-2 mt-5'>
            {driver && driverReportData && Object.keys(driverReportData['completed_tasks']).length > 0 && <div className='mt-5 w-100 h-[400px]'>
                <div className='flex justify-center items-center mt-2'>
                    <h1 className=" text-xl font-bold mr-4 text-center">Time spent on tasks per month</h1>
                    <Select onValueChange={(year) => setYearFilter(parseInt(year))}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder={`${new Date().getFullYear()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {getYearSelectItems(driverReportData['completed_tasks'])}
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
                        data={driverReportData['completed_tasks'][yearFilter]}
                    >
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Time spent in hours', angle: -90, position: 'insideLeft', dy: 30 }} />
                        <Tooltip content={(tooltipPayload) => {
                            if (tooltipPayload.active && tooltipPayload.payload && tooltipPayload.payload.length) {
                                return (
                                    <div className="custom-tooltip border bg-white p-4">
                                        <p className="label">
                                            <span className='text-blue-500'>Hours</span> : {tooltipPayload.payload[0].value}<br />
                                            <span className='text-blue-500'>Number of tasks</span> : {tooltipPayload.payload[1].value}


                                        </p>

                                    </div>
                                );
                            }

                            return null;
                        }} />
                        <Bar dataKey="time_spent" fill="#8884d8" width={1} />
                        <Bar dataKey="count" fill="none" width={1} />
                    </BarChart>
                </ResponsiveContainer>

            </div>}
        </div>
    )
}

export default DriverReports