import { useRef, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, Polyline } from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
// static map center is on Nazarbayev University coordinates
// map will always open with university in the center, since almost all the task will start from university
const center = { lat: 51.089888409978656, lng: 71.40146902770996 }
interface MyMapProps {
    startPointCoordsRef: React.RefObject<HTMLInputElement>;
    endPointCoordsRef: React.RefObject<HTMLInputElement>;
}

const Map: React.FC<MyMapProps> = ({ startPointCoordsRef, endPointCoordsRef }) => {
    // set default start point in form - for form safety
    if (startPointCoordsRef.current) {
        startPointCoordsRef.current!.value = JSON.stringify(center);
    }

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

    // when user selected first location with input with autocomplete
    const firstPointSelected = async () => {
        // check if both inputs are filled
        if (startPointRef.current?.value === '' || endPointRef.current?.value === '') {
            return
        }
        // initialize direction service
        const directionService = new google.maps.DirectionsService();

        // get route from direction service using start and end positions 
        const results = await directionService.route({
            origin: startPointRef.current!.value,
            destination: endPointRef.current!.value,
            travelMode: google.maps.TravelMode.DRIVING
        })
        // get route path coordinates and save them to display on page later
        const coords = results.routes[0].overview_path;
        setRouteCoords(coords);

        // center map on route center 
        mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
        mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)

        // convert Adress from input to lat and lng and set marker to those coordinates
        const result = await getGeocode({ address: startPointRef.current!.value })
        const { lat, lng } = await getLatLng(result[0]);
        startMarkerRef.current?.marker?.setPosition({ lat, lng });
        startPointCoordsRef.current!.value = JSON.stringify({ lat, lng });

    }
    // when user selected second location with input with autocomplete
    const secondPointSelected = async () => {
        if (startPointRef.current?.value === '' || endPointRef.current?.value === '') {
            return
        }
        const directionService = new google.maps.DirectionsService();


        const results = await directionService.route({
            origin: startPointRef.current!.value,
            destination: endPointRef.current!.value,
            travelMode: google.maps.TravelMode.DRIVING
        })
        const coords = results.routes[0].overview_path;
        setRouteCoords(coords);

        // center map on route center 
        mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
        mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)
        // convert Adress from input to lat and lng and set marker to those coordinates
        const result = await getGeocode({ address: endPointRef.current!.value })
        const { lat, lng } = await getLatLng(result[0]);
        endMarkerRef.current?.marker?.setPosition({ lat, lng });
        endPointCoordsRef.current!.value = JSON.stringify({ lat, lng });

    }

    // when user drags and drops start point marker
    const processOriginMarker = (coord: any) => {
        const geocoder = new google.maps.Geocoder;

        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        startPointCoordsRef.current!.value = JSON.stringify({ lat, lng });

        geocoder.geocode({ location: { lat: lat, lng: lng } })
            .then(async (response: any) => {
                startPointRef.current!.value = response.results[0].formatted_address;

                const directionService = new google.maps.DirectionsService();
                const endMarkerPos: any = endMarkerRef.current!;

                const results = await directionService.route({
                    origin: { lat, lng },
                    destination: { lat: endMarkerPos.marker.position.lat(), lng: endMarkerPos.marker.position.lng() },
                    travelMode: google.maps.TravelMode.DRIVING,

                })
                const coords = results.routes[0].overview_path;
                setRouteCoords(coords);
                mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
                mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)


            })
    }

    // when user drags and drops end point marker
    const processDestinationMarker = async (coord: any) => {
        const geocoder = new google.maps.Geocoder;

        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        endPointCoordsRef.current!.value = JSON.stringify({ lat, lng });

        geocoder.geocode({ location: { lat: lat, lng: lng } })
            .then(async (response: any) => {
                endPointRef.current!.value = response.results[0].formatted_address;

                const directionService = new google.maps.DirectionsService();
                const startMarkerPos: any = startMarkerRef.current!;

                const results = await directionService.route({
                    origin: { lat: startMarkerPos.marker.position.lat(), lng: startMarkerPos.marker.position.lng() },
                    destination: { lat, lng },
                    travelMode: google.maps.TravelMode.DRIVING,

                })
                const coords = results.routes[0].overview_path;
                setRouteCoords(coords);
                mapRef.current?.state.map?.panTo(results.routes[0].bounds.getCenter());
                mapRef.current?.state.map?.fitBounds(results.routes[0].bounds)
            })
    }



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
                            onBlur={() => firstPointSelected()}
                            defaultValue="Nazarbayev University, Qabanbay Batyr Avenue, Astana, Kazakhstan"
                        />
                    </Autocomplete>
                </div>
                <div className="mb-4">
                    <label htmlFor="">End point</label>
                    <Autocomplete>
                        <input ref={endPointRef}
                            className="custom-input"
                            onBlur={() => secondPointSelected()}
                        />
                    </Autocomplete>
                </div>
            </div>
            <div className="h-96">
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
                        onDragEnd={(coord: any) => processOriginMarker(coord)}
                    />
                    <Marker ref={endMarkerRef} position={center} draggable={true} label={{
                        text: "Destination",
                        color: "blue",
                        fontWeight: "bold",
                        className: "mt-14"
                    }}
                        onDragEnd={(coord: any) => processDestinationMarker(coord)}
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
            </div>

        </div>
    )
}

export default Map