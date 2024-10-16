import MapPopup from './MapPopup';
import proj4 from 'proj4';
import MarkerRegistration from './MarkerRegistration';
import GoogleMapsButton from './GoogleMapsButton';

export default function PickedLocationPopup({ lat, lng, onClose }: { lat: number; lng: number; onClose: () => void }) {
  return (
    <MapPopup onClose={onClose} longitude={lng || 0} latitude={lat || 0} offset={{ bottom: [0, 0] }}>
      <div className="mr-6 flex flex-col gap-2 w-full">
        <div>
          <h2 className="font-semibold">Gekozen locatie</h2>
          <p>Breedtegraad: {lat.toFixed(7)}</p>
          <p>Lengtegraad: {lng.toFixed(7)}</p>

          <p>RD-x: {proj4('WGS84', 'RD', [lng, lat])[0].toFixed(0)}</p>
          <p>RD-y: {proj4('WGS84', 'RD', [lng, lat])[1].toFixed(0)}</p>
        </div>
        <GoogleMapsButton lat={lat} lng={lng} />
        <MarkerRegistration lat={lat} lng={lng} />
      </div>
    </MapPopup>
  );
}
