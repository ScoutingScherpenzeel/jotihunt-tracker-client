import { useMarkers } from "@/hooks/markers.hook";
import { useMemo, useState } from "react";
import { Layer, Marker as MapMarker, Source } from "react-map-gl";
import foxIcon from "@/assets/images/fox.svg";
import { capitalizeFirstLetter, getColorFromArea } from "@/lib/utils";
import { Marker } from "@/api";
import MapPopup from "../map/MapPopup";
import { useAreas } from "@/hooks/areas.hook";

export default function Hints() {
  const { markers } = useMarkers();
  const { isVisible } = useAreas();

  const [activeMarker, setActiveMarker] = useState<Marker>();

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
