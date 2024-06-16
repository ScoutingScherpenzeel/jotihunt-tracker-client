import { Layer, Marker, Source } from "react-map-gl";
import { useState } from "react";
import MapPopup from "../map/MapPopup";
import { useDevices } from "@/hooks/devices.hook";
import carIcon from "@/assets/images/car.svg";
import { knotsToKmh } from "@/lib/utils";
import * as turf from "@turf/turf";

export default function Devices() {
  const { devices } = useDevices();
  const [activeDeviceId, setActiveDeviceId] = useState<number>();
  const activeDevice = devices?.find(
    (device) => device.deviceId === activeDeviceId
  );

  const createCircle = (
    longitude: number,
    latitude: number,
    radius: number
  ) => {
    const center = [longitude, latitude];
    const circle = turf.circle(center, radius, {
      steps: 64,
      units: "meters",
    });

    return circle;
  };

  return (
    <>
      {devices?.map((device) => (
        <div key={device.deviceId}>
          <Marker
            key={device.id}
            longitude={device.longitude}
            latitude={device.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveDeviceId(device.deviceId);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out flex flex-col items-center">
              <img src={carIcon} className="h-10" />
            </div>
          </Marker>
          <Source
            id={`circle-source-${device.deviceId}`}
            type="geojson"
            data={createCircle(
              device.longitude,
              device.latitude,
              device.accuracy
            )}
          >
            <Layer
              id={`circle-layer-${device.deviceId}`}
              type="fill"
              paint={{
                "fill-color": "rgba(66, 135, 245, 0.2)",
                "fill-outline-color": "rgba(66, 135, 245, 0.5)",
              }}
            />
          </Source>
        </div>
      ))}
      {activeDevice && (
        <MapPopup
          longitude={activeDevice.longitude}
          latitude={activeDevice.latitude}
          onClose={() => setActiveDeviceId(undefined)}
        >
          <div>
            <h2 className="font-semibold">{activeDevice.deviceName}</h2>
            <p>Snelheid: {Math.round(knotsToKmh(activeDevice.speed))} km/h</p>
            <p>Batterij: {activeDevice.attributes.batteryLevel}%</p>
          </div>
        </MapPopup>
      )}
    </>
  );
}
