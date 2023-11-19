import { useEffect, useRef, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useJsApiLoader, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { RoutePoints } from "@/shared/types/types";

const center = { lat: 51.089888409978656, lng: 71.40146902770996 }
interface MyMapProps {
    routePoints: RoutePoints | undefined
}
const Map: React.FC<MyMapProps> = ({ routePoints }) => {
    // use useJsApiLoader hook to use Google maps api
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places', 'routes']
    })
    // google map ref
    const mapRef = useRef<GoogleMap>(null);

    // store route
    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const constructRoute = async (routePoints: RoutePoints) => {
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
            origin: routePoints.start,
            destination: routePoints.end,
            travelMode: google.maps.TravelMode.DRIVING,
        })
        setRouteCoords(results.routes[0].overview_path);
        mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
        mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)
    }
    useEffect(() => {
        if (routePoints)
            constructRoute(routePoints);
    }, [routePoints])



    // if map is not loaded we display spinner to indicate loading
    if (!isLoaded) {
        return <div className="bg-gray-200 w-full h-96 flex justify-center">
            <Spinner />
        </div>
    }
    return (
        <div className='h-full'>

            <div className="h-full">
                <GoogleMap
                    ref={mapRef}
                    center={center} zoom={14}
                    options={{
                        streetViewControl: false,
                        fullscreenControl: false,
                        zoomControl: false,
                        mapTypeControl: false
                    }}
                    mapContainerClassName="w-full h-full">
                    {routePoints?.start && <>
                        <Marker position={routePoints.start} draggable={false} label={{
                            text: "Start",
                            color: "blue",
                            fontWeight: "bold",
                            className: "mt-14"

                        }}
                        />
                        <Marker position={routePoints.end} draggable={false} label={{
                            text: "End",
                            color: "blue",
                            fontWeight: "bold",
                            className: "mt-14"
                        }}
                        />
                        {routeCoords.length > 0 && <Polyline
                            path={routeCoords}
                            options={{
                                strokeColor: "#ff2343",
                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                                clickable: true
                            }}
                        />}
                    </>}

                </GoogleMap>
            </div>

        </div>
    )
}

export default Map