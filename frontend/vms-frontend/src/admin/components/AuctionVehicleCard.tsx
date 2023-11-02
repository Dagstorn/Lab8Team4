import { AspectRatio } from "@/shared/shad-ui/ui/aspect-ratio"
import { Badge } from "@/shared/shad-ui/ui/badge"
import { Card, CardContent } from "@/shared/shad-ui/ui/card"
import { AuctionVehicle } from "@/shared/types/types"
import { getVehicleInfo } from "@/shared/utils/utils"

const AuctionVehicleCard = ({ vehicle }: { vehicle: AuctionVehicle }) => {
    return (
        <Card className="p-0 rounded-none shadow-md">
            <CardContent className="p-0">
                <div className="flex gap-6">
                    <div className="w-2/6">
                        <AspectRatio ratio={16 / 9}>
                            <img className="w-full h-full object-cover disable-pixeling"

                                src={`http://127.0.0.1:8000/${vehicle.image}`} alt="Image" />
                        </AspectRatio>
                    </div>
                    <div className="mt-2 w-4/6">
                        <p className="font-bold ">{vehicle.make} {vehicle.model} {vehicle.year}</p>
                        {getVehicleInfo(vehicle)}
                        <p className=""><Badge>Condition</Badge> {vehicle.condition}</p>
                        {vehicle.additional_indormation && <p className="">Additional info: {vehicle.additional_indormation}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AuctionVehicleCard