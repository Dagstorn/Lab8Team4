import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/shad-ui/ui/select";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import { FuelingReport, Vehicle } from "@/shared/types/types";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// defining type of Props that this component accepts
interface Props {
    vehicleId: number
}
// defining type of each element in data array for representing a graph
interface fuelingGraphDataElement {
    date: string;
    amount: number;
}
const FuelingGraph = ({ vehicleId }: Props) => {
    // get auth context to access currently logged in user data
    const auth = useAuth();
    // states to store data 
    const [fuelingReports, setFuelingReports] = useState<FuelingReport[]>([]);
    const [fuelingReportsGraphData, setFuelingReportsGraphData] = useState<fuelingGraphDataElement[]>([]);
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
            const fuelingReportsData = await sendRequest(`/api/vehicles/${vehicleId}/fueling`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            // set data to response result
            setFuelingReports(fuelingReportsData);
            // draw graph with current year
            drawFuelingGraph(fuelingReportsData, new Date().getFullYear());
        } catch (err: any) {
            console.log(err)
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
    }

    // function to get list of years from data
    const getYears = (reports: FuelingReport[]) => {
        // set which will contain unique years
        const uniqueYearsSet = new Set<number>();
        // map thorugh fueling records data and storing only unique years
        const uniqueYearsArr = reports.map((report) => {
            // getting year
            const year = new Date(report.date).getFullYear();
            if (!uniqueYearsSet.has(year)) {
                uniqueYearsSet.add(year);
                return year;
            }
            // null will be placed in place of not unique elements
            return null;
        }).filter((year) => year !== null); // remove null values
        return uniqueYearsArr;
    }

    // function to draw fueling reports graph
    const drawFuelingGraph = (fuelingReportsData: FuelingReport[], year: number) => {
        // object/hashmap which will store month and fuel amount
        const fuelingGraphData: Record<string, number> = {};
        // map through fueling records data and store month and fuel amount
        const rawData = fuelingReportsData.map((report: FuelingReport) => {
            // get date
            const date = new Date(report.date);

            // include only records from specified year
            // year is specified by being passed to function as second argument
            if (date.getFullYear() === year) {
                // get month
                const month = date.toLocaleString('en-US', { month: 'short' });
                // return month and fuel amount
                return { date: month, amount: parseInt(report.amount) }
            } else {
                // null will be placed in place of years that dont match with provided year
                return null;
            }
        }).filter((item) => item !== null); // remove null values
        console.log(rawData)
        // combine data from same mongth into one
        // before we could have had: [{'oct': 35, 'sep': 20, 'oct': 10}]
        // and we want to joint the data for october and other same month to properly represnet on a graph
        rawData.forEach((report: any) => {
            if (fuelingGraphData.hasOwnProperty(report.date)) {
                fuelingGraphData[report.date] = fuelingGraphData[report.date] + parseInt(report.amount);
            } else {
                fuelingGraphData[report.date] = parseInt(report.amount);
            }
        });
        // break fuelingGraphData into array, where each element is fuelingGraphDataElement
        const dataArray = Object.keys(fuelingGraphData).map((key) => ({
            date: key,
            amount: fuelingGraphData[key],
        }));
        // define order of months
        const monthOrder: Record<string, number> = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        // sort data based on months
        dataArray.sort((a, b) => monthOrder[a.date] - monthOrder[b.date]);
        // save the data in component state
        setFuelingReportsGraphData(dataArray);
    }

    // call getData when vehicleId changes to always have accurate data
    useEffect(() => {
        if (vehicleId) {
            getData();
        }
    }, [vehicleId]);

    return (
        <div className='bg-gray-100 w-full h-[350px] mt-4'>
            <div className='flex justify-center items-center mt-2'>
                <h1 className=" text-xl font-bold mr-4 text-center">Fueling Reports</h1>
                <Select onValueChange={(year) => drawFuelingGraph(fuelingReports, parseInt(year))}>
                    <SelectTrigger className="w-auto">
                        <SelectValue placeholder={`${new Date().getFullYear()}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {getYears(fuelingReports).map((year) => (
                                <SelectItem value={`${year}`}>{year}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {error ? <div className="flex justify-center">
                <span className="text-red-500 justify-self-center">{error}</span>
            </div> : null}
            {loading ? <Spinner /> : <ResponsiveContainer width="100%" height="80%">
                <BarChart width={500} height={300} barSize={20} margin={{ top: 15, right: 50, bottom: 5, left: 0 }}
                    data={fuelingReportsGraphData}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8884d8" width={1} />
                </BarChart>
            </ResponsiveContainer>}
        </div>
    )
}

export default FuelingGraph