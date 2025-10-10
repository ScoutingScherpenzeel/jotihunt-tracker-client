import Mapbox, { AttributionControl, GeolocateControl, NavigationControl, ScaleControl, MapRef as MapboxRef, LngLatBoundsLike } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

import Teams from './layers/Teams';
import Devices from './layers/Devices';
import Markers from './layers/Markers';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import HomeCircle from './layers/HomeCircle';
import useLayersStore from '../stores/layers.store';
import useSettingsStore from '../stores/settings.store';
import { MapStyle } from '@/types/MapStyle';
import { useDarkMode } from '@/hooks/utils/darkmode.hook';
import PickedLocationPopup from './map/PickedLocationPopup';
type FlyToOpts = NonNullable<Parameters<mapboxgl.Map["flyTo"]>[0]>;

export interface MapRef {
  flyTo(options: FlyToOpts): void;
}

// Mapbox settings
const mapboxToken = import.meta.env.MAPBOX_TOKEN;
const initialViewState = {
  latitude: 52.1209259,
  longitude: 5.6869246,
  zoom: 9.5,
};
const maxBounds = [
  [3.314971144228537, 50.80372101501058],
  [7.092053256784122, 53.51040334737814],
] as LngLatBoundsLike;

const Map = forwardRef<MapRef>((_, ref) => {
  // Make map fly available to other components
  const mapRef = useRef<MapboxRef>(null);
  useImperativeHandle(ref, () => ({
    flyTo: (options: FlyToOpts) => {
      if (mapRef.current) {
        mapRef.current.flyTo(options);
      }
    },
  }));

  // Store for all layers
  const { showTeams, showDevices, showMarkersPart1, showMarkersPart2, showHomeCircle } = useLayersStore();
  const [popupPosition, setPopupPosition] = useState<mapboxgl.LngLat>();

  // Store for settings
  const { mapStyle } = useSettingsStore();
  const isDarkMode = useDarkMode();
  let correctedMapStyle = mapStyle;
  if (!correctedMapStyle) {
    correctedMapStyle = isDarkMode ? MapStyle.Dark : MapStyle.Streets;
  }

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
        mapStyle={correctedMapStyle}
        maxBounds={maxBounds}
        onClick={openPopup}
      >
        <NavigationControl />
        <ScaleControl />
        <GeolocateControl />
        <div className="bg-background">
          <AttributionControl customAttribution={'Jotihunt Tracker | Scouting Scherpenzeel'} compact={true} />
        </div>
        {popupPosition && <PickedLocationPopup lng={popupPosition.lng} lat={popupPosition.lat} onClose={() => setPopupPosition(undefined)} />}
        {showTeams && <Teams />}
        {showDevices && <Devices />}
        {(showMarkersPart1 || showMarkersPart2) && <Markers part1={showMarkersPart1} part2={showMarkersPart2} />}
        {showHomeCircle && <HomeCircle />}
      </Mapbox>
    </div>
  );
});

export default Map;
