import { useTeams } from '@/hooks/teams.hook';
import { createCircle, createWindSector } from '@/lib/utils';
import useCounterHuntStore from '@/stores/counterhunt.store';
import { Layer, Source } from 'react-map-gl/mapbox';

export default function HomeCircle() {
  const { teams } = useTeams();
  const homeTeam = teams?.find((team) => team.apiId == import.meta.env.HOME_TEAM_API_ID);

  // 45-degree sector, counter hunts can be up to 45 degrees (probably)
  const windAngleRange = 45;

  const { visible, direction } = useCounterHuntStore();

  if (!homeTeam) return;

  // If the counter hunt is not visible, show the home circle
  if (!visible) {
    return (
      <>
        <Source id={`circle-source-home`} type="geojson" data={createCircle(homeTeam.location.coordinates[0], homeTeam.location.coordinates[1], 500)}>
          <Layer
            id={`circle-layer-home`}
            type="fill"
            paint={{
              'fill-color': 'hsla(256, 90%, 61%, 0.2)',
              'fill-outline-color': 'hsla(256, 90%, 61%, 0.5)',
            }}
          />
        </Source>
      </>
    );
  }

  // Otherwise, show the wind sector
  return (
    <>
      <Source id={`circle-source-home`} type="geojson" data={createWindSector(homeTeam.location.coordinates[0], homeTeam.location.coordinates[1], 500, direction, windAngleRange)}>
        <Layer
          id={`circle-layer-home`}
          type="fill"
          paint={{
            'fill-color': 'hsla(256, 90%, 61%, 0.2)',
            'fill-outline-color': 'hsla(256, 90%, 61%, 0.5)',
          }}
        />
      </Source>
    </>
  );
}
