import {useDevices} from "@/hooks/devices.hook.ts";
import {isMoreThanFiveMinutesAgo} from "@/lib/utils.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {MapPinIcon} from "lucide-react";
import PropTypes, {InferProps} from "prop-types";
import {MapRef} from "@/components/Map.tsx";
import {Device} from "@/types/Device.ts";

export default function ActiveDevices({mapRef}: InferProps<typeof ActiveDevices.propTypes>) {

    const {devices, positions} = useDevices();
    const activeDevices = devices?.filter((device) => !isMoreThanFiveMinutesAgo(device.lastUpdate.toString()));

    /**
     * Fly to the device on the map.
     * @param device The device to fly to.
     */
    function flyToDevice(device: Device) {
        if (mapRef.current) {
            const position = positions?.find((pos) => pos.deviceId === device.id);
            if (position) {
                mapRef.current.flyTo({
                    center: [position.longitude, position.latitude],
                    zoom: 15,
                    essential: true,
                });
            }
        }
    }

    return <div className={"flex gap-2 items-center"}>
        <p className={"text-sm font-semibold text-foreground"}>Actieve hunters:</p>
        {activeDevices?.map((device) => (
            <div key={device.id} onClick={() => flyToDevice(device)}>
                <Badge className={"hover:bg-background cursor-pointer flex gap-1"} variant={"secondary"}><MapPinIcon
                    className={"w-4 h-4"}/> {device.name}</Badge>
            </div>
        ))}
    </div>;
}

ActiveDevices.propTypes = {
    mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
