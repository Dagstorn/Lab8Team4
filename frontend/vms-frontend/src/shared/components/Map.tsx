import { useEffect, useRef, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, Polyline } from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
// static map center is on Nazarbayev University coordinates
// map will always open with university in the center, since almost all the task will start from university
const center = { lat: 51.089888409978656, lng: 71.40146902770996 }
// define props types
interface MyMapProps {
    startFormInp: React.RefObject<HTMLInputElement>;
    endFormInp: React.RefObject<HTMLInputElement>;
    initialStart?: string;
    initialDestination?: string;
}

const Map: React.FC<MyMapProps> = ({ startFormInp, endFormInp, initialStart, initialDestination }) => {

    // use useJsApiLoader hook to use Google maps api
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places', 'routes']
    })
    // google map ref
    const mapRef = useRef<GoogleMap>(null);
    // input references
    const startPointRef = useRef<HTMLInputElement>(null);
    const endPointRef = useRef<HTMLInputElement>(null);

    // marker references
    const startMarkerRef = useRef<Marker>(null);
    const endMarkerRef = useRef<Marker>(null);

    // store route
    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const [mapIsLoading, setMapIsLoading] = useState(true);

    const pointSelected = async (inputRef: React.RefObject<HTMLInputElement>, markerRef: React.RefObject<Marker>, formInp: React.RefObject<HTMLInputElement>) => {
        if (inputRef.current?.value === '') {
            return
        }
        // set form data that will go to database
        formInp.current!.value = inputRef.current?.value || "";

        // convert Adress from input to lat and lng and set marker to those coordinates
        const result = await getGeocode({ address: inputRef.current!.value })
        const { lat, lng } = getLatLng(result[0]);
        markerRef.current?.marker?.setPosition({ lat, lng });

        // initialize direction service
        const directionService = new google.maps.DirectionsService();

        // get route from direction service using start and end positions 
        const results = await directionService.route({
            origin: { lat: startMarkerRef.current!.marker!.getPosition()!.lat(), lng: startMarkerRef.current!.marker!.getPosition()!.lng() },
            destination: { lat: endMarkerRef.current!.marker!.getPosition()!.lat(), lng: endMarkerRef.current!.marker!.getPosition()!.lng() },
            travelMode: google.maps.TravelMode.DRIVING
        })
        // get route path coordinates and save them to display on page later
        const coords = results.routes[0].overview_path;
        setRouteCoords(coords);

        // center map on route center 
        mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
        mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)
    }


    // when user drags and drops marker
    const processMarker = (coord: any, inputRef: React.RefObject<HTMLInputElement>, markerRef: React.RefObject<Marker>, formInp: React.RefObject<HTMLInputElement>) => {
        const geocoder = new google.maps.Geocoder;

        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        geocoder.geocode({ location: { lat: lat, lng: lng } })
            .then(async (response: any) => {
                inputRef.current!.value = response.results[0].formatted_address;
                pointSelected(inputRef, markerRef, formInp);
            })
    }



    useEffect(() => {
        if (initialStart && initialDestination) {
            setMapIsLoading(true);
            setTimeout(async () => {
                if (mapRef.current && startPointRef.current && endPointRef.current) {
                    startPointRef.current.value = initialStart;
                    endPointRef.current.value = initialDestination;
                    await pointSelected(startPointRef, startMarkerRef, startFormInp);
                    await pointSelected(endPointRef, endMarkerRef, endFormInp);
                    console.log("done loading")
                    setMapIsLoading(false);
                }
            }, 700);
        } else {
            setMapIsLoading(false);
        }

    }, [])

    // if map is not loaded we display spinner to indicate loading
    if (!isLoaded) {
        return <div className="bg-gray-200 w-full h-96 flex justify-center">
            <Spinner />
        </div>
    }
    return (
        <div className=''>
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div className="mb-4">
                    <label htmlFor="">Starting point</label>
                    <Autocomplete>
                        <input ref={startPointRef}
                            className="custom-input"
                            onBlur={() => pointSelected(startPointRef, startMarkerRef, startFormInp)}
                        />
                    </Autocomplete>
                </div>
                <div className="mb-4">
                    <label htmlFor="">End point</label>
                    <Autocomplete>
                        <input ref={endPointRef}
                            className="custom-input"
                            onBlur={() => pointSelected(endPointRef, endMarkerRef, endFormInp)}
                        />
                    </Autocomplete>
                </div>
            </div>
            <div className="h-96 w-full relative">
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
                    <Marker ref={startMarkerRef} position={center} draggable={true} label={{
                        text: "Origin",
                        color: "blue",
                        fontWeight: "bold",
                        className: "mt-14"

                    }}
                        onDragEnd={(coord: any) => processMarker(coord, startPointRef, startMarkerRef, startFormInp)}
                    />
                    <Marker ref={endMarkerRef} position={center} draggable={true} label={{
                        text: "Destination",
                        color: "blue",
                        fontWeight: "bold",
                        className: "mt-14"
                    }}
                        onDragEnd={(coord: any) => processMarker(coord, endPointRef, endMarkerRef, endFormInp)}
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
                </GoogleMap>
                {mapIsLoading && <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1, // Place the overlay above other content
                    }}
                >
                    <Spinner></Spinner>
                </div>}
            </div>

        </div>
    )
}

export default Map