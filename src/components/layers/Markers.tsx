import { useMarkers } from '@/hooks/markers.hook';
import {useCallback, useMemo, useState} from 'react';
import { Layer, Marker as MapMarker, Source } from 'react-map-gl/mapbox';
import foxHint from '@/assets/images/fox-hint.svg';
import foxHunt from '@/assets/images/fox-hunt.svg';
import foxSpot from '@/assets/images/fox-spot.svg';
import fox from '@/assets/images/fox.svg';
import { capitalizeFirstLetter, getColorFromArea } from '@/lib/utils';
import { Marker } from '@/types/Marker';
import MapPopup from '../map/MapPopup';
import { useAreas } from '@/hooks/areas.hook';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '../ui/use-toast';
import PropTypes, { InferProps } from 'prop-types';
import { Trash2Icon } from 'lucide-react';
import proj4 from 'proj4';
import { MarkerType } from '@/types/MarkerType';
import GoogleMapsButton from '../map/GoogleMapsButton';

export default function Markers({ part1 = true, part2 = true }: InferProps<typeof Markers.propTypes>) {
  const { markers, deleteMarker } = useMarkers();
  const { isVisible } = useAreas();

  const [activeMarker, setActiveMarker] = useState<Marker>();

  const startTime = new Date(import.meta.env.HUNT_START_TIME);
  const endTime = new Date(import.meta.env.HUNT_END_TIME);
  const midnight = new Date(startTime);
  midnight.setHours(24, 0, 0, 0);

  /**
   * Get a specific icon for a marker type.
   * @param type The type of marker.
   * @returns The image source for the icon.
   */
  function getIconForType(type: MarkerType) {
    switch (type) {
      case MarkerType.Hint:
        return foxHint;
      case MarkerType.Hunt:
        return foxHunt;
      case MarkerType.Spot:
        return foxSpot;
      default:
        return fox;
    }
  }

  /**
   * Action to delete a marker.
   * @param marker The marker to delete.
   */
  async function deleteMarkerAction(marker: Marker) {
    const result = await deleteMarker(marker._id!);
    if (result) {
      setActiveMarker(undefined);
      toast({
        title: 'Marker verwijderd!',
        description: 'De marker is succesvol verwijderd.',
      });
    } else {
      toast({
        title: 'Fout bij verwijderen marker.',
        description: 'Er is iets fout gegaan bij het verwijderen van de marker. Probeer het later opnieuw.',
        variant: 'destructive',
      });
    }
  }

  /**
   * Helper function to filter markers based on time and visibility.
   * @param markers The markers to filter.
   * @returns The filtered markers.
   */
  const filterByTimeAndVisibility = useCallback((markers: Marker[]) => {
      return markers.filter((marker) => {
          const markerTime = new Date(marker.time);

          // Part 1: From HUNT_START_TIME until MIDNIGHT (00:00)
          if (part1 && markerTime >= startTime && markerTime < midnight) {
              return isVisible(marker.area);
          }

          // Part 2: From MIDNIGHT until HUNT_END_TIME
          if (part2 && markerTime >= midnight && markerTime <= endTime) {
              return isVisible(marker.area);
          }

          // If neither part1 nor part2 matches, or the area is not visible, filter out the marker
          return false;
      });
  }, [part1, part2, isVisible]);

  /**
   * Filter markers based on time and visibility
   */
  const visibleMarkers = useMemo(() => {
    if (!markers) return [];
    return filterByTimeAndVisibility(markers);
  }, [markers, filterByTimeAndVisibility]);

  /**
   * Group and sort markers by area for line creation
   */
  const sortedGroupedMarkers = useMemo(() => {
    const groupedMarkers = visibleMarkers.reduce(
      (acc, marker) => {
        if (!acc[marker.area]) {
          acc[marker.area] = [];
        }
        acc[marker.area].push(marker);
        return acc;
      },
      {} as Record<string, Marker[]>,
    );

    Object.keys(groupedMarkers).forEach((area) => {
      groupedMarkers[area].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    });

    return groupedMarkers;
  }, [visibleMarkers]);

  /**
   * Create line sources based on visible markers
   */
  const lineSources = useMemo(() => {
    return Object.keys(sortedGroupedMarkers).map((area) => {
      const coordinates = sortedGroupedMarkers[area].map((marker) => marker.location.coordinates);
      return {
        id: `${area}`,
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      };
    }) as { id: string; data: GeoJSON.Feature<GeoJSON.LineString> }[];
  }, [sortedGroupedMarkers]);

  /**
   * Create map markers
   */
  const mapMarkers = useMemo(() => {
    return visibleMarkers?.map((marker) => (
      <MapMarker
        key={marker._id}
        longitude={marker.location.coordinates[0]}
        latitude={marker.location.coordinates[1]}
        anchor="center"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setActiveMarker(marker);
        }}
        style={{ cursor: 'pointer', zIndex: 10 }}
      >
        <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
          <img alt={"marker"} src={getIconForType(marker.type)} className="h-10" />
        </div>
      </MapMarker>
    ));
  }, [visibleMarkers]);

  return (
    <>
      {mapMarkers}
      {lineSources.map((lineSource) => (
        <Source key={lineSource.id} id={lineSource.id} type="geojson" data={lineSource.data}>
          <Layer
            id={`lineLayer-${lineSource.id}`}
            type="line"
            paint={{
              'line-color': getColorFromArea(lineSource.id),
              'line-width': 3,
            }}
          />
        </Source>
      ))}
      {activeMarker && (
        <MapPopup longitude={activeMarker.location.coordinates[0]} latitude={activeMarker.location.coordinates[1]} onClose={() => setActiveMarker(undefined)} offset={{ bottom: [0, -20] }}>
          <div className="flex flex-col gap-2">
            <div>
              <h2 className="font-semibold">
                {capitalizeFirstLetter(activeMarker.area)} -{' '}
                {new Date(activeMarker.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </h2>
              <p>Soort marker: {capitalizeFirstLetter(activeMarker.type)}</p>
              <p>Breedtegraad: {activeMarker.location.coordinates[1].toFixed(7)}</p>
              <p>Lengtegraad: {activeMarker.location.coordinates[0].toFixed(7)}</p>

              <p>RD-x: {proj4('WGS84', 'RD', [activeMarker.location.coordinates[0], activeMarker.location.coordinates[1]])[0].toFixed(0)}</p>
              <p>RD-y: {proj4('WGS84', 'RD', [activeMarker.location.coordinates[0], activeMarker.location.coordinates[1]])[1].toFixed(0)}</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <GoogleMapsButton lat={activeMarker.location.coordinates[1]} lng={activeMarker.location.coordinates[0]} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Trash2Icon /> Verwijderen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                    <AlertDialogDescription>Deze actie kan niet ongedaan gemaakt worden. Dit zal alle informatie van deze marker permanent verwijderen.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMarkerAction(activeMarker)}>Doorgaan</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </MapPopup>
      )}
    </>
  );
}

Markers.propTypes = {
  part1: PropTypes.bool.isRequired,
  part2: PropTypes.bool.isRequired,
};
