import Mapbox, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  MapRef as MapboxRef,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import Teams from "./components/layers/Teams";
import PropTypes from "prop-types";
import Devices from "./components/layers/Devices";
import Hints from "./components/layers/Hints";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import MapPopup from "./components/map/MapPopup";
import { Button } from "./components/ui/button";

export interface MapRef {
  flyTo(options: mapboxgl.FlyToOptions): void;
}

interface MapProps {
  showTeams: boolean;
  showDevices: boolean;
  showHintsPart1: boolean;
  showHintsPart2: boolean;
}

const Map = forwardRef<MapRef, MapProps>(
  (
    {
      showTeams = true,
      showDevices = true,
      showHintsPart1 = true,
      showHintsPart2 = true,
    },
    ref
  ) => {
    const mapboxToken = import.meta.env.MAPBOX_TOKEN;

    useImperativeHandle(ref, () => ({
      flyTo: (options: mapboxgl.FlyToOptions) => {
        if (mapRef.current) {
          mapRef.current.flyTo(options);
        }
      },
    }));

    const mapRef = useRef<MapboxRef>(null);

    const [popupPosition, setPopupPosition] = useState<mapboxgl.LngLat>();

    function openPopup(e: mapboxgl.MapMouseEvent) {
      if (popupPosition) return;
      setPopupPosition(e.lngLat);
    }

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
          onClick={openPopup}
        >
          <NavigationControl />
          <ScaleControl />
          <FullscreenControl />
          <GeolocateControl />
          <AttributionControl
            customAttribution={"Jotihunt Tracker | Scouting Scherpenzeel"}
            compact={true}
          />
          {popupPosition && (
            <MapPopup
              onClose={() => {
                setPopupPosition(undefined);
              }}
              longitude={popupPosition?.lng || 0}
              latitude={popupPosition?.lat || 0}
              offset={{ bottom: [0, 0] }}
            >
              <div className="mr-6 flex flex-col gap-2">
                <div>
                  <h2 className="font-semibold">Gekozen locatie</h2>
                  <p>Breedtegraad: {popupPosition.lat.toFixed(7)}</p>
                  <p>Lengtegraad: {popupPosition.lng.toFixed(7)}</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-min">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps?q=${popupPosition.lat},${popupPosition.lng}`}
                  >
                    Bekijk op Google Maps
                  </a>
                </Button>
              </div>
            </MapPopup>
          )}
          {showTeams && <Teams />}
          {showDevices && <Devices />}
          {(showHintsPart1 || showHintsPart2) && (
            <Hints part1={showHintsPart1} part2={showHintsPart2} />
          )}
        </Mapbox>
      </div>
    );
  }
);

Map.propTypes = {
  showTeams: PropTypes.bool.isRequired,
  showDevices: PropTypes.bool.isRequired,
  showHintsPart1: PropTypes.bool.isRequired,
  showHintsPart2: PropTypes.bool.isRequired,
};

export default Map;
