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
interface Driver {
  id: number;
  goverment_id: String;
  department: String;
  name: String;
  surname: String;
  middle_name: String;
  address: String;
  phone: String;
  email: String;
  license_code: String;
  password: String;
}
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from '@/shared/hooks/axios';
import useAuth from "@/shared/hooks/useAuth";
const DriversListPage = () => {
  const auth = useAuth();

  // state which stores drivers list
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState("");
  // when conponent mounts - meaning when it is created we get data
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let tokensObj: any = auth.tokens;
    let accessToken: any = tokensObj.access;
    const getDrivers = async () => {
      try {
        const response = await axios.get('/api/drivers', {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        if (response.status === 200) {
          isMounted && setDrivers(response.data);
          setError('');
        }
      } catch (err: any) {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 400) {
          setError("Log out and Login again! Your credentials are outdated...")
          auth.logout();
        } else {
          setError("Unable to fetch data from server. Try again!");
        }
      }
    }


    getDrivers();
    // comnponent unmounts
    return () => {
      isMounted = false;
      // abort any request because component is removed from page
      controller.abort();
    }
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Drivers list</h1>
        <Link to="/admin/drivers/add"><Button variant='default'>Add driver</Button></Link>
      </div>

      <Separator />
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
            drivers.map((driver) => {
              return <TableRow key={driver.id}>
                <TableCell className="font-medium">
                  {driver.name} {driver.middle_name} {driver.surname}
                </TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/drivers/${driver.id}/detail`}><Button variant="outline">View details</Button></Link>
                </TableCell>
              </TableRow>
            })
          }

        </TableBody>
      </Table>
      {error.length > 0 ? <span>{error}</span> : null}

    </>
  );
};

export default DriversListPage;
