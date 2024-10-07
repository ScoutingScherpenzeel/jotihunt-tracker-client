import { Button } from './ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

export default function DebugInfo() {
  const BUILD_TIME = import.meta.env.BUILD_TIME;
  const VERSION = import.meta.env.VERSION;

  const API_BASE_URL = import.meta.env.API_BASE_URL;
  const HUNT_START_TIME = import.meta.env.HUNT_START_TIME;
  const HUNT_END_TIME = import.meta.env.HUNT_END_TIME;
  const HOME_COORDS_LAT = import.meta.env.HOME_COORDS_LAT;
  const HOME_COORDS_LON = import.meta.env.HOME_COORDS_LON;
  const GROUP_WALKING_ID = import.meta.env.GROUP_WALKING_ID;
  const GROUP_CAR_ID = import.meta.env.GROUP_CAR_ID;
  const GROUP_MOTORCYCLE_ID = import.meta.env.GROUP_MOTORCYCLE_ID;
  const GROUP_BIKE_ID = import.meta.env.GROUP_BIKE_ID;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Debug informatie</DialogTitle>
        <DialogDescription>Informatie voor ontwikkelaars</DialogDescription>
      </DialogHeader>

      <div>
        <h1 className="font-semibold">Applicatie-informatie</h1>
        <p>Versie: {VERSION}</p>
        <p>Build tijd: {new Date(BUILD_TIME).toLocaleString()}</p>
      </div>

      <div>
        <h1 className="font-semibold">Omgevingsvariabelen</h1>
        <p>API base URL: {API_BASE_URL}</p>
        <p>Hunt start: {new Date(HUNT_START_TIME).toLocaleString()}</p>
        <p>Hunt einde: {new Date(HUNT_END_TIME).toLocaleString()}</p>
        <p>
          Basis coördinaten: {HOME_COORDS_LAT}, {HOME_COORDS_LON}
        </p>
        <p>Groep ID lopend: {GROUP_WALKING_ID}</p>
        <p>Groep ID auto: {GROUP_CAR_ID}</p>
        <p>Groep ID motor: {GROUP_MOTORCYCLE_ID}</p>
        <p>Groep ID fiets: {GROUP_BIKE_ID}</p>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button>Sluiten</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
