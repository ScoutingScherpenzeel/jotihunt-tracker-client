import Mapbox, { AttributionControl, GeolocateControl, NavigationControl, ScaleControl, MapRef as MapboxRef, LngLatBoundsLike } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import Teams from './layers/Teams';
import Devices from './layers/Devices';
import Hints from './layers/Hints';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MapPopup from './map/MapPopup';
import { Button } from './ui/button';
import proj4 from 'proj4';
import HomeCircle from './layers/HomeCircle';
import useLayersStore from '../stores/layers.store';
import useSettingsStore from '../stores/settings.store';
import { MapIcon } from 'lucide-react';

export interface MapRef {
  flyTo(options: mapboxgl.FlyToOptions): void;
}

// Mapbox settings
const mapboxToken = import.meta.env.MAPBOX_TOKEN;
const initialViewState = {
  latitude: 52.12748401580578,
  longitude: 5.82036696134869,
  zoom: 9,
};
const maxBounds = [
  [3.314971144228537, 50.80372101501058],
  [7.092053256784122, 53.51040334737814],
] as LngLatBoundsLike;

const Map = forwardRef<MapRef>((_, ref) => {
  // Make map fly available to other components
  const mapRef = useRef<MapboxRef>(null);
  useImperativeHandle(ref, () => ({
    flyTo: (options: mapboxgl.FlyToOptions) => {
      if (mapRef.current) {
        mapRef.current.flyTo(options);
      }
    },
  }));

  // Store for all layers
  const { showTeams, showDevices, showHintsPart1, showHintsPart2, showHomeCircle } = useLayersStore();
  const [popupPosition, setPopupPosition] = useState<mapboxgl.LngLat>();

  // Store for settings
  const { mapStyle } = useSettingsStore();

  /**
   * Open the current location popup when the map is clicked.
   */
  function openPopup(e: mapboxgl.MapMouseEvent) {
    if (popupPosition) return;
    setPopupPosition(e.lngLat);
  }

  return (
    <div className="w-dvw h-dvh">
      <Mapbox
        ref={mapRef}
        reuseMaps
        mapboxAccessToken={mapboxToken}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        mapStyle={mapStyle}
        maxBounds={maxBounds}
        onClick={openPopup}
      >
        <NavigationControl />
        <ScaleControl />
        <GeolocateControl />
        <AttributionControl customAttribution={'Jotihunt Tracker | Scouting Scherpenzeel'} compact={true} />

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

                <p>RD-x: {proj4('WGS84', 'RD', [popupPosition.lng, popupPosition.lat])[0].toFixed(0)}</p>
                <p>RD-y: {proj4('WGS84', 'RD', [popupPosition.lng, popupPosition.lat])[1].toFixed(0)}</p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-min">
                <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${popupPosition.lat},${popupPosition.lng}`}>
                  <MapIcon className="mr-2 h-4 w-4" /> Bekijk op google maps
                </a>
              </Button>
            </div>
          </MapPopup>
        )}
        {showTeams && <Teams />}
        {showDevices && <Devices />}
        {(showHintsPart1 || showHintsPart2) && <Hints part1={showHintsPart1} part2={showHintsPart2} />}
        {showHomeCircle && <HomeCircle />}
      </Mapbox>
    </div>
  );
});

export default Map;
