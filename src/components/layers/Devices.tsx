import { Marker } from "react-map-gl";
import { useState } from "react";
import MapPopup from "../map/MapPopup";
import { useDevices } from "@/hooks/devices.hook";
import carIcon from "@/assets/images/car.svg";

export default function Devices() {
  const { devices } = useDevices();
  const [activeDeviceId, setActiveDeviceId] = useState<number>();
  const activeDevice = devices?.find(device => device.deviceId === activeDeviceId);

  return (
    <>
      {devices?.map((device) => (
        <Marker
          key={device.id}
          longitude={device.longitude}
          latitude={device.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActiveDeviceId(device.deviceId);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out flex flex-col items-center">
            <img src={carIcon} className="h-10"/>
          </div>
        </Marker>
      ))}
      {activeDevice && (
        <MapPopup
          longitude={activeDevice.longitude}
          latitude={activeDevice.latitude}
          onClose={() => setActiveDeviceId(undefined)}
        >
          <div>
            <h2 className="font-semibold">{activeDevice.deviceName}</h2>
            <p>{activeDevice.speed} km/h</p>
          </div>
        </MapPopup>
      )}
    </>
  );
}
