import { Button } from "@/shared/shad-ui/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Driver } from "@/shared/types/types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import DriverDetailRow from "../components/DriverDetailRow";
const DriversListPage = () => {
  const auth = useAuth();

  // state which stores drivers list
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const { loading, error, sendRequest, clearError } = useHttp();
  const { toast } = useToast();


  // when conponent mounts - meaning when it is created we get data
  useEffect(() => {
    // clear error at start to get rid of any not actual previous errors
    clearError();
    // retrieve data from api
    const getData = async () => {
      // try and catch to catch errors if any
      try {
        // get data with custom Hook
        const responseData = await sendRequest('/api/drivers', 'get', {
          Authorization: `Bearer ${auth.tokens.access}`
        })
        // set data to response result
        setDrivers(responseData)
      } catch (err: any) {
        // show error toast message
        toast({
          title: err.message,
          variant: "destructive",
        })
      }
    }
    getData();
  }, []);

  const removeDriverFromList = (driverId: number) => {
    const updatedDrivers = drivers.filter(driver => driver.id !== driverId);
    setDrivers(updatedDrivers);
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Drivers list</h1>
        <Link to="/admin/drivers/add"><Button variant='default'>Add driver</Button></Link>
      </div>

      <Separator />
      {loading && <div className="flex justify-center mt-4">
        <Spinner></Spinner>
      </div>}
      {!loading && <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            drivers.map((driver) => <DriverDetailRow driver={driver} removeDriverFromList={removeDriverFromList} />)
          }

        </TableBody>
      </Table>}
      {error ? <span>{error}</span> : null}

    </>
  );
};

export default DriversListPage;
