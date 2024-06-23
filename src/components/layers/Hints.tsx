import { useMarkers } from "@/hooks/markers.hook";
import { useMemo, useState } from "react";
import { Layer, Marker as MapMarker, Source } from "react-map-gl";
import foxIcon from "@/assets/images/fox.svg";
import { capitalizeFirstLetter, getColorFromArea } from "@/lib/utils";
import { Marker } from "@/api";
import MapPopup from "../map/MapPopup";

export default function Hints() {
  const { markers } = useMarkers();
  const [activeMarker, setActiveMarker] = useState<Marker>();

  // Group markers by area
  const groupedMarkers = useMemo(() => {
    if (!markers) return {} as Record<string, Marker[]>;

    return markers.reduce((acc, marker) => {
      if (!acc[marker.area]) {
        acc[marker.area] = [];
      }
      acc[marker.area].push(marker);
      return acc;
    }, {} as Record<string, Marker[]>);
  }, [markers]);

  // Sort markers within each area by time
  const sortedGroupedMarkers = useMemo(() => {
    const sortedGroups: Record<string, Marker[]> = {};
    Object.keys(groupedMarkers).forEach((area) => {
      sortedGroups[area] = groupedMarkers[area]
        .slice()
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
    });
    return sortedGroups;
  }, [groupedMarkers]);

  const mapMarkers = useMemo(
    () =>
      markers?.map((marker) => (
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
      )),
    [markers]
  );

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
          <div>
            <h2 className="font-semibold">
              {capitalizeFirstLetter(activeMarker.area)} -{" "}
              {new Date(activeMarker.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <a
              href={`https://www.google.com/maps?q=${activeMarker.location.coordinates[1]},${activeMarker.location.coordinates[0]}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-500"
            >
              Bekijk op Google Maps
            </a>
          </div>
        </MapPopup>
      )}
    </>
  );
}
