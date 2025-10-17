import MapPopup from './MapPopup';
import proj4 from 'proj4';
import MarkerRegistration from './MarkerRegistration';
import GoogleMapsButton from './GoogleMapsButton';
import {Marker} from "react-map-gl/mapbox";

export default function PickedLocationPopup({lat, lng, onClose}: { lat: number; lng: number; onClose: () => void }) {
    return (
        <>
            <Marker
                longitude={lng || 0}
                latitude={lat || 0}
                anchor="center">
                {/*<div className={"bg-blue-500 absolute -bottom-8 -z-10 w-4 h-4 rounded-full left-1/2 right-1/2 -translate-x-1/2 border border-white"}></div>*/}
                <div className={"bg-blue-500 block w-4 h-4 rounded-full border border-white animate-pulse"}></div>
            </Marker>
            <MapPopup onClose={onClose} longitude={lng || 0} latitude={lat || 0} offset={{bottom: [0, -15]}}>
                <div className="mr-6 flex flex-col gap-2 w-full">
                    <div>
                        <h2 className="font-semibold">Gekozen locatie</h2>
                        <p>Breedtegraad: {lat.toFixed(7)}</p>
                        <p>Lengtegraad: {lng.toFixed(7)}</p>

                        <p>RD-x: {proj4('WGS84', 'RD', [lng, lat])[0].toFixed(0)}</p>
                        <p>RD-y: {proj4('WGS84', 'RD', [lng, lat])[1].toFixed(0)}</p>
                    </div>
                    <GoogleMapsButton lat={lat} lng={lng}/>
                    <MarkerRegistration lat={lat} lng={lng}/>
                </div>

            </MapPopup>
        </>
    );
}
