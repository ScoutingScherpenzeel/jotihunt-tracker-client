import { Layer, Marker, Source } from 'react-map-gl';
import { useTeams } from '@/hooks/teams.hook.ts';
import MapMarker from '../map/MapMarker';
import { useMemo, useState } from 'react';
import { Team } from '@/types/Team';
import MapPopup from '../map/MapPopup';
import { createCircle, getColorFromArea } from '@/lib/utils';
import { useAreas } from '@/hooks/areas.hook';
import GoogleMapsButton from '../map/GoogleMapsButton';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useLayersStore from '@/stores/layers.store';

export default function Teams() {
  const HOME_TEAM_API_ID = import.meta.env.HOME_TEAM_API_ID;

  const { showGroupCircles } = useLayersStore();
  const { teams, setTeamArea } = useTeams();
  const { isVisible } = useAreas();

  const [activeTeam, setActiveTeam] = useState<Team>();
  const { areas } = useAreas();

  function handleAreaChange(area: string) {
    if (!activeTeam) return;
    activeTeam.area = area;
    setTeamArea(activeTeam._id, area);
  }

  const markers = useMemo(() => {
    return teams
      ?.filter((team) => isVisible(team.area || ''))
      .map((team) => (
        <>
          <Marker
            key={team._id}
            longitude={team.location.coordinates[0]}
            latitude={team.location.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveTeam(team);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
              <MapMarker color={getColorFromArea(team.area || '')} />
            </div>
          </Marker>
          {showGroupCircles && team.apiId != HOME_TEAM_API_ID && (
            <Source key={team.apiId} id={`circle-team-${team.apiId}`} type="geojson" data={createCircle(team.location.coordinates[0], team.location.coordinates[1], 500)}>
              <Layer
                id={`circle-team-layer-${team.apiId}`}
                type="fill"
                paint={{
                  'fill-color': `${getColorFromArea(team.area || '')}`,
                  'fill-opacity': 0.2,
                }}
              />
            </Source>
          )}
        </>
      ));
  }, [teams, isVisible]);

  return (
    <>
      {markers}
      {activeTeam && (
        <MapPopup longitude={activeTeam.location.coordinates[0]} latitude={activeTeam.location.coordinates[1]} onClose={() => setActiveTeam(undefined)}>
          <div className="mr-6 flex flex-col gap-3 w-full">
            <div>
              <h2 className="font-semibold">{activeTeam.name}</h2>
              <div className="flex items-center gap-1">
                <p>Deelgebied</p>
                <Badge
                  variant={'outline'}
                  className="text-white border-0"
                  style={{
                    backgroundColor: getColorFromArea(activeTeam.area || ''),
                  }}
                >
                  {activeTeam.area ?? 'Onbekend'}
                </Badge>
              </div>
              <p>Accomodatie: {activeTeam.accomodation}</p>
              <p>
                {activeTeam.street} {activeTeam.houseNumber} {activeTeam.houseNumberAddition}
              </p>
              <p>
                {activeTeam.postCode} {activeTeam.city}
              </p>
            </div>
            {/* Select with areas */}
            <div className="flex flex-col gap-2">
              <Select onValueChange={handleAreaChange} value={activeTeam.area ?? undefined}>
                <SelectTrigger autoFocus={false}>
                  <SelectValue placeholder="Kies deelgebied..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null as any}>Onbekend</SelectItem>
                  {areas?.map((area) => (
                    <SelectItem key={area._id} value={area.name}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <GoogleMapsButton lat={activeTeam.location.coordinates[1]} lng={activeTeam.location.coordinates[0]} />
            </div>
          </div>
        </MapPopup>
      )}
    </>
  );
}
