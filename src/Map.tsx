import Mapbox, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  MapRef as MapboxRef
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import Teams from "./components/layers/Teams";
import PropTypes from "prop-types";
import Devices from "./components/layers/Devices";
import Hints from "./components/layers/Hints";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface MapRef {
  flyTo(options: mapboxgl.FlyToOptions): void;
}

interface MapProps {
  showTeams: boolean;
  showDevices: boolean;
  showHints: boolean;
}

const Map = forwardRef<MapRef, MapProps>(
  ({ showTeams = true, showDevices = true, showHints = true }, ref) => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

    useImperativeHandle(ref, () => ({
      flyTo: (options: mapboxgl.FlyToOptions) => {
        if (mapRef.current) {
          mapRef.current.flyTo(options);
        }
      },
    }));

    const mapRef = useRef<MapboxRef>(null);

    return (
      <div className="h-screen w-screen">
        <Mapbox
          ref={mapRef}
          reuseMaps
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            latitude: 52.12748401580578,
            longitude: 5.82036696134869,
            zoom: 9,
          }}
          style={{ width: "100%", height: "100%" }}
          attributionControl={false}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          maxBounds={[
            [3.314971144228537, 50.80372101501058],
            [7.092053256784122, 53.51040334737814],
          ]}
        >
          <NavigationControl />
          <ScaleControl />
          <FullscreenControl />
          <GeolocateControl />
          <AttributionControl
            customAttribution={"Jotihunt Tracker | Scouting Scherpenzeel"}
            compact={true}
          />
          {showTeams && <Teams />}
          {showDevices && <Devices />}
          {showHints && <Hints />}
        </Mapbox>
      </div>
    );
  }
);

Map.propTypes = {
  showTeams: PropTypes.bool.isRequired,
  showDevices: PropTypes.bool.isRequired,
  showHints: PropTypes.bool.isRequired,
};

export default Map;
