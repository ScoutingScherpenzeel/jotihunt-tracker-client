import { Eye, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useCounterHuntStore from '@/stores/counterhunt.store';
import { useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { MapRef } from '@/Map';

export default function CounterHuntCard({ mapRef }: InferProps<typeof CounterHuntCard.propTypes>) {
  // Home coordinates for zooming to the counter hunt
  const homeCoordsLat = import.meta.env.HOME_COORDS_LAT;
  const homeCoordsLon = import.meta.env.HOME_COORDS_LON;

  const { direction, setDirection, setVisible } = useCounterHuntStore();
  const [chosenDirection, setChosenDirection] = useState(direction);

  /**
   * Show the counter hunt on the map.
   * Sets the zustand store to visible, sets the direction and makes sure the layer is enabled on the map.
   */
  function showCounterHunt() {
    setVisible(true);
    setDirection(chosenDirection);
    mapRef.current?.flyTo({
      center: [homeCoordsLon, homeCoordsLat],
      duration: 2000,
      zoom: 16,
    });
  }

  /**
   * Remove the counter hunt from the map.
   */
  function removeCounterHunt() {
    setVisible(false);
    setDirection(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tegenhunt visualisatie</CardTitle>
        <CardDescription>Kies een windrichting om te zien wat het tegenhunt gebied is.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 w-full flex-wrap md:flex-nowrap">
          <Select onValueChange={(value) => setChosenDirection(Number(value))} value={chosenDirection.toString()}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kies windrichting..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">N - Noord</SelectItem>
              <SelectItem value="45">NO - Noordoost</SelectItem>
              <SelectItem value="90">O - Oost</SelectItem>
              <SelectItem value="135">ZO - Zuidoost</SelectItem>
              <SelectItem value="180">Z - Zuid</SelectItem>
              <SelectItem value="225">ZW - Zuidwest</SelectItem>
              <SelectItem value="270">W - West</SelectItem>
              <SelectItem value="315">NW - Noordwest</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={showCounterHunt} className="flex-1 md:w-auto">
            <Eye className="mr-2 h-4 w-4" />
            Toon
          </Button>
          <Button variant="outline" onClick={removeCounterHunt} className="flex-1 md:w-auto">
            <Trash className="mr-2 h-4 w-4" />
            Verwijder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

CounterHuntCard.propTypes = {
  mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
