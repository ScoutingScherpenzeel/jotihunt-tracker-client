import MapPopup from './MapPopup';
import proj4 from 'proj4';
import MarkerRegistration from './MarkerRegistration';
import GoogleMapsButton from './GoogleMapsButton';
import {Marker} from "react-map-gl/mapbox";
import {Button} from "@/components/ui/button.tsx";
import {CopyIcon, LightbulbIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useHintFormBridge} from "@/hooks/hint-bridge.hook.ts";
import {toast} from "sonner";

export default function PickedLocationPopup({lat, lng, onClose}: { lat: number; lng: number; onClose: () => void }) {

    const setCoords = useHintFormBridge((s) => s.setCoords);

    function toRD(lat: number, lng: number): { x: string, y: string } {
        const rdX = proj4('WGS84', 'RD', [lng, lat])[0].toFixed(0);
        const rdY = proj4('WGS84', 'RD', [lng, lat])[1].toFixed(0);
        return {x: rdX, y: rdY};
    }

    async function copyRDCoordinates() {
        const rd = toRD(lat, lng);
        await navigator.clipboard.writeText(`${rd.x}, ${rd.y}`);
        notifyCopy();
    }

    async function copyLatLngCoordinates() {
        await navigator.clipboard.writeText(`${lat.toFixed(7)}, ${lng.toFixed(7)}`);
        notifyCopy();
    }

    function notifyCopy() {
        toast.success("Coördinaten gekopieerd naar klembord!");
    }

    function setHintCoords() {
        const rd = toRD(lat, lng);
        setCoords(rd.x, rd.y);
    }

    return (
        <>
            <Marker
                longitude={lng || 0}
                latitude={lat || 0}
                anchor="center">
                <div className={"bg-blue-500 block w-4 h-4 rounded-full border border-white animate-pulse"}></div>
            </Marker>
            <MapPopup onClose={onClose} longitude={lng || 0} latitude={lat || 0} offset={{bottom: [0, -15]}}>
                <div className="mr-6 flex flex-col gap-2 w-full">
                    <div>
                        <h2 className="font-semibold mb-2">Gekozen locatie</h2>
                        <div className={"flex flex-col gap-2"}>
                            <hr/>
                            <div className={"flex gap-3 justify-between"}>
                                <div className={"flex flex-col"}>
                                    <p>Breedtegraad: {lat.toFixed(7)}</p>
                                    <p>Lengtegraad: {lng.toFixed(7)}</p>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant={"outline"} size={"icon"}
                                                onClick={copyLatLngCoordinates}><CopyIcon/></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Kopieer coördinaten naar klembord.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <hr/>
                            <div className={"flex gap-3 justify-between"}>
                                <div className={"flex flex-col"}>
                                    <p>RD-x: {proj4('WGS84', 'RD', [lng, lat])[0].toFixed(0)}</p>
                                    <p>RD-y: {proj4('WGS84', 'RD', [lng, lat])[1].toFixed(0)}</p>
                                </div>
                                <div className={"flex gap-2"}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button variant={"outline"} size={"icon"}
                                                    onClick={setHintCoords}><LightbulbIcon/></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Plaats coördinaten in hint registratie.
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button variant={"outline"} size={"icon"}
                                                    onClick={copyRDCoordinates}><CopyIcon/></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Kopieer coördinaten naar klembord.
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </div>
                    <GoogleMapsButton lat={lat} lng={lng}/>
                    <MarkerRegistration lat={lat} lng={lng}/>
                </div>

            </MapPopup>
        </>
    );
}
