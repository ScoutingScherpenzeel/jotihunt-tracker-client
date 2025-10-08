import { Eye, Trash } from 'lucide-react';
import { Button } from '../../ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select.tsx';
import useCounterHuntStore from '@/stores/counterhunt.store.ts';
import { useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { MapRef } from '@/components/Map.tsx';
import useMenuStore from '@/stores/menu.store.ts';
import { useTeams } from '@/hooks/teams.hook.ts';

export default function CounterHuntCard({ mapRef }: InferProps<typeof CounterHuntCard.propTypes>) {
  // Home coordinates for zooming to the counter hunt
  const { teams } = useTeams();
  const homeTeam = teams?.find((team) => team.apiId == import.meta.env.HOME_TEAM_API_ID);

  const { setMenuOpen } = useMenuStore();
  const { direction, setDirection, setVisible } = useCounterHuntStore();
  const [chosenDirection, setChosenDirection] = useState(direction);

  /**
   * Show the counter hunt on the map.
   * Sets the zustand store to visible, sets the direction and makes sure the layer is enabled on the map.
   */
  function showCounterHunt() {
    setVisible(true);
    setDirection(chosenDirection);
    if (homeTeam) {
      mapRef.current?.flyTo({
        center: [homeTeam?.location.coordinates[0], homeTeam?.location.coordinates[1]],
        duration: 2000,
        zoom: 16,
      });
    }
    setMenuOpen(false);
  }

  /**
   * Remove the counter hunt from the map.
   */
  function removeCounterHunt() {
    setVisible(false);
    setDirection(0);
  }

  return (
    <Card collapsible={true} defaultOpen={true}>
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
          <Button onClick={showCounterHunt}>
            <Eye />Toon
          </Button>
          <Button variant="outline" onClick={removeCounterHunt} >
            <Trash />Verwijder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

CounterHuntCard.propTypes = {
  mapRef: PropTypes.object.isRequired as PropTypes.Validator<React.RefObject<MapRef>>,
};
