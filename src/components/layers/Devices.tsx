import { Marker } from "react-map-gl";
import MapMarker from "../map/MapMarker";
import { useState } from "react";
import { Device } from "../../api";
import MapPopup from "../map/MapPopup";
import { useDevices } from "@/hooks/devices.hook";

export default function Devices() {
  const { devices } = useDevices();
  const [activeDevice, setActiveDevice] = useState<Device>();

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
            setActiveDevice(device);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
          <svg display="block" height="41px" width="27px" viewBox="0 0 27 41">
  <ellipse
    cx="13.5"
    cy="34.8"
    rx="10.5"
    ry="5.25"
    fill="url(#shadowGradient)"
  />
  <path
    fill="red"
    d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"
  />
  <path
    opacity="0.25"
    d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"
  />
  <circle fill="white" cx="13.5" cy="13.5" r="5.5" />

  <path
    fill="red"
    d="M9,30 C9,28 15,28 15,30 Z"
  />
  <rect fill="red" x="6" y="20" width="15" height="10" rx="2" ry="2" />
  <circle fill="white" cx="8" cy="33" r="3" />
  <circle fill="white" cx="19" cy="33" r="3" />
</svg>


          </div>
        </Marker>
      ))}
      {/* {activeTeam && (
        <MapPopup
          longitude={activeTeam.location.coordinates[0]}
          latitude={activeTeam.location.coordinates[1]}
          onClose={() => setActiveTeam(undefined)}
        >
          <div>
            <h2 className="font-semibold">{activeTeam.name}</h2>
            <p>Accomodatie: {activeTeam.accomodation}</p>
            <p>
              {activeTeam.street} {activeTeam.houseNumber}{" "}
              {activeTeam.houseNumberAddition}
            </p>
            <p>
              {activeTeam.postCode} {activeTeam.city}
            </p>
          </div>
        </MapPopup>
      )} */}
    </>
  );
}
