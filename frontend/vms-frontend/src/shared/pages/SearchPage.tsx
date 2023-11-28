import { useState } from "react";
import { Button } from "../shad-ui/ui/button";
import { useHttp } from "../hooks/http-hook";
import { Spinner } from "@nextui-org/react";
import { Driver, FuelingPerson, MaintenancePerson } from "../types/types";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fueling, setFueling] = useState<FuelingPerson[]>();
  const [maintenance, setMaintenance] = useState<MaintenancePerson[]>();
  const [drivers, setDrivers] = useState<Driver[]>();
  const { loading, sendRequest } = useHttp();

  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      return;
    }
    const responseData = await sendRequest(`/api/gsearch/?query=${searchQuery}/`, 'get');

    if (responseData) {
      setFueling(responseData["fueling"]);
      setMaintenance(responseData["maintenance"]);
      setDrivers(responseData["drivers"]);
      console.log(responseData);
    }
  };

  return (
    <div className="h-full w-full flex justify-center">
      <div className="w-full p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center">Search Page</h2>

        {/* Search Input */}
        <div className="grid grid-cols-6 gap-2">

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 col-span-5 px-3 py-2 mb-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <Button className="col-span-1" variant="default" onClick={handleSearch}>Search</Button>

        </div>
        {loading && <div className="w-full flex justify-center">
          <Spinner></Spinner>
        </div>}

        {drivers && drivers.length > 0 && <div className="list-disc pl-0">
          <h1>Drivers</h1>
          {drivers.map(driver => <div className="bg-gray-100 p-4 my-2 rounded-md text-gray-800 w-full">
            {driver.name} {driver.surname} - {driver.email}<br />{driver.phone}<br />Department: {driver.department}
          </div>)}
        </div>}

        {maintenance && maintenance.length > 0 && <div className="list-disc pl-0">
          <h1>Maintenance staff</h1>

          {maintenance.map(maintenanceP => <div className="bg-gray-100 p-4 my-2 rounded-md text-gray-800 w-full">
            {maintenanceP.name} {maintenanceP.surname} - {maintenanceP.email}<br />{maintenanceP.phone}
          </div>)}
        </div>}

        {fueling && fueling.length > 0 && <div className="list-disc pl-0">
          <h1>Fueling staff</h1>

          {fueling.map(fuelingP => <div className="bg-gray-100 p-4 my-2 rounded-md text-gray-800 w-full">
            {fuelingP.name} {fuelingP.surname} - {fuelingP.email}<br />{fuelingP.phone}
          </div>)}
        </div>}

        {drivers?.length === 0 && fueling?.length === 0 && maintenance?.length === 0 && <div className="list-disc pl-0">
          <div className="bg-gray-100 p-4 my-2 rounded-md text-gray-800 w-full">No results</div>
        </div>}




      </div>
    </div>
  )
}

export default SearchPage