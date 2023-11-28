import { AspectRatio } from "@/shared/shad-ui/ui/aspect-ratio"
import { Badge } from "@/shared/shad-ui/ui/badge"
import { Card, CardContent } from "@/shared/shad-ui/ui/card"
import { AuctionVehicle } from "@/shared/types/types"
import { getVehicleInfo } from "@/shared/utils/utils"

const AuctionVehicleCard = ({ vehicle }: { vehicle: AuctionVehicle }) => {
    console.log(vehicle)
    return (
        <Card className="p-0 rounded-none shadow-md">
            <CardContent className="p-0">
                <div className="flex gap-6">
                    <div className="w-2/6">
                        <AspectRatio ratio={16 / 9}>
                            <img className="w-full h-full object-cover disable-pixeling"
                                src={`${vehicle.image}`} alt="Image" />
                        </AspectRatio>
                    </div>
                    <div className="mt-2 w-4/6">
                        <p className="font-bold ">{vehicle.make} {vehicle.model} {vehicle.year}</p>
                        {getVehicleInfo(vehicle)}
                        <div className="flex">
                            <span className="w-2/6 font-bold">Condition:</span>
                            <span><Badge>{vehicle.condition}</Badge></span>
                        </div>
                        <div className="flex">
                            <span className="w-2/6 font-bold">Additional info:</span>
                            <span>{vehicle.additional_information}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AuctionVehicleCard