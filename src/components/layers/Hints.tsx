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

export default function Hints() {
  const { markers, deleteMarker } = useMarkers();
  const { isVisible } = useAreas();

  const [activeMarker, setActiveMarker] = useState<Marker>();

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
        description: "Er is iets fout gegaan bij het verwijderen van de hint. Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  }

  // Group and sort markers by area
  const sortedGroupedMarkers = useMemo(() => {
    if (!markers) return {} as Record<string, Marker[]>;

    const groupedMarkers = markers.reduce((acc, marker) => {
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
  }, [markers]);

  const visibleMarkers = useMemo(() => {
    return markers?.filter((marker) => isVisible(marker.area));
  }, [markers, isVisible]);

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
          <img src={foxIcon} className="h-10" />
        </div>
      </MapMarker>
    ));
  }, [visibleMarkers]);

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

  const visibleLineSources = useMemo(() => {
    return lineSources.filter((source) => isVisible(source.id));
  }, [lineSources, isVisible]);

  return (
    <>
      {mapMarkers}
      {visibleLineSources.map((lineSource) => (
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
                    <AlertDialogTitle>
                      Weet je het zeker?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Deze actie kan niet ongedaan gemaakt worden. Dit zal alle informatie van deze hint permanent verwijderen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteHint(activeMarker)}>Doorgaan</AlertDialogAction>
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
