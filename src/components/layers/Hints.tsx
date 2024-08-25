import { useMarkers } from "@/hooks/markers.hook";
import { useMemo, useState } from "react";
import { Layer, Marker as MapMarker, Source } from "react-map-gl";
import foxIcon from "@/assets/images/fox.svg";
import { capitalizeFirstLetter, getColorFromArea } from "@/lib/utils";
import { Marker } from "@/api";
import MapPopup from "../map/MapPopup";
import { useAreas } from "@/hooks/areas.hook";
import { Button } from "../ui/button";
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
} from "@/components/ui/alert-dialog";
import { toast } from "../ui/use-toast";
import PropTypes, { InferProps } from "prop-types";

export default function Hints({
  part1 = true,
  part2 = true,
}: InferProps<typeof Hints.propTypes>) {
  const { markers, deleteMarker } = useMarkers();
  const { isVisible } = useAreas();

  const [activeMarker, setActiveMarker] = useState<Marker>();

  const startTime = new Date(import.meta.env.HUNT_START_TIME);
  const endTime = new Date(import.meta.env.HUNT_END_TIME);
  // midnight start of the next day
  const midnight = new Date(startTime);
  midnight.setHours(24, 0, 0, 0);

  async function deleteHint(marker: Marker) {
    const result = await deleteMarker(marker._id!);
    if (result) {
      setActiveMarker(undefined);
      toast({
        title: "Hint verwijderd!",
        description: "De hint is succesvol verwijderd.",
      });
    } else {
      toast({
        title: "Fout bij verwijderen hint.",
        description:
          "Er is iets fout gegaan bij het verwijderen van de hint. Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  }

  // Helper function to filter markers based on time and visibility
  function filterByTimeAndVisibility(markers: Marker[]): Marker[] {
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
  }

  // Filter markers based on time and visibility
  const visibleMarkers = useMemo(() => {
    if (!markers) return [];
    return filterByTimeAndVisibility(markers);
  }, [markers, part1, part2, isVisible]);

  // Group and sort markers by area for line creation
  const sortedGroupedMarkers = useMemo(() => {
    const groupedMarkers = visibleMarkers.reduce((acc, marker) => {
      if (!acc[marker.area]) {
        acc[marker.area] = [];
      }
      acc[marker.area].push(marker);
      return acc;
    }, {} as Record<string, Marker[]>);

    Object.keys(groupedMarkers).forEach((area) => {
      groupedMarkers[area].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    });

    return groupedMarkers;
  }, [visibleMarkers]);

  // Create line sources based on visible markers
  const lineSources = useMemo(() => {
    return Object.keys(sortedGroupedMarkers).map((area) => {
      const coordinates = sortedGroupedMarkers[area].map(
        (marker) => marker.location.coordinates
      );
      return {
        id: `${area}`,
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      };
    }) as { id: string; data: GeoJSON.Feature<GeoJSON.LineString> }[];
  }, [sortedGroupedMarkers]);

  // Create map markers
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
        style={{ cursor: "pointer" }}
      >
        <div className="hover:brightness-125 hover:scale-105 transition-all ease-in-out">
          <img src={foxIcon} className="h-8" />
        </div>
      </MapMarker>
    ));
  }, [visibleMarkers]);

  return (
    <>
      {mapMarkers}
      {lineSources.map((lineSource) => (
        <Source
          key={lineSource.id}
          id={lineSource.id}
          type="geojson"
          data={lineSource.data}
        >
          <Layer
            id={`lineLayer-${lineSource.id}`}
            type="line"
            paint={{
              "line-color": getColorFromArea(lineSource.id),
              "line-width": 3,
            }}
          />
        </Source>
      ))}
      {activeMarker && (
        <MapPopup
          longitude={activeMarker.location.coordinates[0]}
          latitude={activeMarker.location.coordinates[1]}
          onClose={() => setActiveMarker(undefined)}
          offset={{ bottom: [0, -20] }}
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">
              {capitalizeFirstLetter(activeMarker.area)} -{" "}
              {new Date(activeMarker.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild className="w-min">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/maps?q=${activeMarker.location.coordinates[1]},${activeMarker.location.coordinates[0]}`}
                >
                  Bekijk op Google Maps
                </a>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Verwijderen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deze actie kan niet ongedaan gemaakt worden. Dit zal alle
                      informatie van deze hint permanent verwijderen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteHint(activeMarker)}>
                      Doorgaan
                    </AlertDialogAction>
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

Hints.propTypes = {
  part1: PropTypes.bool.isRequired,
  part2: PropTypes.bool.isRequired,
};
