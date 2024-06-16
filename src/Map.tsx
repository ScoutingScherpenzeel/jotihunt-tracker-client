import Mapbox, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import Teams from "./components/layers/Teams";
import PropTypes, { InferProps } from "prop-types";
import Devices from "./components/layers/Devices";

export default function Map({showTeams = true, showDevices = true}: InferProps<typeof Map.propTypes>) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  return (
    <div className="h-screen w-screen">
      <Mapbox
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
      </Mapbox>
    </div>
  );
}

Map.propTypes = {
  showTeams: PropTypes.bool.isRequired,
  showDevices: PropTypes.bool.isRequired,
};