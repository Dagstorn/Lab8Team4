import { useRef, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, Polyline } from "@react-google-maps/api";

const center = { lat: 51.089888409978656, lng: 71.40146902770996 }

const Map: React.FC<MyMapProps> = () => {
    // use useJsApiLoader hook to use Google maps api
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places', 'routes']
    })
    // google map ref
    const mapRef = useRef<GoogleMap>(null);




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

                </GoogleMap>
            </div>

        </div>
    )
}

export default Map