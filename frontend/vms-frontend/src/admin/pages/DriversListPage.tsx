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
import { Driver, PaginatorObj } from "@/shared/types/types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import { useHttp } from "@/shared/hooks/http-hook";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import DriverDetailRow from "../components/DriverDetailRow";
import Paginator from "../components/Paginator";
import FadeTransition from "../components/FadeTransition";

const DriversListPage = () => {
  // auth context to get currently logged in user data
  const auth = useAuth();
  // state which stores drivers list
  const [drivers, setDrivers] = useState<Driver[]>([]);
  // paginator object stores data related to pagination like count, next page, prev page and page size
  const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
  // custom http hook to make api calls
  const { loading, error, sendRequest, clearError } = useHttp();
  // toast librar to show toast messages
  const { toast } = useToast();
  // function to retrieve data from api
  const getData = async (page: number) => {
    // try and catch to catch errors if any
    try {
      // get data from api with custom Hook
      const responseData = await sendRequest(`/api/drivers/paginated/?page=${page}`, 'get', {
        Authorization: `Bearer ${auth.tokens.access}`
      })

      // set data to response result
      setDrivers(responseData.results);
      if (paginationObj) {
        const updatedObj = {
          ...paginationObj,
          count: responseData.count,
          next: responseData.next,
          previous: responseData.previous
        }
        setPaginationObj(updatedObj);
      } else {
        setPaginationObj({
          count: responseData.count,
          page_size: Math.ceil(responseData.count / responseData.results.length),
          next: responseData.next,
          previous: responseData.previous
        })
      }
    } catch (err: any) {
      // show error toast message
      console.log(err)
      toast({ title: err.message, variant: "destructive" })
    }
  }
  // when conponent mounts - meaning when it is initialized we call get data function
  useEffect(() => {
    // clear error at start to get rid of any previous errors
    clearError();
    getData(1);
  }, []);
  // function to remove a driver from list of current drivers
  // used when deleting driver, because even if we make api call to delete driver from Database, driver still be present on page before the next refresh of the page
  // therefore, in that case we need to manually delete it from current state in order to have consistent data on page
  const removeDriverFromList = (driverId: number) => {
    // fitler out driver
    const updatedDrivers = drivers.filter(driver => driver.id !== driverId);
    // update state
    setDrivers(updatedDrivers);
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold mb-4">Drivers list</h1>
          {loading && <div className="">
            <Spinner></Spinner>
          </div>}
        </div>

        <Link to="/admin/drivers/add"><Button variant='default'>Add driver</Button></Link>
      </div>
      <Separator />

      <FadeTransition show={drivers.length > 0}>
        <Table>
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
              drivers.map((driver) => (
                <DriverDetailRow key={driver.id} driver={driver} removeDriverFromList={removeDriverFromList} />
              ))
            }
          </TableBody>
        </Table>
        {paginationObj && <Paginator getData={getData} paginatorData={paginationObj} />}

      </FadeTransition>



      {error ? <span className="text-red-400">Error: {error}</span> : null}
    </>
  );
};

export default DriversListPage;
