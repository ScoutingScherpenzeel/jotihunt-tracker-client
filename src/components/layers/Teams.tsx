import { Marker } from 'react-map-gl';
import { useTeams } from '../../hooks/teams.hook';
import MapMarker from '../map/MapMarker';
import { useMemo, useState } from 'react';
import { Team } from '@/types/Team';
import MapPopup from '../map/MapPopup';
import { getColorFromArea } from '@/lib/utils';
import { useAreas } from '@/hooks/areas.hook';
import GoogleMapsButton from '../map/GoogleMapsButton';

export default function Teams() {
  const { teams } = useTeams();
  const { isVisible } = useAreas();

  const [activeTeam, setActiveTeam] = useState<Team>();

  const markers = useMemo(
    () =>
      teams
        ?.filter((team) => isVisible(team.area || ''))
        .map((team) => (
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
        )),
    [teams, isVisible],
  );

  return (
    <>
      {markers}
      {activeTeam && (
        <MapPopup longitude={activeTeam.location.coordinates[0]} latitude={activeTeam.location.coordinates[1]} onClose={() => setActiveTeam(undefined)}>
          <div className="mr-6 flex flex-col gap-3 w-full">
            <div>
              <h2 className="font-semibold">{activeTeam.name}</h2>
              <p>Accomodatie: {activeTeam.accomodation}</p>
              <p>
                {activeTeam.street} {activeTeam.houseNumber} {activeTeam.houseNumberAddition}
              </p>
              <p>
                {activeTeam.postCode} {activeTeam.city}
              </p>
            </div>
            <GoogleMapsButton lat={activeTeam.location.coordinates[1]} lng={activeTeam.location.coordinates[0]} />
          </div>
        </MapPopup>
      )}
    </>
  );
}
