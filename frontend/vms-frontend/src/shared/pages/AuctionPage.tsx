import { useHttp } from "@/shared/hooks/http-hook";
import { Separator } from "@/shared/shad-ui/ui/separator"
import { AuctionVehicle } from "@/shared/types/types";
import { useEffect, useState } from "react";
import FadeTransition from "@/admin/components/FadeTransition";
import AuctionVehicleCard from "@/admin/components/AuctionVehicleCard";

const Auction = () => {
    // custom HTTP hook to make  API calls
    const { sendRequest } = useHttp();
    // state to store auction vehicles list
    const [vehicles, setVehicles] = useState<AuctionVehicle[]>([]);
    // fetch data on page load
    useEffect(() => {
        const getData = async () => {
            const response = await sendRequest(`/api/auction/vehicles/`, 'get')
            if (response) {
                setVehicles(response);
            }
        }
        getData();
    }, [])

    return (
        <>
            <FadeTransition show={vehicles.length > 0}>

                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">Auction Vehicles </h1>
                </div>
                <Separator></Separator>
                {vehicles && <div className="grid gap-6 mt-5">
                    {vehicles.map((vehicle) => <AuctionVehicleCard key={vehicle.id} vehicle={vehicle} />)}
                </div>}
            </FadeTransition>

        </>
    )
}

export default Auction